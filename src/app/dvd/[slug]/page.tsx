'use client'

import React, { useState, useEffect } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { CodeEditor } from '@/components/CodeEditor'
import { VMConsole } from '@/components/VMConsole'
import { ScenarioPanel } from '@/components/dvd/ScenarioPanel'
import {
    ArrowLeft,
    Shield,
    Play,
    RotateCcw,
    FileCode,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Code2,
    PanelLeftClose,
    PanelLeftOpen,
    PanelBottomClose,
    PanelBottomOpen
} from 'lucide-react'
import Link from 'next/link'
import { getDVDChallengeBySlug } from '@/lib/dvd'
import { cn } from '@/lib/utils'

export default function DVDChallengePage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const challenge = getDVDChallengeBySlug(slug)

    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [activeContractIndex, setActiveContractIndex] = useState(0)
    const [tab, setTab] = useState<'contracts' | 'exploit'>('contracts')
    const [isRunning, setIsRunning] = useState(false)
    const [logs, setLogs] = useState<string[]>([
        'ready to hack...',
        'use the player account for all transactions.'
    ])
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isTerminalOpen, setIsTerminalOpen] = useState(true)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault()
                setIsSidebarOpen(prev => !prev)
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault()
                setIsTerminalOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!challenge) {
        notFound()
    }

    const isDark = mounted && (resolvedTheme === 'dark' || (theme !== 'light' && theme !== 'minimalist-light' && theme !== 'neobrutalism' && theme !== 'enterprise'))
    const activeContract = challenge.contracts[activeContractIndex]

    const handleRunExploit = () => {
        setIsRunning(true)
        setLogs(prev => [...prev, '> Starting exploit simulation...', '> Deploying malicious contract...', '> Executing attack sequence...'])

        setTimeout(() => {
            setLogs(prev => [...prev, '[SUCCESS] Protocol drained.', '[SUCCESS] Challenge solved!'])
            setIsRunning(false)
        }, 2000)
    }

    const handleReset = () => {
        setLogs(['Environment reset.', 'ready to hack...'])
    }

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 glass z-50">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        title={isSidebarOpen ? "Close Sidebar (Ctrl+B)" : "Open Sidebar (Ctrl+B)"}
                    >
                        {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                            <Shield size={18} />
                        </div>
                        <h2 className="font-bold tracking-tight">{challenge.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Live Sandbox
                    </div>
                    <ThemeSelector />
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Scenario & Info (Scrollable) */}
                {/* Left Pane: Scenario & Info (Scrollable) */}
                {isSidebarOpen && (
                    <aside className="w-[450px] border-r border-border flex flex-col shrink-0 bg-background/50 transition-all duration-300">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <ScenarioPanel challenge={challenge} />
                        </div>
                    </aside>
                )}

                {/* Main Pane: Code & Console (Split) */}
                <main className="flex-1 flex flex-col min-w-0 bg-accent/5">
                    {/* Top Section: Editor */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-border">
                        {/* Editor Header / Tab Switcher */}
                        <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                                {challenge.contracts.map((contract, i) => (
                                    <button
                                        key={contract.name}
                                        onClick={() => {
                                            setActiveContractIndex(i)
                                            setTab('contracts')
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-4 h-12 text-xs font-medium transition-all border-b-2",
                                            activeContractIndex === i && tab === 'contracts'
                                                ? "border-primary text-primary bg-primary/5"
                                                : "border-transparent text-muted-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        <FileCode size={14} />
                                        {contract.name}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setTab('exploit')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 h-12 text-xs font-medium transition-all border-b-2",
                                        tab === 'exploit'
                                            ? "border-red-500 text-red-500 bg-red-500/5"
                                            : "border-transparent text-muted-foreground hover:bg-accent/50"
                                    )}
                                >
                                    <Code2 size={14} />
                                    Your Exploit.t.sol
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                                    title={isTerminalOpen ? "Close Terminal (Ctrl+J)" : "Open Terminal (Ctrl+J)"}
                                >
                                    {isTerminalOpen ? <PanelBottomClose size={18} /> : <PanelBottomOpen size={18} />}
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 rounded-full bg-red-600 hover:bg-red-700 gap-2"
                                    onClick={handleRunExploit}
                                    disabled={isRunning}
                                >
                                    <Play size={14} fill="currentColor" />
                                    {isRunning ? 'Hacking...' : 'Run Exploit'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={handleReset}
                                >
                                    <RotateCcw size={14} />
                                </Button>
                            </div>
                        </div>

                        {/* Monaco Editor Section */}
                        <div className="flex-1 min-h-0 relative">
                            <CodeEditor
                                code={tab === 'contracts' ? activeContract.code : challenge.testCode}
                                language="solidity"
                                isDarkMode={isDark}
                                readOnly={tab === 'contracts'}
                                onChange={(val) => {
                                    if (tab === 'exploit') {
                                        // Handle local code changes if state is added later
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom Section: Console */}
                    {isTerminalOpen && (
                        <div className="h-[250px] flex flex-col bg-background border-t border-border transition-all duration-300">
                            <div className="h-10 px-4 flex items-center gap-2 border-b border-border shrink-0 bg-muted/30">
                                <Terminal size={14} className="text-muted-foreground/60" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">DVVM Terminal v4.1</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <VMConsole logs={logs} isRunning={isRunning} />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
