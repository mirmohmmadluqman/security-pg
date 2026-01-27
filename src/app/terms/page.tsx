'use client'

import React from 'react'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Scale, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-red-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full" />
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
                        <Scale size={32} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">Terms of <span className="text-primary">Use</span></h1>
                    <p className="text-muted-foreground text-lg">Rules of engagement for our security lab.</p>
                </section>

                <div className="glass p-8 md:p-12 rounded-[32px] border-white/5 space-y-10 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                            <Zap className="text-primary" />
                            1. Educational Purpose
                        </h2>
                        <p className="text-slate-300">
                            Security Playground is an open-source educational tool. All content, simulations, and attack scenarios are provided <span className="text-foreground font-semibold">solely for learning and research</span>. Use of this platform to facilitate unauthorized access to real-world systems is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                            <ShieldCheck className="text-primary" />
                            2. Ethical Conduct
                        </h2>
                        <p className="text-slate-300">
                            By using this platform, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Keep all exploitation experiments within the provided browser sandbox.</li>
                            <li>Never attempt to use these techniques on production blockchain networks or external contracts without explicit permission.</li>
                            <li>Respect the ethical guidelines of the security research community.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                            <AlertTriangle className="text-yellow-500" />
                            3. Disclaimer of Liability
                        </h2>
                        <p className="text-slate-300">
                            The platform is provided "as is" without any warranties. The developers of Security Playground are <span className="text-foreground font-semibold">not responsible for any direct or indirect damage</span> or legal repercussions resulting from the use or misuse of the information provided herein.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                            <Scale className="text-primary" />
                            4. Acceptance of Terms
                        </h2>
                        <p className="text-slate-300">
                            By continuing to use this site, you acknowledge that you have read, understood, and agreed to these terms, our Privacy Policy, and all applicable laws and regulations.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-sm text-muted-foreground">
                            Last updated: January 2026.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
