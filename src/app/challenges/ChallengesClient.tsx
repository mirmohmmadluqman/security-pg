'use client'

import { modules } from '@/lib/modules'
import { ModuleCard } from '@/components/ModuleCard'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ChallengesClient() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

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
                            <span className="text-sm font-medium text-primary">Challenges</span>
                            <Link href="/library" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Library
                            </Link>
                        </nav>
                    </div>
                    <ThemeSelector />
                </header>

                {/* Active Challenges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Active <span className="text-gradient">Challenges</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Select a security module to start exploiting and patching vulnerabilities.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {modules.filter(m => !m.isRealWorld).map((module, index) => (
                        <Link key={module.id} href={`/challenges/${module.id}`}>
                            <ModuleCard module={module} index={index} />
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
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Real-World <span className="text-gradient">Exploits</span>
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Coming Soon
                        </span>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                        Learn from real-world security incidents that have cost billions. Understand what went wrong and how to prevent similar attacks.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {modules.filter(m => m.isRealWorld).map((module, index) => (
                        <Link key={module.id} href={`/challenges/exploits/${module.id}`}>
                            <ModuleCard module={module} index={index} />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
