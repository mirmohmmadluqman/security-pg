'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Info, Shield, CheckCircle2 } from 'lucide-react'
import { DVDChallenge } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ScenarioPanelProps {
    challenge: DVDChallenge
}

export function ScenarioPanel({ challenge }: ScenarioPanelProps) {
    return (
        <div className="space-y-6 pb-12">
            {/* Mission Story */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary/80 font-bold uppercase tracking-widest text-[10px]">
                    <Info size={12} />
                    <span>Background Scenario</span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">
                        {challenge.scenario}
                    </p>
                </div>
            </div>

            {/* Objective */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-none border border-primary/20 bg-primary/5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-none bg-primary/20 text-primary">
                        <Target size={16} />
                    </div>
                    <h3 className="text-base font-bold uppercase tracking-tight">Mission Objective</h3>
                </div>
                <p className="text-foreground/90 font-medium text-sm">
                    {challenge.objective}
                </p>
            </motion.div>

            {/* Rules of Engagement */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-500/80 font-bold uppercase tracking-widest text-[10px]">
                    <Shield size={12} />
                    <span>Rules of Engagement</span>
                </div>
                <div className="space-y-2">
                    {challenge.rules.map((rule, i) => (
                        <div key={i} className="flex gap-2 text-xs text-muted-foreground group">
                            <CheckCircle2 size={14} className="text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
                            <span>{rule}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exploit Hint (Optional/Hidden) */}
            {challenge.exploitHint && (
                <div className="pt-8 border-t border-border mt-8">
                    <details className="group cursor-pointer">
                        <summary className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest flex items-center gap-2">
                            <span>System Hint Available</span>
                        </summary>
                        <p className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-sm text-orange-200/80 leading-relaxed italic">
                            {challenge.exploitHint}
                        </p>
                    </details>
                </div>
            )}
        </div>
    )
}
