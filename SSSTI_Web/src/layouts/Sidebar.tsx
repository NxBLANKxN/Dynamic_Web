import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  X, 
  Home, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Terminal, 
  Database,
  MenuIcon
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const currentRole = localStorage.getItem("role")
    setRole(currentRole)
  }, [open])

  const isAdmin = role === "admin"
  const isActive = (path: string) => location.pathname === path

  const handleNav = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-background border-r z-50 transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-200">
          <MenuIcon className="h-5 w-5 text-blue-500" />
          <span className="tracking-wide font-bold">系統導覽</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:rotate-90 transition-transform">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-3 py-4 space-y-6 overflow-y-auto h-[calc(100%-70px)]">
        
        {/* --- 一般功能 (所有人可見) --- */}
        <div>
          <p className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Main Services
          </p>
          <div className="space-y-1">
            <Button 
              variant={isActive("/") ? "secondary" : "ghost"} 
              className={cn("w-full justify-start gap-3", isActive("/") && "bg-blue-50 text-blue-600 dark:bg-blue-900/30")} 
              onClick={() => handleNav("/")}
            >
              <Home className="h-4 w-4" /> 首頁 (Home)
            </Button>

            {/* ✅ 移至此處：一般使用者也可以查看後端網頁 */}
            <Button 
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-3", isActive("/dashboard") && "bg-blue-50 text-blue-600 dark:bg-blue-900/30")} 
              onClick={() => handleNav("/dashboard")}
            >
              <LayoutDashboard className="h-4 w-4 text-blue-500" /> 後端儀表板
            </Button>
          </div>
        </div>

        {/* --- 管理員專屬功能 (僅 Admin 可見) --- */}
        {isAdmin && (
          <>
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <p className="px-4 mb-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                Data Management
              </p>
              <div className="space-y-1">
                <Button 
                  variant={isActive("/members") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive("/members") && "bg-blue-50 text-blue-600 dark:bg-blue-900/30")} 
                  onClick={() => handleNav("/members")}
                >
                  <Users className="h-4 w-4" /> 成員管理
                </Button>
                
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground/60 hover:text-foreground">
                  <Database className="h-4 w-4" /> 資料庫狀態
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground/60 hover:text-foreground">
                  <Terminal className="h-4 w-4" /> API 日誌
                </Button>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <p className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t pt-4">
                System Advanced
              </p>
              <div className="space-y-1">
                <Button 
                  variant={isActive("/settings") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive("/settings") && "bg-blue-50 text-blue-600 dark:bg-blue-900/30")}
                  onClick={() => handleNav("/settings")}
                >
                  <Settings className="h-4 w-4" /> 系統設定
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-2">
          <div className={cn("h-2 w-2 rounded-full", isAdmin ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-blue-400")} />
          <span className="text-[11px] font-medium text-muted-foreground italic">
            {isAdmin ? "超級管理員" : "一般使用者"}
          </span>
        </div>
      </div>
    </aside>
  )
}