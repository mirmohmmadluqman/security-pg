'use client'

import { useEffect, useState } from 'react'
import { modules } from '@/lib/modules'
import { ModuleCard } from '@/components/ModuleCard'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@/components/ConnectButton'
import { Terminal, Shield, Zap, Bug, Lock, Cpu, BookOpen, Star } from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { useWallet } from '@/context/WalletContext'

export default function HomeClient() {
  const { theme, resolvedTheme } = useTheme()
  const { completedModules } = useWallet()
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
      <Header />

      {/* Background Gradients - Adjusted for Blueshift aesthetic */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-none blur-[160px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-none blur-[140px] pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 relative z-10 flex-1">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 animate-float"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-none border border-primary/20 bg-primary/5 text-primary text-sm font-medium backdrop-blur-sm uppercase tracking-widest font-mono">
            🚀 Interactive Web3 Security Environment
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight uppercase">
            Security <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Playground</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Master the art of smart contract security. Exploit real vulnerabilities, patch code, and level up your auditing skills.
          </p>
          <div className="flex justify-center gap-6">
            <Button size="lg" className="text-lg px-8 h-14 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(168,85,247,0.3)] border-0 font-bold uppercase tracking-widest" asChild>
              <Link href="/challenges">Start Hacking</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-none border-primary/30 hover:bg-primary/10 backdrop-blur-sm uppercase tracking-widest font-bold" asChild>
              <Link href="https://github.com/mirmohmadluqman/security-pg#readme" target="_blank">
                Documentation
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats / Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Terminal, title: "EXPLOITS", desc: "Execute actual attack vectors in a sandboxed EVM." },
            { icon: Shield, title: "DEFENSE", desc: "Patch vulnerabilities and verify fixes instantly." },
            { icon: Zap, title: "FEEDBACK", desc: "Real-time compilation and execution logs." },
            { icon: Star, title: "PLAYGROUND", desc: "Exploit sophisticated protocols in our playground.", link: "/dvd" }
          ].map((feature, i) => {
            const CardContent = (
              <div className={`bg-card p-8 border border-border flex flex-col items-center text-center hover:border-primary/50 transition-all duration-300 h-full ${feature.link ? 'cursor-pointer' : ''} group rounded-none shadow-sm`}>
                <div className="p-4 bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-widest">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-light">{feature.desc}</p>
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
            <h2 className="text-3xl font-bold tracking-tight uppercase">Learning Paths</h2>
            <Link href="/challenges">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 font-mono text-sm uppercase tracking-widest rounded-none">
                Explore All →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Link key={module.id} href={`/challenges/${module.id}`}>
                <ModuleCard
                  module={module}
                  icon={getIconForModule(module.id)}
                  index={index}
                  completedChallenges={completedModules.includes(module.id) ? 3 : 0}
                  totalChallenges={3}
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
