from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 測試環境可用 "*"，正式環境請指定前端網址
    allow_credentials=True,
    allow_methods=["*"], # 這裡必須包含 POST 和 OPTIONS
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str
    name: str
    phone: str
    address: str

class LoginUser(BaseModel):
    username: str
    password: str


# 初始化 DB
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
            address TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.post("/login")
def login(user: LoginUser):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()

    c.execute("SELECT password FROM User WHERE username = ?", (user.username,))
    row = c.fetchone()

    conn.close()

    if not row:
        return {"msg": "fail"}

    if not bcrypt.checkpw(
        user.password.encode("utf-8"),
        row[0].encode("utf-8")
    ):
        return {"msg": "fail"}

    return {"msg": "success"}

@app.post("/register")
def register(user: User):
    conn = sqlite3.connect("user.db")
    c = conn.cursor()

    try:
        # 1. 先檢查帳號是否存在
        c.execute("SELECT id FROM User WHERE username = ?", (user.username,))
        if c.fetchone():
            return {"msg": "exists"}

        # 2. 加密密碼
        hashed = bcrypt.hashpw(
            user.password.encode('utf-8'),
            bcrypt.gensalt()
        )

        # 3. 寫入 DB
        c.execute("""
            INSERT INTO User (username, password, name, phone, address)
            VALUES (?, ?, ?, ?, ?)
        """, (
            user.username,
            hashed.decode('utf-8'),
            user.name,
            user.phone,
            user.address
        ))

        conn.commit()
        return {"msg": "success"}

    except Exception as e:
        print("DB ERROR:", e)
        return {"msg": "fail"}

    finally:
        conn.close()
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 