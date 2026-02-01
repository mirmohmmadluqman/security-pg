'use client'

import { modules } from '@/lib/modules'
import { ModuleCard } from '@/components/ModuleCard'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { ConnectButton } from '@/components/ConnectButton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

import { useWallet } from '@/context/WalletContext'

import { CompactNav } from '@/components/CompactNav'

export default function ChallengesClient() {
    const { completedModules } = useWallet()

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0b0e14] flex flex-col">
            <CompactNav />

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#00ffff]/5 rounded-full blur-[140px] pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-8 relative z-10 flex-1">

                {/* Active Challenges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight">
                        Security <span className="text-[#00ffff]">Challenges</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl font-light">
                        Select a security module to start exploiting and patching vulnerabilities. Each path contains multiple units.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
                >
                    {modules.filter(m => !m.isRealWorld).map((module, index) => (
                        <Link key={module.id} href={`/challenges/${module.id}`}>
                            <ModuleCard
                                module={module}
                                index={index}
                                completedChallenges={completedModules.includes(module.id) ? 3 : 0}
                                totalChallenges={3}
                            />
                        </Link>
                    ))}
                </motion.div>

                {/* Real-World Exploits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-6 mb-4">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                            Real-World <span className="text-[#00ffff]">Exploits</span>
                        </h2>
                        <span className="px-4 py-1 border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Developing
                        </span>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl font-light mb-8">
                        Learn from real-world security incidents that have cost billions. Understand what went wrong and how to prevent similar attacks.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
                >
                    {modules.filter(m => m.isRealWorld).map((module, index) => (
                        <Link key={module.id} href={`/challenges/exploits/${module.id}`}>
                            <ModuleCard
                                module={module}
                                index={index}
                                completedChallenges={completedModules.includes(module.id) ? 3 : 0}
                                totalChallenges={3}
                            />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
