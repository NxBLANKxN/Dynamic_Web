from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import sqlite3
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 資料模型 (Data Models) ---
class User(BaseModel):
    username: str
    password: str
    name: str
    phone: str
    address: str
    role: Optional[str] = "user"

class UserUpdate(BaseModel):
    password: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None

class LoginUser(BaseModel):
    username: str
    password: str

# --- 資料庫初始化 ---
def init_db():
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            name TEXT,
            phone TEXT,
            address TEXT,
            role TEXT DEFAULT 'user'
        )
    """)
    
    admin_username = "admin"
    admin_password = "1qaz@WSX3edc"
    
    c.execute("SELECT id FROM User WHERE username = ?", (admin_username,))
    if not c.fetchone():
        hashed = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        c.execute("""
            INSERT INTO User (username, password, name, phone, address, role)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (admin_username, hashed.decode('utf-8'), "系統管理員", "0000", "System", "admin"))
        print(f"[*] 初始管理員帳號 '{admin_username}' 已建立。")
        
    conn.commit()
    conn.close()

init_db()

# --- 1. 登入與註冊 ---

@app.post("/login")
def login(user: LoginUser):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    c.execute("SELECT password, role FROM User WHERE username = ?", (user.username,))
    row = c.fetchone()
    conn.close()

    if row and bcrypt.checkpw(user.password.encode("utf-8"), row[0].encode("utf-8")):
        return {"msg": "success", "username": user.username, "role": row[1]}
    return {"msg": "fail"}

@app.post("/register")
def register(user: User):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    try:
        hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        # 注意：此處允許帶入 role 是為了方便管理員在設定頁面新增帳號
        c.execute("""
            INSERT INTO User (username, password, name, phone, address, role)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user.username, hashed.decode('utf-8'), user.name, user.phone, user.address, user.role))
        conn.commit()
        return {"msg": "success"}
    except sqlite3.IntegrityError:
        return {"msg": "exists"}
    finally:
        conn.close()

# --- 2. 帳號管理 API (設定頁面使用) ---

# 獲取所有使用者列表
@app.get("/users")
def get_users():
    conn = sqlite3.connect("user.db")
    conn.row_factory = sqlite3.Row # 讓回傳結果變成字典格式
    c = conn.cursor()
    c.execute("SELECT id, username, name, phone, address, role FROM User")
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# 更新使用者資訊
@app.put("/users/{user_id}")
def update_user(user_id: int, user_data: UserUpdate):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    
    # 檢查使用者是否存在
    c.execute("SELECT id FROM User WHERE id = ?", (user_id,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # 動態構建 SQL 更新語句
    updates = []
    params = []
    if user_data.name:
        updates.append("name = ?")
        params.append(user_data.name)
    if user_data.phone:
        updates.append("phone = ?")
        params.append(user_data.phone)
    if user_data.address:
        updates.append("address = ?")
        params.append(user_data.address)
    if user_data.role:
        updates.append("role = ?")
        params.append(user_data.role)
    if user_data.password and user_data.password.strip() != "":
        hashed = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        updates.append("password = ?")
        params.append(hashed.decode('utf-8'))

    if not updates:
        conn.close()
        return {"msg": "no updates"}

    params.append(user_id)
    sql = f"UPDATE User SET {', '.join(updates)} WHERE id = ?"
    c.execute(sql, tuple(params))
    conn.commit()
    conn.close()
    return {"msg": "success"}

# 刪除使用者
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    
    # 防止刪除最後一個管理員或當前管理員（可視需求增加邏輯）
    c.execute("DELETE FROM User WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"msg": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)