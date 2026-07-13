import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/components/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement
    setTheme(root.classList.contains("dark") ? "dark" : "light")
  }, [])

  const toggle = () => {
    const root = window.document.documentElement
    const next = theme === "light" ? "dark" : "light"
    if (next === "dark") {
      root.classList.add("dark")
      root.setAttribute("data-theme", "github-dark")
    } else {
      root.classList.remove("dark")
      root.setAttribute("data-theme", "github-light")
    }
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  )
}
