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

import { CompactNav } from '@/components/CompactNav'
import { Footer } from '@/components/Footer'

export default function SolidityPage() {
    const categories = getAllCategories()

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <CompactNav />

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-none blur-[160px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-none blur-[140px] pointer-events-none opacity-30" />

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 pt-20 pb-12 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span>Learn Solidity</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight uppercase">
                        Solidity <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">by Example</span>
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
                                <div className={`glass-card p-6 rounded-none h-full cursor-pointer group transition-all hover:scale-[1.01] bg-gradient-to-br ${CATEGORY_GRADIENTS[category.slug] || 'from-muted to-transparent shadow-sm'} border border-border hover:border-primary/50`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-none bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors border border-primary/20">
                                            {CATEGORY_ICONS[category.slug] || <BookOpen className="w-8 h-8" />}
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1 rounded-none bg-primary/10 text-primary border border-primary/20">
                                            {category.count} lessons
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors tracking-tight">
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

            <Footer />
        </div>
    )
}
