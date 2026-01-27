'use client'

import { useState, useEffect, useRef } from 'react'
import { SecurityModule } from '@/lib/types'
import { modules } from '@/lib/modules'
import { CodeEditor } from '@/components/CodeEditor'
import { InfoPanel } from '@/components/InfoPanel'
import { ActionButtons } from '@/components/ActionButtons'
import { VMConsole } from '@/components/VMConsole'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Code,
    Bug,
    Shield,
    Terminal,
    Settings,
    Sidebar,
    PanelRight,
    Palette,
    Monitor,
    Layout
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

export type IDEStatus = 'idle' | 'compiling' | 'deploying' | 'executing' | 'success' | 'error'

export default function ChallengeClient({ challengeId }: { challengeId: string }) {
    const [activeTab, setActiveTab] = useState<'vulnerable' | 'attack' | 'fixed'>('vulnerable')
    const [status, setStatus] = useState<IDEStatus>('idle')
    const [isCompiled, setIsCompiled] = useState(false)
    const [isDeployed, setIsDeployed] = useState(false)
    const [code, setCode] = useState('')
    const [logs, setLogs] = useState<string[]>([])
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDarkMode = mounted && (resolvedTheme === 'dark' || theme === 'dark')

    // Panel Refs for Layout Control
    const leftPanelRef = useRef<ImperativePanelHandle>(null)
    const rightPanelRef = useRef<ImperativePanelHandle>(null)
    const bottomPanelRef = useRef<ImperativePanelHandle>(null)

    const [leftBlocked, setLeftBlocked] = useState(false)
    const [rightBlocked, setRightBlocked] = useState(false)
    const [bottomBlocked, setBottomBlocked] = useState(false)
    const [showTopBar, setShowTopBar] = useState(true)

    // Find the current module
    const selectedModule = modules.find(m => m.id === challengeId)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault()
                        toggleLeftPanel()
                        break
                    case '2':
                        e.preventDefault()
                        setShowTopBar(prev => !prev)
                        break
                    case '3':
                        e.preventDefault()
                        toggleBottomPanel()
                        break
                    case '`':
                        e.preventDefault()
                        toggleRightPanel()
                        break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [leftBlocked, rightBlocked, bottomBlocked, showTopBar])

    useEffect(() => {
        if (selectedModule) {
            setCode(selectedModule.vulnerableCode)
        }
    }, [selectedModule])

    // Reset compilation whenever code changes
    useEffect(() => {
        setIsCompiled(false)
        setIsDeployed(false)
        setStatus('idle')
    }, [code])

    if (!mounted) return null

    if (!selectedModule) {
        notFound()
    }

    const isCodeSecure = (code: string, moduleId: string): boolean => {
        const normalizedCode = code.replace(/\s+/g, ' ').toLowerCase()

        switch (moduleId) {
            case 'reentrancy':
                const balanceResetIndex = normalizedCode.indexOf('balances[msg.sender] = 0')
                const callIndex = normalizedCode.indexOf('.call')
                return balanceResetIndex !== -1 && callIndex !== -1 && balanceResetIndex < callIndex

            case 'access-control':
                const mintIndex = normalizedCode.indexOf('function mint')
                if (mintIndex === -1) return true
                const nextBy = normalizedCode.indexOf('onlyowner', mintIndex)
                const nextBrace = normalizedCode.indexOf('{', mintIndex)
                return nextBy !== -1 && nextBy < nextBrace

            case 'tx-origin':
                return normalizedCode.includes('msg.sender == owner') && !normalizedCode.includes('tx.origin == owner')

            case 'integer-overflow':
                return normalizedCode.includes('require') && (normalizedCode.includes('>=') || normalizedCode.includes('<=') || normalizedCode.includes('overflow detected'))

            case 'arcadia-finance':
                // Check if they are validating the router address against a whitelist
                return normalizedCode.includes('whitelistedrouters[router]') ||
                    normalizedCode.includes('require(whitelistedrouters[router]') ||
                    normalizedCode.includes('iswhitelisted(router)')

            default:
                // Fallback: if they are on the fixed tab and the code is roughly what we expect
                if (activeTab === 'fixed') return true
                return false
        }
    }

    const handleTabChange = (tab: string) => {
        const newTab = tab as 'vulnerable' | 'attack' | 'fixed'
        setActiveTab(newTab)
        // Reset state when switching tabs to ensure independent execution
        setIsCompiled(false)
        setIsDeployed(false)
        setStatus('idle')

        switch (newTab) {
            case 'vulnerable':
                setCode(selectedModule.vulnerableCode)
                break
            case 'attack':
                setCode(selectedModule.attackCode)
                break
            case 'fixed':
                setCode(selectedModule.fixedCode)
                break
        }
    }


    const handleCompile = () => {
        setStatus('compiling')
        setLogs([...logs, '🔨 Compiling contract...'])

        setTimeout(() => {
            setIsCompiled(true)
            setStatus('success')
            setLogs(prev => [...prev, '✅ Compilation successful!'])
            setTimeout(() => setStatus('idle'), 2000)
        }, 1500)
    }

    const handleDeploy = () => {
        if (!isCompiled) {
            setLogs([...logs, '❌ Error: Please compile the contract before deploying.'])
            return
        }

        setStatus('deploying')
        setLogs([...logs, '🚀 Deploying contract to local EVM...'])

        setTimeout(() => {
            setIsDeployed(true)
            setStatus('success')
            const mockAddr = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6)
            setLogs(prev => [...prev, `✅ Contract deployed at: ${mockAddr}`])
            setTimeout(() => setStatus('idle'), 2000)
        }, 1500)
    }

    const handleExploit = () => {
        if (!isDeployed) {
            setLogs([...logs, '❌ Error: Please deploy the contract before running exploits.'])
            return
        }

        setStatus('executing')
        const secure = isCodeSecure(code, selectedModule.id)
        setLogs([...logs, secure ? '🛡️ Running security verification...' : '⚡ Running exploit...'])

        setTimeout(() => {
            if (!secure) {
                setStatus('error')
                setLogs(prev => [
                    ...prev,
                    '⚠️  Vulnerability detected!',
                    `💥 ${selectedModule.vulnerability}`,
                    '❌ Exploit successful - contract is vulnerable!'
                ])
            } else {
                setStatus('success')
                setLogs(prev => [
                    ...prev,
                    '🛡️ Verifying remediation...',
                    '✅ Exploit blocked!',
                    '🎉 Fix verified - contract is safe!'
                ])
            }
        }, 2000)
    }

    const handleReset = () => {
        handleTabChange(activeTab)
        setLogs(['🔄 Environment reset to original state'])
    }

    const handleSave = () => {
        setLogs([...logs, '💾 Local progress saved!'])
    }

    // Layout Toggles
    const toggleLeftPanel = () => {
        const panel = leftPanelRef.current
        if (panel) {
            if (leftBlocked) panel.expand()
            else panel.collapse()
        }
    }

    const toggleRightPanel = () => {
        const panel = rightPanelRef.current
        if (panel) {
            if (rightBlocked) panel.expand()
            else panel.collapse()
        }
    }

    const toggleBottomPanel = () => {
        const panel = bottomPanelRef.current
        if (panel) {
            if (bottomBlocked) panel.expand()
            else panel.collapse()
        }
    }

    return (
        <div className="h-screen bg-background flex flex-col relative overflow-hidden text-foreground">
            {/* Background noise/gradient for IDE */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full" />
            </div>

            {/* Floating Settings Button (Only visible if Header is hidden) */}
            {!showTopBar && (
                <div className="absolute top-4 right-4 z-[100] animate-in fade-in zoom-in duration-300">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-background/50 backdrop-blur-md border-primary/20 hover:border-primary transition-all rounded-full">
                                <Settings className="w-5 h-5 text-primary" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-popover border-border text-foreground">
                            <DropdownMenuLabel>Workshop Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem onClick={() => setShowTopBar(true)}>
                                <Layout className="w-4 h-4 mr-2" />
                                <span>Show Top Bar</span>
                                <span className="ml-auto text-[10px] opacity-50">Ctrl+2</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Palette className="w-4 h-4 mr-2" />
                                    <span>Theme</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="bg-popover border-border">
                                    {["dark", "light", "cyberpunk", "minimalist"].map((t) => (
                                        <DropdownMenuItem key={t} onClick={() => setTheme(t)}>{t}</DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Header */}
            {showTopBar && (
                <header className="h-14 glass border-b flex items-center justify-between px-4 sticky top-0 z-50 shrink-0 select-none animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/challenges">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 h-9 px-3 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden md:inline">Back</span>
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-border hidden md:block" />
                        <h1 className="text-sm md:text-base font-bold text-foreground truncate max-w-[200px] md:max-w-md">
                            {selectedModule.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Controls */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex", leftBlocked && "text-primary bg-primary/10")}
                            onClick={toggleLeftPanel}
                            title="Toggle Sidebar (Ctrl+1)"
                        >
                            <Sidebar className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex", rightBlocked && "text-primary bg-primary/10")}
                            onClick={toggleRightPanel}
                            title="Toggle Terminal (Ctrl+`)"
                        >
                            <PanelRight className="w-4 h-4" />
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        <div className="hidden md:flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary items-center gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                            </span>
                            EVM Ready
                        </div>

                        {/* Settings Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Settings className="w-4 h-4 transition-transform hover:rotate-45 duration-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-popover border-border text-foreground">
                                <DropdownMenuLabel>Workshop Settings</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Palette className="w-4 h-4 mr-2" />
                                        <span>Theme</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-popover border-border">
                                        {[
                                            { name: "dark", label: "Dark" },
                                            { name: "light", label: "Light" },
                                            { name: "cyberpunk", label: "Cyberpunk" },
                                            { name: "minimalist", label: "Minimalist" },
                                        ].map((t) => (
                                            <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)}>
                                                {t.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Layout className="w-4 h-4 mr-2" />
                                        <span>View</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-popover border-border">
                                        <DropdownMenuItem onClick={toggleLeftPanel}>
                                            <Sidebar className="w-4 h-4 mr-2" />
                                            <span>Toggle Sidebar</span>
                                            <span className="ml-auto text-[10px] opacity-50">Ctrl+1</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setShowTopBar(false)}>
                                            <Layout className="w-4 h-4 mr-2" />
                                            <span>Toggle Top Bar</span>
                                            <span className="ml-auto text-[10px] opacity-50">Ctrl+2</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={toggleBottomPanel}>
                                            <Monitor className="w-4 h-4 mr-2" />
                                            <span>Toggle Bottom Bar</span>
                                            <span className="ml-auto text-[10px] opacity-50">Ctrl+3</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={toggleRightPanel}>
                                            <PanelRight className="w-4 h-4 mr-2" />
                                            <span>Toggle Terminal</span>
                                            <span className="ml-auto text-[10px] opacity-50">Ctrl+`</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
            )}

            {/* Main Content - Resizable Layout */}
            <div className="flex-1 overflow-hidden relative z-10">
                <PanelGroup direction="horizontal">
                    {/* Left Panel */}
                    <Panel
                        ref={leftPanelRef}
                        defaultSize={25}
                        minSize={15}
                        maxSize={40}
                        collapsible
                        onCollapse={() => setLeftBlocked(true)}
                        onExpand={() => setLeftBlocked(false)}
                        className={cn("bg-card/30 backdrop-blur-sm border-r border-border transition-all duration-300", leftBlocked && "min-w-[0px] w-0 border-none opacity-0")}
                    >
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            <InfoPanel module={selectedModule} />
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors cursor-col-resize active:bg-primary/80 flex flex-col justify-center items-center group">
                        <div className="w-0.5 h-8 bg-foreground/20 rounded-full group-hover:bg-foreground/50" />
                    </PanelResizeHandle>

                    {/* Middle Panel - Code + Action Area */}
                    <Panel minSize={30}>
                        <PanelGroup direction="vertical">
                            <Panel minSize={30}>
                                <div className="h-full flex flex-col bg-background/50">
                                    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
                                        <div className="border-b border-border bg-accent/20 px-4 shrink-0 flex items-center justify-between">
                                            <TabsList className="bg-transparent justify-start h-12 gap-2">
                                                <TabsTrigger value="vulnerable" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 text-xs md:text-sm">
                                                    <Bug className="w-3.5 h-3.5 mr-2" />
                                                    Vulnerability
                                                </TabsTrigger>
                                                <TabsTrigger value="attack" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 border border-transparent data-[state=active]:border-red-500/20 text-xs md:text-sm">
                                                    <Code className="w-3.5 h-3.5 mr-2" />
                                                    Exploit
                                                </TabsTrigger>
                                                <TabsTrigger value="fixed" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 border border-transparent data-[state=active]:border-green-500/20 text-xs md:text-sm">
                                                    <Shield className="w-3.5 h-3.5 mr-2" />
                                                    Patched
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <div className="flex-1 min-h-0 relative">
                                            <div className="absolute inset-0">
                                                <CodeEditor
                                                    code={code}
                                                    language="solidity"
                                                    isDarkMode={isDarkMode}
                                                    readOnly={activeTab === 'attack'}
                                                    onChange={setCode}
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        </div>
                                    </Tabs>
                                </div>
                            </Panel>

                            <PanelResizeHandle className={cn("h-1 bg-border/50 hover:bg-primary/50 transition-colors cursor-row-resize active:bg-primary/80 flex justify-center items-center group", bottomBlocked && "hidden")}>
                                <div className="h-0.5 w-8 bg-foreground/20 rounded-full group-hover:bg-foreground/50" />
                            </PanelResizeHandle>

                            {/* Action Buttons (Bottom adjustable panel) */}
                            <Panel
                                ref={bottomPanelRef}
                                defaultSize={15}
                                minSize={10}
                                collapsible
                                onCollapse={() => setBottomBlocked(true)}
                                onExpand={() => setBottomBlocked(false)}
                                className={cn("border-t border-border bg-accent/20 backdrop-blur-md z-20 transition-all duration-300", bottomBlocked && "h-0 opacity-0 overflow-hidden border-none")}
                            >
                                <div className="p-4 h-full">
                                    <ActionButtons
                                        selectedModule={selectedModule}
                                        activeTab={activeTab}
                                        isDarkMode={isDarkMode}
                                        onToggleDarkMode={() => { }}
                                        onCompile={handleCompile}
                                        onDeploy={handleDeploy}
                                        onExploit={handleExploit}
                                        onReset={handleReset}
                                        onSave={handleSave}
                                        isRunning={status === 'compiling' || status === 'deploying' || status === 'executing'}
                                        status={status}
                                    />
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors cursor-col-resize active:bg-primary/80 flex flex-col justify-center items-center group">
                        <div className="w-0.5 h-8 bg-foreground/20 rounded-full group-hover:bg-foreground/50" />
                    </PanelResizeHandle>

                    {/* Right Panel - Terminal */}
                    <Panel
                        ref={rightPanelRef}
                        defaultSize={25}
                        minSize={15}
                        collapsible
                        onCollapse={() => setRightBlocked(true)}
                        onExpand={() => setRightBlocked(false)}
                        className={cn("bg-accent/40 border-l border-border transition-all duration-300", rightBlocked && "min-w-[0px] w-0 border-none opacity-0")}
                    >
                        <div className="h-full flex flex-col min-h-0">
                            <div className="p-3 border-b border-border font-mono text-xs font-bold flex items-center gap-2 text-muted-foreground bg-accent/20 shrink-0">
                                <Terminal className="w-3 h-3" />
                                TERMINAL_OUTPUT
                            </div>
                            <div className="flex-1 min-h-0 p-2 overflow-hidden">
                                <VMConsole logs={logs} isRunning={status === 'executing'} />
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}
