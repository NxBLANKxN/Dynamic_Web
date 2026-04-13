import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Member = {
  id:number
  name: string
  role: string
}

const members: Member[] = [
  { id:1,name: "吳竣霆", role: "全端工程師" },
  { id:2,name: "毛柏竣", role: "UI/UX設計師" },
]

export default function Members() {
  return (
    <div className="min-h-full flex flex-col items-center p-4 sm:p-6">

      {/* Title（可置中） */}
      <div className="text-center mb-6">
        <p className="text-2xl font-bold ">團隊成員</p>
        <p className="text-muted-foreground text-sm">
          系統開發團隊列表
        </p>
      </div>

      {/* Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">

        {members.map((m, i) => (
          <Card key={i} className="hover:shadow-md transition">

            <CardHeader className="flex flex-row items-center gap-4">

              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {m.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* 文字（左對齊） */}
              <div className="text-left">
                <CardTitle className="text-base">
                  {m.name}
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  {m.role}
                </p>
              </div>

            </CardHeader>

          </Card>
        ))}

      </div>
    </div>
  )
}