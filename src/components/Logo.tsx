"use client"

import { Shield } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <Shield className="w-8 h-8 text-primary fill-primary/20" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                SecPlayground
            </span>
        </div>
    )
}
