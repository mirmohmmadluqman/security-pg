"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { ConnectButton } from './ConnectButton'
import { ThemeSelector } from './ThemeSelector'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import {
    Layout,
    BookOpen,
    Trophy,
    Code2,
    PlayCircle,
    Menu,
    X
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
    { name: 'Home', href: '/', icon: Layout },
    { name: 'Challenges', href: '/challenges', icon: PlayCircle },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Solidity', href: '/solidity', icon: Code2 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'DVD', href: '/dvd', icon: PlayCircle },
]

export function Header() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
                isScrolled
                    ? "h-16 bg-background/80 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                    : "h-20 bg-transparent border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-sm font-mono uppercase tracking-widest transition-all relative group overflow-hidden",
                                        isActive
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-0 bg-primary/5 group-hover:h-full transition-all duration-300" />
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-4">
                        <ConnectButton />
                        <ThemeSelector />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l border-primary/20 w-[300px]">
                                <div className="flex flex-col gap-8 py-12">
                                    <Logo className="mb-4" />
                                    <nav className="flex flex-col gap-4">
                                        {NAV_LINKS.map((link) => {
                                            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                                            const Icon = link.icon
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={cn(
                                                        "flex items-center gap-4 px-4 py-3 text-lg font-mono uppercase tracking-widest transition-all rounded-none",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border border-primary/30"
                                                            : "text-muted-foreground hover:bg-secondary"
                                                    )}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {link.name}
                                                </Link>
                                            )
                                        })}
                                    </nav>
                                    <div className="mt-auto flex flex-col gap-4">
                                        <ConnectButton />
                                        <div className="flex justify-center">
                                            <ThemeSelector />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
