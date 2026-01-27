'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { getAllCategories } from '@/lib/solidity'
import { ArrowLeft, BookOpen, Code2, Shield, Cpu, TestTube, Hammer, Coins, ExternalLink, MessageCircle, Bug } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    basic: <BookOpen className="w-8 h-8" />,
    applications: <Code2 className="w-8 h-8" />,
    hacks: <Shield className="w-8 h-8" />,
    evm: <Cpu className="w-8 h-8" />,
    tests: <TestTube className="w-8 h-8" />,
    foundry: <Hammer className="w-8 h-8" />,
    defi: <Coins className="w-8 h-8" />,
}

const CATEGORY_GRADIENTS: Record<string, string> = {
    basic: 'from-blue-500/20 to-cyan-500/20',
    applications: 'from-purple-500/20 to-pink-500/20',
    hacks: 'from-red-500/20 to-orange-500/20',
    evm: 'from-gray-500/20 to-slate-500/20',
    tests: 'from-green-500/20 to-emerald-500/20',
    foundry: 'from-amber-500/20 to-yellow-500/20',
    defi: 'from-indigo-500/20 to-violet-500/20',
}

export default function SolidityPage() {
    const categories = getAllCategories()

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="h-20 border-b flex items-center justify-between px-8 relative z-50 glass sticky top-0 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Logo />
                </div>
                <ThemeSelector />
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-12 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span>Learn Solidity</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                        Solidity by Example
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Master Solidity through practical examples. From beginner basics to advanced DeFi patterns,
                        learn smart contract development with hands-on code.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <span className="text-sm text-muted-foreground">
                            {categories.reduce((acc, c) => acc + c.count, 0)} lessons across {categories.length} categories
                        </span>
                    </div>
                </motion.div>

                {/* Category Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/solidity/${category.slug}`}>
                                <div className={`glass-card p-6 rounded-2xl h-full cursor-pointer group transition-all hover:scale-[1.02] bg-gradient-to-br ${CATEGORY_GRADIENTS[category.slug] || 'from-muted to-transparent'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-muted text-primary group-hover:bg-primary/20 transition-colors">
                                            {CATEGORY_ICONS[category.slug] || <BookOpen className="w-8 h-8" />}
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                            {category.count} lessons
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Start Learning</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Attribution & Links */}
                <div className="text-center mb-8">
                    <p className="text-sm text-muted-foreground">
                        Content adapted from{' '}
                        <a
                            href="https://solidity-by-example.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Solidity by Example
                        </a>
                        {' '}• Licensed under MIT
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8">
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
