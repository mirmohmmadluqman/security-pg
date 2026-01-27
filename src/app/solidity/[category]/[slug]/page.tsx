'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { getLessonBySlug, getPrevNextLessons, getRemixUrl, getRemixLiteUrl, getAllCategories, getLessonsByCategory } from '@/lib/solidity'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Check, MessageCircle, Bug, BookOpen, Code2, Shield, Cpu, TestTube, Hammer, Coins, Menu, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    basic: <BookOpen className="w-4 h-4" />,
    applications: <Code2 className="w-4 h-4" />,
    hacks: <Shield className="w-4 h-4" />,
    evm: <Cpu className="w-4 h-4" />,
    tests: <TestTube className="w-4 h-4" />,
    foundry: <Hammer className="w-4 h-4" />,
    defi: <Coins className="w-4 h-4" />,
}

export default function LessonPage() {
    const params = useParams()
    const categorySlug = params.category as string
    const slug = params.slug as string

    const lesson = getLessonBySlug(categorySlug, slug)
    const { prev, next } = getPrevNextLessons(categorySlug, slug)
    const categories = getAllCategories()
    const categoryLessons = getLessonsByCategory(categorySlug)

    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)
    const [sidebarOpen, setSidebarOpen] = React.useState(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

    if (!lesson) {
        notFound()
    }

    const handleCopy = (code: string, index: number) => {
        navigator.clipboard.writeText(code)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 relative z-50 glass sticky top-0 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <Link href={`/solidity/${categorySlug}`}>
                        <Button variant="ghost" size="sm" className={cn(
                            "gap-2 text-muted-foreground",
                            isDark ? "hover:text-white" : "hover:text-foreground"
                        )}>
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{lesson.category}</span>
                        </Button>
                    </Link>
                    <div className="hidden md:block w-px h-6 bg-border" />
                    <Logo />
                </div>
                <ThemeSelector />
            </header>

            <div className="flex-1 flex">
                {/* Sidebar - toggleable */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r bg-background/50 overflow-hidden h-[calc(100vh-4rem)] sticky top-16`}>
                    <nav className="p-3 w-64">
                        <Link href={`/solidity/${categorySlug}`}>
                            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {CATEGORY_ICONS[categorySlug]}
                                <span className="font-medium">{lesson.category}</span>
                            </div>
                        </Link>
                        <div className="space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto">
                            {categoryLessons.map((l, i) => (
                                <Link key={l.slug} href={`/solidity/${categorySlug}/${l.slug}`}>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${l.slug === slug
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}>
                                        <span className="font-mono text-xs w-5 opacity-50">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="truncate">{l.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
                        {/* Lesson Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                                    Solidity ^{lesson.version}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-3">{lesson.title}</h1>
                            {lesson.description && (
                                <p className="text-lg text-muted-foreground">{lesson.description}</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={cn(
                                "prose prose-sm max-w-none mb-8",
                                isDark ? "prose-invert" : ""
                            )}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const code = String(children).replace(/\n$/, '')

                                        if (match) {
                                            // isDark is already defined in the outer scope
                                            return (
                                                <div className="relative my-6 rounded-xl overflow-hidden border border-border">
                                                    <div className={cn(
                                                        "flex items-center justify-between px-4 py-2 border-b border-border",
                                                        isDark ? "bg-[#1e1e1e]" : "bg-muted"
                                                    )}>
                                                        <span className={cn(
                                                            "text-xs font-mono",
                                                            isDark ? "text-slate-400" : "text-muted-foreground"
                                                        )}>{match[1]}</span>
                                                        <button
                                                            onClick={() => handleCopy(code, -1)}
                                                            className="p-1.5 rounded hover:bg-accent transition-colors"
                                                        >
                                                            {copiedIndex === -1 ? (
                                                                <Check className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Copy className={cn(
                                                                    "w-4 h-4",
                                                                    isDark ? "text-slate-400" : "text-muted-foreground"
                                                                )} />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="max-h-[500px] overflow-y-auto">
                                                        <SyntaxHighlighter
                                                            style={isDark ? vscDarkPlus : undefined}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            showLineNumbers
                                                            customStyle={{
                                                                margin: 0,
                                                                padding: '1rem',
                                                                background: isDark ? '#1e1e1e' : '#f8f9fa',
                                                                fontSize: '0.8rem',
                                                            }}
                                                        >
                                                            {code}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return (
                                            <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
                                    h2: ({ children }) => <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{children}</h3>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>,
                                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                                    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                                    a: ({ href, children }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {lesson.content}
                            </ReactMarkdown>
                        </motion.div>

                        {/* Prev/Next Navigation */}
                        <div className="flex items-center justify-between gap-4 py-6 border-t border-b mb-8">
                            {prev ? (
                                <Link href={`/solidity/${categorySlug}/${prev.slug}`}>
                                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                        <ChevronLeft className="w-4 h-4" />
                                        {prev.title}
                                    </span>
                                </Link>
                            ) : <div />}
                            {next ? (
                                <Link href={`/solidity/${categorySlug}/${next.slug}`}>
                                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                        {next.title}
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </Link>
                            ) : <div />}
                        </div>

                        {/* Try on Remix Section - like solidity-by-example.org */}
                        {lesson.codes.length > 0 && (
                            <div className="mb-8 space-y-6">
                                {/* Try on Remix */}
                                <div>
                                    <h3 className="text-lg font-bold mb-3">Try on Remix</h3>
                                    <ul className="space-y-2">
                                        {lesson.codes.map((file, i) => (
                                            <li key={`remix-${i}`}>
                                                <a
                                                    href={getRemixUrl(file.code, file.fileName)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                                >
                                                    {file.fileName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Try on Remix Lite */}
                                <div>
                                    <h3 className="text-lg font-bold mb-3">Try on Remix Lite</h3>
                                    <ul className="space-y-2">
                                        {lesson.codes.map((file, i) => (
                                            <li key={`remix-lite-${i}`}>
                                                <a
                                                    href={getRemixLiteUrl(file.code)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                                >
                                                    {file.fileName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <a
                                href="https://discord.gg/qMd7jwV7UG"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Discord
                            </a>
                            <a
                                href="https://github.com/mirmohmmadluqman/security-pg/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Bug className="w-4 h-4" />
                                Report Issues
                            </a>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>© 2026 Mir Mohmmad Luqman. All rights reserved.</span>
                            <span className="px-2 py-1 rounded bg-muted text-xs">Open-source</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
