import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircleIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Login() {
	const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    // 🔥 1. 必填驗證
    if (!username || !password) {
      setErrorMsg("帳號與密碼不能為空")
      setError(true)
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.msg === "success") {
        localStorage.setItem("token", "ok")
				localStorage.setItem("username", username)
        navigate("/dashboard") 
      } else {
        setErrorMsg("帳號或密碼錯誤")
        setError(true)
      }

    } catch {
      setErrorMsg("系統錯誤，請稍後再試")
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-auto">
      <Card className="w-87.5">

        <CardHeader>
          <CardTitle>登入</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* ❌ error modal */}
          {error && (
            <div className="fixed inset-0 m-0 z-50 flex items-center justify-center">

              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setError(false)}
              />

              <div className="relative z-10 w-[90%] max-w-md rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-6 border border-red-500">

                <div className="flex items-center gap-2 mb-3">
                  <AlertCircleIcon className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-bold text-red-500">
                    登入失敗
                  </h3>
                </div>

                <p className="text-lg text-muted-foreground">
                  {errorMsg}
                </p>

                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setError(false)}>
                    確認
                  </Button>
                </div>

              </div>
            </div>
          )}

          <Input
            placeholder="帳號"
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="密碼"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "登入中..." : "登入"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/register")}
          >
            前往註冊
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}