'use client'

import React from 'react'
import { getAllVulnerabilities } from '@/lib/library'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { ConnectButton } from '@/components/ConnectButton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Shield, Lock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { CompactNav } from '@/components/CompactNav'
import { Footer } from '@/components/Footer'

export default function LibraryPage() {
    const vulnerabilities = getAllVulnerabilities()

    return (
        <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
            <CompactNav />

            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-none blur-[160px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-none blur-[140px] pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-8 relative z-10 flex-1">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
                        <BookOpen className="w-4 h-4" />
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase">
                        Vulnerability <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Library</span>
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
                            <div className="h-full p-6 rounded-none border border-border bg-card shadow-sm hover:border-primary/50 hover:bg-accent/5 transition-all duration-300 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-none bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                    {vuln.title}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                                    {vuln.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
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
            <Footer />
        </div>
    )
}
