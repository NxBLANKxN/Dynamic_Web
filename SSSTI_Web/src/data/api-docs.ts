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
    desc: "建立新帳號。帳號與密碼為必填，其餘欄位為選填。",
    requestBody: {
      username: "user_example",
      password: "secure_password",
      name: "使用者名稱 (選填)",
      phone: "0912345678 (選填)",
      address: "通訊地址 (選填)",
      role: "user"
    },
    response: { msg: "success | exists | fail" }
  },
  {
    title: "帳號登入 (User Login)",
    method: "POST",
    endpoint: "/login",
    desc: "驗證帳號密碼，返回執行結果與用戶權限。",
    requestBody: {
      username: "user_example",
      password: "secure_password"
    },
    response: { 
      msg: "success | fail",
      username: "user_example",
      role: "admin | user"
    }
  },
  {
    title: "獲取帳號列表 (Get Users)",
    method: "GET",
    endpoint: "/users",
    desc: "取得系統內所有使用者的詳細資訊清單。",
    requestBody: {},
    response: [
      {
        id: 1,
        username: "admin",
        name: "管理員",
        role: "admin",
        phone: "0000",
        address: "System"
      }
    ]
  },
  {
    title: "更新帳號資訊 (Update User)",
    method: "PUT",
    endpoint: "/users/{user_id}",
    desc: "動態更新指定 ID 的使用者資料。若不修改密碼請留空或不傳該欄位。",
    requestBody: {
      password: "new_password (選填)",
      name: "新名稱 (選填)",
      phone: "新電話 (選填)",
      address: "新地址 (選填)",
      role: "admin | user"
    },
    response: { msg: "success | no updates" }
  },
  {
    title: "刪除帳號 (Delete User)",
    method: "DELETE",
    endpoint: "/users/{user_id}",
    desc: "根據 ID 永久移除該名使用者。",
    requestBody: {},
    response: { msg: "success" }
  },
  {
    title: "獲取團隊成員列表 (Get Members)",
    method: "GET",
    endpoint: "/members",
    desc: "取得所有顯示在前端團隊頁面的成員資訊。",
    requestBody: {},
    response: [
      {
        id: 1,
        name: "姓名",
        role: "職位",
        image_url: "圖片網址",
        bio: "個人簡介"
      }
    ]
  },
  {
    title: "新增團隊成員 (Add Member)",
    method: "POST",
    endpoint: "/members",
    desc: "上傳成員資訊與照片。使用 Multipart/Form-data 格式。",
    requestBody: {
      name: "姓名",
      role: "職位",
      bio: "個人簡介 (選填)",
      file: "圖片檔案 (選填)"
    },
    response: { msg: "success" }
  },
  {
    title: "更新團隊成員 (Update Member)",
    method: "PUT",
    endpoint: "/members/{member_id}",
    desc: "更新指定 ID 的成員資料。若有傳送 file 欄位則更新圖片，否則保留原圖。使用 Multipart/Form-data 格式。",
    requestBody: {
      name: "姓名",
      role: "職位",
      bio: "個人簡介 (選填)",
      file: "新圖片檔案 (選填)"
    },
    response: { msg: "success" }
  },
  {
    title: "刪除團隊成員 (Delete Member)",
    method: "DELETE",
    endpoint: "/members/{member_id}",
    desc: "根據 ID 永久移除該名團隊成員資料。", 
    requestBody: {},
    response: { msg: "success" }
  }   
];