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
import { CompactNav } from '@/components/CompactNav'
import { Footer } from '@/components/Footer'
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

const CodeBlock = ({ language, code, isDark }: { language: string, code: string, isDark: boolean }) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative my-6 rounded-none overflow-hidden border border-primary/20 shadow-xl">
            <div className={cn(
                "flex items-center justify-between px-4 py-2 border-b border-primary/20",
                isDark ? "bg-[#1e1e1e]" : "bg-muted"
            )}>
                <span className={cn(
                    "text-xs font-mono",
                    isDark ? "text-slate-400" : "text-muted-foreground"
                )}>{language}</span>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-none hover:bg-accent transition-colors border border-transparent hover:border-primary/30"
                >
                    {copied ? (
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
                    language={language}
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
    const [sidebarOpen, setSidebarOpen] = React.useState(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && (resolvedTheme === 'dark' || (theme !== 'light' && theme !== 'minimalist-light' && theme !== 'neobrutalism' && theme !== 'enterprise'))

    if (!lesson) {
        notFound()
    }

    const markdownComponents = React.useMemo(() => ({
        code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')

            if (match) {
                return <CodeBlock language={match[1]} code={code} isDark={isDark} />
            }
            return (
                <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm" {...props}>
                    {children}
                </code>
            )
        },
        p: ({ children }: any) => <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{children}</h3>,
        ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>,
        li: ({ children }: any) => <li className="text-muted-foreground">{children}</li>,
        strong: ({ children }: any) => <strong className="text-foreground font-semibold">{children}</strong>,
        a: ({ href, children }: any) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors font-medium">
                {children}
            </a>
        ),
    }), [isDark])

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-none blur-[120px] pointer-events-none" />

            {/* Compact Header */}
            <CompactNav
                backHref={`/solidity/${categorySlug}`}
                backLabel={lesson.category}
                showTheme={true}
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 px-2 rounded-none hover:bg-primary/10 text-primary transition-colors border border-transparent hover:border-primary/20 flex items-center gap-2"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Menu</span>
                    </button>
                    <div className="w-px h-6 bg-border mx-1 hidden md:block" />
                    <h1 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:block">
                        {lesson.title}
                    </h1>
                </div>
            </CompactNav>

            <div className="flex-1 flex">
                {/* Sidebar - toggleable */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r bg-background/50 overflow-hidden h-[calc(100vh-4rem)] sticky top-16`}>
                    <nav className="p-3 w-64">
                        <Link href={`/solidity/${categorySlug}`}>
                            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-none text-sm text-muted-foreground hover:text-primary transition-colors border border-transparent hover:border-primary/20 bg-primary/5">
                                {CATEGORY_ICONS[categorySlug]}
                                <span className="font-medium uppercase tracking-wider">{lesson.category}</span>
                            </div>
                        </Link>
                        <div className="space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto">
                            {categoryLessons.map((l, i) => (
                                <Link key={l.slug} href={`/solidity/${categorySlug}/${l.slug}`}>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-none text-sm transition-all ${l.slug === slug
                                        ? 'bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
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
                                <span className="px-3 py-1 rounded-none bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                                    Solidity ^{lesson.version}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-3 uppercase tracking-tight">{lesson.title}</h1>
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
                                components={markdownComponents}
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

            <Footer />
        </div>
    )
}
