'use client'

import React from 'react'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Eye, Databases, FileText } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500/20 blur-[150px] rounded-full" />
            </div>

            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 relative z-50 glass sticky top-0">
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

            <main className="flex-1 max-w-4xl mx-auto w-full p-8 md:p-12 space-y-12 relative z-10">
                <section className="space-y-4 text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">Privacy <span className="text-primary">Policy</span></h1>
                    <p className="text-muted-foreground text-lg">Your data privacy in our sandboxed environment.</p>
                </section>

                <div className="glass p-8 md:p-12 rounded-[32px] border-white/5 space-y-10 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Eye className="text-primary" />
                            Data Collection
                        </h2>
                        <p className="text-slate-300">
                            Security Playground is designed to be a <span className="text-foreground font-semibold">zero-tracking platform</span>. We do not have a backend database, and we do not collect, store, or sell any personal information. You do not need an account to use the platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Shield className="text-primary" />
                            Browser Storage (Local Only)
                        </h2>
                        <p className="text-slate-300">
                            The application utilizes <code className="text-xs bg-white/5 px-1.5 py-1 rounded text-primary">localStorage</code> for the following purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Storing your challenge progress (completed modules).</li>
                            <li>Recording your acceptance of our legal terms.</li>
                            <li>Persisting your preferred user interface theme.</li>
                        </ul>
                        <p className="text-slate-300 italic">
                            All this data remains exclusively on your device. Clearing your browser's site data will reset all your progress.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FileText className="text-primary" />
                            Simulated Environment
                        </h2>
                        <p className="text-slate-300">
                            The EVM is purely simulated in the browser. Any "addresses" or "transactions" generated during your sessions are mock data and have no connection to real blockchain networks. No wallet data is ever transmitted or requested.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-sm text-muted-foreground">
                            Last updated: January 2026. For educational purposes only.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
