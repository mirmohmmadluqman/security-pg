'use client'

import React from 'react'
import { getVulnerabilityBySlug, getAllVulnerabilities } from '@/lib/library'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Copy, Check, ShieldAlert, Lock } from 'lucide-react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { CompactNav } from '@/components/CompactNav'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useClipboard } from '@reactuses/core' // Or just simple navigator.clipboard
import { cn } from '@/lib/utils'

const CodeBlock = ({ slug, code, isDark }: { slug: string, code: string, isDark: boolean }) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={cn(
            "flex flex-col rounded-none overflow-hidden border border-primary/20 shadow-xl h-[550px]",
            isDark ? "bg-[#1e1e1e]" : "bg-white"
        )}>
            <div className={cn(
                "flex items-center justify-between px-3 py-2 border-b border-border shrink-0",
                isDark ? "bg-[#252526]" : "bg-muted"
            )}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground ml-2">
                        {slug}.sol
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-xs rounded-none border border-transparent hover:border-primary/30"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Code'}
                </Button>
            </div>

            <div className="flex-1 overflow-auto relative custom-scrollbar">
                <SyntaxHighlighter
                    language="solidity"
                    style={isDark ? vscDarkPlus : undefined}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        height: 'auto',
                        background: 'transparent'
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export default function VulnerabilityDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const vulnerability = getVulnerabilityBySlug(slug)
    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

    if (!vulnerability) {
        notFound()
    }


    // Helper to render text with clickable links
    const renderContent = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s\n]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all transition-colors"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-none blur-[100px] pointer-events-none" />

            {/* Compact Header */}
            <CompactNav backHref="/library" backLabel="Library" />

            <main className="flex-1 container mx-auto p-4 md:p-6 grid lg:grid-cols-[1fr,1.2fr] gap-8 relative z-10 items-start">

                {/* Left Column: Documentation */}
                <div className="space-y-6 pb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded-none bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                Vulnerability Analysis
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight mb-3">
                            {vulnerability.title}
                        </h1>

                        {/* Metadata Strip */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-primary/5 border border-primary/10 text-[11px] font-medium">
                                <span className="text-muted-foreground">Severity:</span>
                                <span className="text-yellow-500 font-bold">{vulnerability.severity}</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-primary/5 border border-primary/10 text-[11px] font-medium">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="text-primary font-bold">{vulnerability.category}</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-primary/5 border border-primary/10 text-[11px] font-medium">
                                <span className="text-muted-foreground">Standard:</span>
                                <span className="font-mono text-cyan-400 font-bold">{vulnerability.standard}</span>
                            </div>
                        </div>

                        {/* Source Attribution */}
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground p-2 rounded-none bg-accent/10 border border-border mb-4">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Source: <strong>{vulnerability.source.name}</strong></span>
                            <div className="w-px h-3 bg-border mx-1" />
                            <a
                                href={vulnerability.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                View Original <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-6 rounded-none border-primary/10 space-y-4">
                            <h3 className="text-xl font-bold border-b border-primary/10 pb-2 uppercase tracking-wide">Description</h3>
                            <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed text-sm">
                                {renderContent(vulnerability.description)}
                            </div>
                        </div>

                        {/* Educational Context */}
                        <div className="p-4 rounded-none bg-primary/10 border border-primary/20">
                            <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2 uppercase tracking-widest">
                                <ShieldAlert className="w-4 h-4" />
                                Why this matters
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Understanding this vulnerability is crucial because it highlights a common pitfall in smart contract logic.
                                While distinct from direct exploits, it represents a pattern that often leads to critical failures
                                when combined with other weaknesses in a protocol's architecture.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-none border-primary/10 space-y-4 border-l-4 border-l-green-500/50">
                            <h3 className="text-xl font-bold border-b border-primary/10 pb-2 text-green-500 uppercase tracking-wide">Mitigation</h3>
                            <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed text-sm">
                                {renderContent(vulnerability.mitigation)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Code Viewer - Fixed Height & Internal Scroll */}
                <div className="sticky top-28 w-full">
                    <CodeBlock slug={vulnerability.slug} code={vulnerability.code} isDark={isDark} />
                </div>

            </main>
        </div>
    )
}
