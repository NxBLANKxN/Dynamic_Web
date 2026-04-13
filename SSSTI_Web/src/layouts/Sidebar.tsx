import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-background border-r z-50 transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >

      {/* 關閉 */}
      <div className="p-3 flex justify-end">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="space-y-2 p-3">

        <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href="/dashboard"}>
          🏠 主頁
        </Button>

        <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href="/members"}>
          👤 成員(開發中)
        </Button>

        <Button variant="ghost" className="w-full justify-start">
          ⚙️ 設定(開發中)
        </Button>

      </div>
    </aside>
  )
}