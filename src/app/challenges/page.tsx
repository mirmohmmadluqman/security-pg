'use client'

import { modules } from '@/lib/modules'
import { ModuleCard } from '@/components/ModuleCard'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChallengesPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Logo />
                    </div>
                    <ThemeSelector />
                </header>

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
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {modules.map((module, index) => (
                        <Link key={module.id} href={`/?module=${module.id}`}>
                            <ModuleCard module={module} index={index} />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
