import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [username] = useState(() => localStorage.getItem("username") || "User")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      window.location.href = "/"
      return
    }
  }, [])

  return (
    <div className="p-6 space-y-6">

      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>歡迎回來 👋</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg">
            使用者：<span className="font-bold">{username}</span>
          </p>

          <p className="text-sm text-muted-foreground">
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>使用者數</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系統狀態</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-500 font-bold">正常運作</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>登入狀態</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-500 font-bold">已登入</p>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}