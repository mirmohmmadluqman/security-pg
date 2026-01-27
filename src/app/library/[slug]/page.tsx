'use client'

import React from 'react'
import { getVulnerabilityBySlug, getAllVulnerabilities } from '@/lib/library'
import { Logo } from '@/components/Logo'
import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Copy, Check, ShieldAlert, Lock } from 'lucide-react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useClipboard } from '@reactuses/core' // Or just simple navigator.clipboard

export default function VulnerabilityDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const vulnerability = getVulnerabilityBySlug(slug)
    const [copied, setCopied] = React.useState(false)

    if (!vulnerability) {
        notFound()
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(vulnerability.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 relative z-50 glass sticky top-0 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <Link href="/library">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Library
                        </Button>
                    </Link>
                    <Logo />
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Read-Only Mode</span>
                    </div>
                    <ThemeSelector />
                </div>
            </header>

            <main className="flex-1 container mx-auto p-6 md:p-8 grid lg:grid-cols-2 gap-12 relative z-10 items-start">

                {/* Left Column: Documentation */}
                <div className="space-y-8 pb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                Vulnerability Analysis
                            </span>
                        </div>
                        <h1 className="text-4xl font-black leading-tight tracking-tight mb-4">
                            {vulnerability.title}
                        </h1>

                        {/* Metadata Strip */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium">
                                <span className="text-muted-foreground">Severity:</span>
                                <span className="text-yellow-400">{vulnerability.severity}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="text-blue-400">{vulnerability.category}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium">
                                <span className="text-muted-foreground">Standard:</span>
                                <span className="font-mono text-purple-400">{vulnerability.standard}</span>
                            </div>
                        </div>

                        {/* Source Attribution */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-white/5 border border-white/5 mb-6">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Source: <strong>{vulnerability.source.name}</strong></span>
                            <div className="w-px h-3 bg-white/10 mx-2" />
                            <a
                                href={vulnerability.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                View Original <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                            <h3 className="text-xl font-bold border-b border-white/5 pb-2">Description</h3>
                            <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed text-sm">
                                {renderContent(vulnerability.description)}
                            </div>
                        </div>

                        {/* Educational Context */}
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <h4 className="font-bold text-blue-400 text-sm mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Why this matters
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Understanding this vulnerability is crucial because it highlights a common pitfall in smart contract logic.
                                While distinct from direct exploits, it represents a pattern that often leads to critical failures
                                when combined with other weaknesses in a protocol's architecture.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-2xl border-white/5 space-y-4 border-l-4 border-l-green-500/50">
                            <h3 className="text-xl font-bold border-b border-white/5 pb-2 text-green-400">Mitigation</h3>
                            <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed text-sm">
                                {renderContent(vulnerability.mitigation)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Code Viewer - Fixed Height & Internal Scroll */}
                <div className="sticky top-28 w-full">
                    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl h-[650px]">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                                <span className="text-xs font-mono text-muted-foreground ml-2">
                                    {vulnerability.slug}.sol
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-2 text-xs"
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy Code'}
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto relative custom-scrollbar">
                            <SyntaxHighlighter
                                language="solidity"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    height: 'auto',
                                    backgroundColor: 'transparent'
                                }}
                                showLineNumbers={true}
                                wrapLines={true}
                            >
                                {vulnerability.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
