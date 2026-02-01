'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Zap, Shield, Lock, Cpu, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllDVDChallenges } from '@/lib/dvd'
import { ChallengeCard } from '@/components/dvd/ChallengeCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { Header } from '@/components/Header'

export default function DVDDashboard() {
    const challenges = getAllDVDChallenges()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <Header />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00ffff]/5 rounded-full blur-[160px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none opacity-30" />

            <main className="flex-1 container mx-auto px-6 py-12 relative z-10 flex flex-col gap-16">
                {/* Hero Section */}
                <section className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                            Official Integration
                        </Badge>
                        <h1 className="text-6xl font-black tracking-tight leading-tight">
                            Damn Vulnerable <br />
                            <span className="text-gradient">DeFi v4</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            The ultimate playground for security researchers. Explore sophisticated DeFi vulnerabilities in a safe, interactive environment. No hand-holding, just you and the code.
                        </p>
                    </motion.div>
                </section>

                {/* Filters & Search */}
                <section className="flex flex-col md:flex-row gap-6 items-center justify-between glass p-6 rounded-[32px] border-border shadow-2xl">
                    <div className="flex flex-wrap gap-3">
                        {['All', 'Flash Loans', 'Lending', 'Governance', 'Oracles'].map((cat) => (
                            <Button
                                key={cat}
                                variant="outline"
                                className="rounded-full border-border hover:bg-primary hover:text-white transition-all px-6"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search challenges..."
                            className="w-full pl-12 h-12 rounded-full border-border bg-background focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Challenges Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredChallenges.map((challenge, i) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
                    ))}
                </section>
            </main>

            <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm mt-20">
                <div className="container mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-4">
                        <Logo />
                        <p className="text-sm text-muted-foreground">© 2026 Security Playground. DVD Integration v1.0</p>
                    </div>
                    <div className="flex gap-8">
                        <Link href="/library" className="text-sm text-muted-foreground hover:text-primary transition-colors">Library</Link>
                        <Link href="/solidity" className="text-sm text-muted-foreground hover:text-primary transition-colors">Solidity</Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}


