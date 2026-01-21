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
import { Palette } from "lucide-react"

const themes = [
    { name: "light", label: "Light" },
    { name: "dark", label: "Dark" },
    { name: "cyberpunk", label: "Cyberpunk" },
    { name: "minimalist", label: "Minimalist" },
    { name: "glass", label: "Glassmorphism" },
    { name: "neobrutalism", label: "Neo-Brutalism" },
    { name: "enterprise", label: "Enterprise" },
]

export function ThemeSelector() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-xl border-white/10">
                {themes.map((t) => (
                    <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)}>
                        <span className={theme === t.name ? "font-bold" : ""}>
                            {t.label}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
