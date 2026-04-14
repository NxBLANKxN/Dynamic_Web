import os
import sqlite3
import bcrypt
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

# 跨域配置 (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- 資料模型 (Data Models) ---

class LoginUser(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    name: str
    phone: str
    address: str
    role: str

class MemberResponse(BaseModel):
    id: int
    name: str
    role: str
    image_url: Optional[str] = None
    bio: Optional[str] = None

# --- 資料庫初始化 ---

def init_db():
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    # User 表: 系統登入與權限管理
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
    # Member 表: 前端團隊頁面展示
    c.execute("""
        CREATE TABLE IF NOT EXISTS Member (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            image_url TEXT,
            bio TEXT
        )
    """)
    # 預設管理員 (admin / 1qaz@WSX3edc)
    c.execute("SELECT id FROM User WHERE username = 'admin'")
    if not c.fetchone():
        hashed = bcrypt.hashpw("1qaz@WSX3edc".encode('utf-8'), bcrypt.gensalt())
        c.execute("INSERT INTO User (username, password, name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
                  ("admin", hashed.decode('utf-8'), "系統管理員", "0000", "System", "admin"))
    conn.commit()
    conn.close()

init_db()

# --- 1. 帳號與登入 API (User & Settings) ---

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

@app.get("/users")
def get_users():
    conn = sqlite3.connect("user.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, username, name, phone, address, role FROM User")
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/register")
def register(user: UserRegister):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    try:
        hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        c.execute("INSERT INTO User (username, password, name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
                  (user.username, hashed.decode('utf-8'), user.name, user.phone, user.address, user.role))
        conn.commit()
        return {"msg": "success"}
    except sqlite3.IntegrityError:
        return {"msg": "exists"}
    finally:
        conn.close()

@app.put("/users/{user_id}")
async def update_user(user_id: int, user_data: dict):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    updates = []
    params = []
    for field in ["name", "phone", "address", "role"]:
        if field in user_data:
            updates.append(f"{field} = ?")
            params.append(user_data[field])
    if user_data.get("password"):
        hashed = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())
        updates.append("password = ?")
        params.append(hashed.decode('utf-8'))
    if updates:
        params.append(user_id)
        c.execute(f"UPDATE User SET {', '.join(updates)} WHERE id = ?", tuple(params))
        conn.commit()
    conn.close()
    return {"msg": "success"}

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    c.execute("DELETE FROM User WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"msg": "success"}

# --- 2. 團隊成員 API (Members) ---

@app.get("/members", response_model=List[MemberResponse])
def get_members():
    conn = sqlite3.connect("user.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, name, role, image_url, bio FROM Member")
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# 新增成員 (POST)
@app.post("/members")
async def add_member(
    name: str = Form(...), 
    role: str = Form(...), 
    bio: str = Form(""),
    file: Optional[UploadFile] = File(None)
):
    image_url = ""
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        image_url = f"http://127.0.0.1:8000/uploads/{file.filename}"

    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    c.execute("INSERT INTO Member (name, role, image_url, bio) VALUES (?, ?, ?, ?)", 
              (name, role, image_url, bio))
    conn.commit()
    conn.close()
    return {"msg": "success"}

# 修改成員 (PUT) - 支援圖片更新
@app.put("/members/{member_id}")
async def update_member(
    member_id: int,
    name: str = Form(...),
    role: str = Form(...),
    bio: str = Form(""),
    file: Optional[UploadFile] = File(None)
):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    
    # 如果有上傳新檔案，更新圖片網址；否則保留原樣
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        image_url = f"http://127.0.0.1:8000/uploads/{file.filename}"
        c.execute("UPDATE Member SET name=?, role=?, bio=?, image_url=? WHERE id=?", 
                  (name, role, bio, image_url, member_id))
    else:
        c.execute("UPDATE Member SET name=?, role=?, bio=? WHERE id=?", 
                  (name, role, bio, member_id))
    
    conn.commit()
    conn.close()
    return {"msg": "success"}

# 刪除成員 (DELETE)
@app.delete("/members/{member_id}")
def delete_member(member_id: int):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()
    c.execute("DELETE FROM Member WHERE id = ?", (member_id,))
    conn.commit()
    conn.close()
    return {"msg": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)