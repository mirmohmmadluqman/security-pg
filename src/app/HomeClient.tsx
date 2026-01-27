'use client'

import { useEffect, useState } from 'react'
import { modules } from '@/lib/modules'
import { ModuleCard } from '@/components/ModuleCard'
import { Button } from '@/components/ui/button'
import { Terminal, Shield, Zap, Bug, Lock, Cpu, BookOpen } from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export default function HomeClient() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

  // Icons mapping for categories
  const getIconForModule = (id: string) => {
    if (id.includes('reentrancy')) return Zap
    if (id.includes('access')) return Lock
    if (id.includes('overflow')) return Cpu
    if (id.includes('dos')) return Shield
    return Bug
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex-1">
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-medium text-primary">Home</span>
              <Link href="/challenges" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Challenges
              </Link>
              <Link href="/library" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Library
              </Link>
              <Link href="/solidity" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Solidity
              </Link>
            </nav>
          </div>
          <ThemeSelector />
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 animate-float"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium backdrop-blur-sm">
            🚀 Interactive Web3 Security Environment
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            Security <span className="text-gradient">Playground</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Master the art of smart contract security. Exploit real vulnerabilities, patch code, and level up your auditing skills.
          </p>
          <div className="flex justify-center gap-6">
            <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-0 font-bold" asChild>
              <Link href="/challenges">Start Hacking</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-border hover:bg-muted backdrop-blur-sm" asChild>
              <Link href="https://github.com/mirmohmadluqman/security-pg#readme" target="_blank">
                View Documentation
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats / Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Terminal, title: "Real-World Exploits", desc: "Execute actual attack vectors in a sandboxed EVM." },
            { icon: Shield, title: "Interactive Defense", desc: "Patch vulnerabilities and verify fixes instantly." },
            { icon: Zap, title: "Instant Feedback", desc: "Real-time compilation and execution logs." },
            { icon: BookOpen, title: "Solidity Lessons", desc: "129 hands-on lessons from basics to DeFi.", link: "/solidity" }
          ].map((feature, i) => {
            const CardContent = (
              <div className={`glass p-8 rounded-2xl flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 h-full ${feature.link ? 'cursor-pointer' : ''}`}>
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            )
            return feature.link ? (
              <Link key={i} href={feature.link}>{CardContent}</Link>
            ) : (
              <div key={i}>{CardContent}</div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Active Challenges</h2>
            <Link href="/challenges">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                View All →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link key={module.id} href={`/challenges/${module.id}`}>
                <ModuleCard
                  module={module}
                  icon={getIconForModule(module.id)}
                  index={index}
                />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer - only on main page with GitHub logo */}
      <Footer showGitHubLogo={true} />
    </div>
  )
}
