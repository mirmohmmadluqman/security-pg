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
    PanelBottomOpen,
    Home
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
            if ((e.metaKey || e.ctrlKey) && e.key === '`') {
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
        <div className="h-screen flex flex-col bg-background overflow-hidden relative">
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Scenario & Info (Scrollable) */}
                {isSidebarOpen && (
                    <aside className="w-[400px] border-r border-border flex flex-col shrink-0 bg-background transition-all duration-300">
                        <div className="h-14 border-b border-border flex items-center px-6 shrink-0 bg-accent/10">
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded-md bg-red-500/10 text-red-500">
                                    <Shield size={16} />
                                </div>
                                <h2 className="font-bold text-sm tracking-tight truncate">{challenge.title}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <ScenarioPanel challenge={challenge} />
                        </div>
                    </aside>
                )}

                {/* Main Pane: Code & Console (Split) */}
                <main className="flex-1 flex flex-col min-w-0 bg-background">
                    {/* Top Section: Editor */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-border">
                        {/* Editor Header / Tab Switcher */}
                        <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
                                <Link href="/">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0 rounded-none mr-1"
                                        title="Go Home"
                                    >
                                        <Home size={18} />
                                    </Button>
                                </Link>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.back()}
                                    className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0 rounded-none mr-2"
                                    title="Go Back"
                                >
                                    <ArrowLeft size={18} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-10 w-10 text-muted-foreground hover:text-foreground shrink-0 rounded-none mr-4", isSidebarOpen && "text-primary bg-primary/5")}
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    title={isSidebarOpen ? "Close Sidebar (Ctrl+B)" : "Open Sidebar (Ctrl+B)"}
                                >
                                    {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                                </Button>

                                <div className="h-6 w-px bg-border mr-2" />

                                {challenge.contracts.map((contract, i) => (
                                    <button
                                        key={contract.name}
                                        onClick={() => {
                                            setActiveContractIndex(i)
                                            setTab('contracts')
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-4 h-14 text-xs font-medium transition-all border-b-2 shrink-0",
                                            activeContractIndex === i && tab === 'contracts'
                                                ? "border-primary text-primary bg-primary/5 shadow-inner"
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
                                        "flex items-center gap-2 px-4 h-14 text-xs font-medium transition-all border-b-2 shrink-0",
                                        tab === 'exploit'
                                            ? "border-red-500 text-red-500 bg-red-500/5 shadow-inner"
                                            : "border-transparent text-muted-foreground hover:bg-accent/50"
                                    )}
                                >
                                    <Code2 size={14} />
                                    Your Exploit.t.sol
                                </button>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    className="cursor-pointer animate-shine h-9 px-4 rounded-none bg-red-600 hover:bg-red-700 gap-2 font-bold text-xs shadow-lg shadow-red-900/20 hover:shadow-red-500/40 transition-all font-mono tracking-widest"
                                    onClick={handleRunExploit}
                                    disabled={isRunning}
                                >
                                    <Play size={14} fill="currentColor" />
                                    {isRunning ? 'RUNNING...' : 'RUN EXPLOIT'}
                                </Button>

                                <div className="h-6 w-px bg-border mx-1" />

                                <ThemeSelector />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors rounded-none"
                                    onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                                    title={isTerminalOpen ? "Close Terminal (Ctrl+`)" : "Open Terminal (Ctrl+`)"}
                                >
                                    {isTerminalOpen ? <PanelBottomClose size={18} /> : <PanelBottomOpen size={18} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-none text-muted-foreground hover:text-foreground"
                                    onClick={handleReset}
                                    title="Reset Environment"
                                >
                                    <RotateCcw size={16} />
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
                            <div className="h-10 px-4 flex items-center justify-between border-b border-border shrink-0 bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-muted-foreground/60" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">DVVM Terminal v4.1</span>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-0.5 rounded-none bg-red-500/10 text-[9px] font-bold text-red-500 uppercase tracking-tighter border border-red-500/20">
                                    Live Session
                                </div>
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
