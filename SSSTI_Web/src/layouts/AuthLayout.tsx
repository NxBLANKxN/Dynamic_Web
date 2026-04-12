import {useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function AuthLayout({ children }: { children:React.ReactNode }) {
  const [dark, setDark] = useState(() => {
  const saved = localStorage.getItem("theme")
    return saved ? saved === "dark" : true
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  const toggleTheme = () => {
    setDark(prev => !prev)
  }


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* HEADER */}
      <header className="h-14 border-b flex items-center justify-between px-6">

        <div className="font-bold">
          智慧蝦隻辨識系統
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

      </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="h-10 border-t flex items-center justify-center text-xs text-muted-foreground">
        © 2026 智慧蝦隻辨識系統．版權所有
      </footer>

    </div>
  )
}