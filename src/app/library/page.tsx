'use client'

import React from 'react'
import { getAllVulnerabilities } from '@/lib/library'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Shield, Lock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function LibraryPage() {
    const vulnerabilities = getAllVulnerabilities()

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Logo />
                        <nav className="hidden md:flex items-center gap-6 ml-8">
                            <Link href="/challenges" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Challenges
                            </Link>
                            <Link href="/library" className="text-sm font-medium text-primary">
                                Library
                            </Link>
                        </nav>
                    </div>
                    <ThemeSelector />
                </header>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
                        <BookOpen className="w-4 h-4" />
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Vulnerability <span className="text-gradient text-blue-500">Library</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        A curated collection of real-world smart contract vulnerabilities.
                        Strictly read-only for educational purposes.
                        Source data provided by <a href="https://github.com/SunWeb3Sec/DeFiVulnLabs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeFiVulnLabs</a>.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {vulnerabilities.map((vuln, index) => (
                        <Link key={vuln.id} href={`/library/${vuln.slug}`} className="group">
                            <div className="h-full p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {vuln.title}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                                    {vuln.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Read-Only
                                    </span>
                                    <span className="font-mono opacity-50">
                                        {vuln.slug}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
