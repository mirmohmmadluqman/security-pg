'use client'

import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { ConnectButton } from '@/components/ConnectButton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Header } from '@/components/Header'

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
            <Header />

            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-yellow-600/5 rounded-full blur-[160px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 relative z-10 flex-1 flex flex-col items-center justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                >
                    <div className="p-6 rounded-full bg-yellow-500/10 text-yellow-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Trophy size={64} className="animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Leaderboard <span className="text-gradient">Coming Soon</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        We're currently building the competitive layer of Security Playground.
                        Soon you'll be able to compare your progress, earn badges, and climb the ranks of top security researchers.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90" asChild>
                            <Link href="/challenges">Keep Practicing</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
