"use client"

import React from "react"
import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />

                <Image
                    src="/assets/Logo NO  BG Medium_Large Size - Equal Ratio.png"
                    alt="Security Playground Logo"
                    width={45}
                    height={45}
                    className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                    priority
                />
            </div>

            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 hidden sm:block">
                SecPlayground
            </span>
        </div>
    )
}
