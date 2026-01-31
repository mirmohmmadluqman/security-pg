"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Sun, Moon } from "lucide-react"

const themes = [
    { name: "dark", label: "Dark" },
    { name: "light", label: "Light" },
    { name: "cyberpunk", label: "Cyberpunk" },
    { name: "minimalist-dark", label: "Minimalist" },
    { name: "glass", label: "Glassmorphism" },
    { name: "neobrutalism", label: "Neo-Brutalism" },
    { name: "enterprise", label: "Enterprise" },
]

export function ThemeSelector() {
    const { setTheme, theme, resolvedTheme } = useTheme()

    const isMinimalist = theme?.startsWith("minimalist-")

    const toggleMinimalistMode = () => {
        if (theme === "minimalist-dark") {
            setTheme("minimalist-light")
        } else {
            setTheme("minimalist-dark")
        }
    }

    return (
        <div className="flex items-center gap-2">
            {isMinimalist && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMinimalistMode}
                    className="animate-in fade-in zoom-in duration-300"
                    title={theme === "minimalist-dark" ? "Switch to Day Mode" : "Switch to Night Mode"}
                >
                    {theme === "minimalist-dark" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    )}
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Palette className={`h-[1.2rem] w-[1.2rem] ${isMinimalist ? "" : "rotate-0 scale-100 transition-all"}`} />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className={isMinimalist
                        ? "bg-background border-border"
                        : "bg-black/80 backdrop-blur-xl border-white/10"
                    }
                >
                    {themes.map((t) => (
                        <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)}>
                            <span className={(theme === t.name || (t.name === "minimalist-dark" && isMinimalist)) ? "font-bold" : ""}>
                                {t.label}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
