import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircleIcon } from "lucide-react"

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    address: "",
  })

  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const clean = (str: string) => str.replace(/[<>{}]/g, "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {

    if (!form.username || !form.password) {
      setErrorMsg("帳號與密碼為必填")
      setError(true)
      return
    }


    if (form.username.length < 4) {
      setErrorMsg("帳號至少 4 個字")
      setError(true)
      return
    }

    if (form.password.length < 6) {
      setErrorMsg("密碼至少 6 碼")
      setError(true)
      return
    }

    setLoading(true)

    try {

      const payload = {
        username: clean(form.username),
        password: clean(form.password),
        name: clean(form.name),
        phone: clean(form.phone),
        address: clean(form.address),
      }

      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log(data)

      if (data.msg === "success") {
        setSuccess(true)
        setError(false)
        return
      }

      if (data.msg === "exists") {
        setErrorMsg("帳號已存在或註冊失敗")
        setError(true)
        setSuccess(false)
        return
      }

      setErrorMsg("系統錯誤")
      setError(true)
      setSuccess(false)

    } catch  {
      setErrorMsg("網路錯誤，請稍後再試")
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-auto">

      <Card className="w-100">
        <CardHeader>
          <CardTitle>註冊帳號</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <Input name="username" placeholder="*帳號" onChange={handleChange} />
          <Input name="password" type="password" placeholder="*密碼" onChange={handleChange} />
          <Input name="name" placeholder="姓名" onChange={handleChange} />
          <Input name="phone" placeholder="電話" onChange={handleChange} />
          <Input name="address" placeholder="地址" onChange={handleChange} />

          <Button
            type="button"
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "註冊中..." : "註冊"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/")}
          >
            回登入
          </Button>

        </CardContent>
      </Card>

      {/* ❌ error modal */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setError(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-xl w-[90%] max-w-md border border-red-500">

            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircleIcon />
              <h3 className="font-bold text-red-500">註冊失敗</h3>
            </div>

            <p className="text-lg text-muted-foreground">
              {errorMsg}
            </p>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setError(false)}>
                關閉
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ✅ success modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSuccess(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-xl w-[90%] max-w-md border border-green-500">

            <h2 className="font-bold text-green-500 mb-2">
              註冊成功
            </h2>

            <Button
              className="mt-4 bg-green-500 hover:bg-green-600"
              onClick={() => {
                setSuccess(false)
                window.location.href = "/"
              }}
            >
              去登入
            </Button>

          </div>
        </div>
      )}

    </div>
  )
}