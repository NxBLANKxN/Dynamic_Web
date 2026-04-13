export interface ApiSpec {
  title: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  endpoint: string;
  desc: string;
  requestBody: object;
  response: object;
}

export const API_LIST: ApiSpec[] = [
  {
    title: "帳號註冊 (User Registration)",
    method: "POST",
    endpoint: "/register",
    desc: "接收 JSON 格式的使用者資訊，包含清洗過的字串並存入 SQLite 資料庫。",
    requestBody: {
      username: "user_example",
      password: "secure_password",
      name: "使用者名稱",
      phone: "0912345678",
      address: "台北市..."
    },
    response: { msg: "success | exists | fail" }
  },
  {
    title: "帳號登入 (User Login)",
    method: "POST",
    endpoint: "/login",
    desc: "驗證帳號密碼，成功後於客戶端 localStorage 儲存 Token 與用戶名。",
    requestBody: {
      username: "user_example",
      password: "secure_password"
    },
    response: { msg: "success | fail" }
  }
];