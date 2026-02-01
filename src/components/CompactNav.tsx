'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from './Logo'
import { ThemeSelector } from './ThemeSelector'
import { Button } from './ui/button'
import { ArrowLeft, Home, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompactNavProps {
    backHref?: string
    backLabel?: string
    showTheme?: boolean
    children?: React.ReactNode
}

export function CompactNav({ backHref, backLabel = "Back", showTheme = true, children }: CompactNavProps) {
    const router = useRouter()

    return (
        <nav className="h-12 border-b border-border bg-background flex items-center justify-between px-4 shrink-0 z-[100] sticky top-0 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none"
                        title="Go Home"
                    >
                        <Home size={18} />
                    </Button>
                </Link>

                <div className="w-px h-6 bg-border" />

                {backHref ? (
                    <Link href={backHref}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground h-8 px-2 rounded-none"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">{backLabel}</span>
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2 text-muted-foreground hover:text-foreground h-8 px-2 rounded-none"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">Back</span>
                    </Button>
                )}

                <div className="hidden lg:flex items-center gap-2 ml-2 transition-opacity">
                    <Logo scale={0.7} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {children}
                <div className="w-px h-6 bg-border mx-1" />
                {showTheme && <ThemeSelector />}
            </div>
        </nav>
    )
}
