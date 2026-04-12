import { Button } from "@/components/ui/button"
import {useEffect, useState } from "react"
import {Menu, Sun, Moon } from "lucide-react"

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
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
	setDark(prev => !prev)}

	return (
	<header className="h-14 border-b flex items-center  px-4 bg-background">

		<div className="flex gap-4 items-center">
			<Button variant="ghost" size="icon" onClick={onMenuClick}>
				<Menu />
			</Button>
			<div className="font-bold">
				智慧蝦隻辨識系統
			</div>
		</div>

		<div className="flex-1"/>
		<div className="flex gap-4 items-center">
			<Button
				variant="outline"
				onClick={() => {
					localStorage.removeItem("token")
					window.location.href = "/"
				}}
				>
				登出
			</Button>
			<Button variant="ghost" size="icon" onClick={toggleTheme}>
				{dark ? <Moon size={18} /> : <Sun size={18} />}
			</Button>
		</div>

	</header>
	)
}
