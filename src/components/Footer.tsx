'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

interface FooterProps {
    showGitHubLogo?: boolean
}

export function Footer({ showGitHubLogo = true }: FooterProps) {
    const handleReportIssue = () => {
        window.open('https://github.com/mirmohmmadluqman/security-pg/issues', '_blank')
    }

    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                        <Link
                            href="https://discord.gg/qMd7jwV7UG"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                            Join Discord
                        </Link>
                        <button
                            onClick={handleReportIssue}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4"
                        >
                            Report Issues
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                        <span>© 2026 Mir Mohmmad Luqman. All rights reserved.</span>
                        <Link
                            href="https://github.com/mirmohmmadluqman/security-pg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 border border-primary/20 text-primary text-xs font-mono group hover:bg-primary/20 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                        >
                            <Github className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>OPEN-SOURCE</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
