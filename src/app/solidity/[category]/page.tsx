'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { getAllCategories, getLessonsByCategory } from '@/lib/solidity'
import { ArrowLeft, BookOpen, Code2, Shield, Cpu, TestTube, Hammer, Coins, ChevronRight, MessageCircle, Bug, Search } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    basic: <BookOpen className="w-5 h-5" />,
    applications: <Code2 className="w-5 h-5" />,
    hacks: <Shield className="w-5 h-5" />,
    evm: <Cpu className="w-5 h-5" />,
    tests: <TestTube className="w-5 h-5" />,
    foundry: <Hammer className="w-5 h-5" />,
    defi: <Coins className="w-5 h-5" />,
}

export default function CategoryPage() {
    const params = useParams()
    const categorySlug = params.category as string
    const [searchQuery, setSearchQuery] = React.useState('')

    const categories = getAllCategories()
    const currentCategory = categories.find(c => c.slug === categorySlug)
    const lessons = getLessonsByCategory(categorySlug)

    if (!currentCategory || lessons.length === 0) {
        notFound()
    }

    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="h-20 border-b flex items-center justify-between px-8 relative z-50 glass sticky top-0 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <Link href="/solidity">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />
                            All Categories
                        </Button>
                    </Link>
                    <Logo />
                </div>
                <ThemeSelector />
            </header>

            <div className="flex-1 flex">
                {/* Sidebar */}
                <aside className="hidden lg:block w-72 border-r bg-background/50 overflow-y-auto h-[calc(100vh-5rem)] sticky top-20">
                    <nav className="p-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">
                            Categories
                        </h3>
                        {categories.map(cat => (
                            <Link
                                key={cat.slug}
                                href={`/solidity/${cat.slug}`}
                            >
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${cat.slug === categorySlug
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}>
                                    {CATEGORY_ICONS[cat.slug]}
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <span className="ml-auto text-xs opacity-60">{cat.count}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 container mx-auto px-6 py-8 max-w-5xl">
                    {/* Category Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                {CATEGORY_ICONS[categorySlug] || <BookOpen className="w-5 h-5" />}
                            </div>
                            <h1 className="text-3xl font-black">{currentCategory.name}</h1>
                        </div>
                        <p className="text-muted-foreground">{currentCategory.description}</p>

                        {/* Search */}
                        <div className="relative mt-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search lessons..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </motion.div>

                    {/* Lessons List */}
                    <div className="space-y-3">
                        {filteredLessons.map((lesson, index) => (
                            <motion.div
                                key={lesson.slug}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <Link href={`/solidity/${categorySlug}/${lesson.slug}`}>
                                    <div className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-mono text-muted-foreground w-8">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                    {lesson.title}
                                                </h3>
                                                {lesson.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                        {lesson.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredLessons.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No lessons found matching "{searchQuery}"
                        </div>
                    )}
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
                                Join Discord
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
