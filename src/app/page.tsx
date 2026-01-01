'use client'

import { useState, useEffect } from 'react'
import { SecurityModule } from '@/lib/types'
import { modules } from '@/lib/modules'
import { ModuleSelector } from '@/components/ModuleSelector'
import { CodeEditor } from '@/components/CodeEditor'
import { InfoPanel } from '@/components/InfoPanel'
import { ActionButtons } from '@/components/ActionButtons'
import { VMConsole } from '@/components/VMConsole'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Code, Bug, Shield, Terminal, Cpu, Lock } from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Logo } from '@/components/Logo'

export default function SecurityPlayground() {
  const [selectedModule, setSelectedModule] = useState<SecurityModule | null>(null)
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'attack' | 'fixed'>('vulnerable')
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize code when module is selected
  const handleSelectModule = (module: SecurityModule) => {
    setSelectedModule(module)
    setActiveTab('vulnerable')
    setCode(module.vulnerableCode)
    setLogs([])
  }

  // Go back to module selection
  const handleBackToModules = () => {
    setSelectedModule(null)
    setLogs([])
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    const newTab = tab as 'vulnerable' | 'attack' | 'fixed'
    setActiveTab(newTab)

    if (selectedModule) {
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
  }

  // Action handlers
  const handleCompile = () => {
    setLogs([...logs, '🔨 Compiling contract...'])
    setTimeout(() => {
      setLogs(prev => [...prev, '✅ Compilation successful!'])
    }, 1000)
  }

  const handleDeploy = () => {
    setLogs([...logs, '🚀 Deploying contract to local EVM...'])
    setTimeout(() => {
      setLogs(prev => [...prev, '✅ Contract deployed at: 0x1234...5678'])
    }, 1000)
  }

  const handleExploit = () => {
    setIsRunning(true)
    setLogs([...logs, '⚡ Running exploit...'])

    setTimeout(() => {
      if (activeTab === 'vulnerable') {
        setLogs(prev => [
          ...prev,
          '⚠️  Vulnerability detected!',
          `💥 ${selectedModule?.vulnerability}`,
          '❌ Exploit successful - contract is vulnerable!'
        ])
      } else if (activeTab === 'fixed') {
        setLogs(prev => [
          ...prev,
          '🔒 Testing fixed contract...',
          '✅ Exploit blocked!',
          '🎉 Fix verified - contract is safe!'
        ])
      } else {
        setLogs(prev => [
          ...prev,
          '💣 Attack contract deployed',
          '⚔️  Attacking vulnerable contract...',
          '💰 Exploit executed successfully!'
        ])
      }
      setIsRunning(false)
    }, 2000)
  }

  const handleReset = () => {
    if (selectedModule) {
      handleTabChange(activeTab)
      setLogs(['🔄 Contract reset to original state'])
    }
  }

  const handleSave = () => {
    setLogs([...logs, '💾 Progress saved!'])
  }

  if (!mounted) return null

  // If no module is selected, show module selection (Hero Section)
  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">


          <header className="flex justify-between items-center mb-16">
            <Logo />
            <ThemeSelector />
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2">
              Master Smart Contract Security
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Interactive playground to learn, exploit, and fix real-world Ethereum vulnerabilities in a safe environment.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/20">
                Start Hacking
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full">
                View Documentation
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Terminal, title: "Real Exploits", desc: "Execute actual attack vectors against vulnerable contracts in a local VM." },
              { icon: Bug, title: "Vulnerability Database", desc: "Comprehensive library of common security pitfalls like Reentrancy and Overflow." },
              { icon: Lock, title: "Fix & Verify", desc: "Patch the code and run automated tests to verify your security fixes." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              Choose a Challenge
            </h2>
            <ModuleSelector modules={modules} onSelectModule={handleSelectModule} />
          </motion.div>
        </div>
      </div>
    )
  }

  // Module detail view with code editor and learning interface
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToModules}
            className="gap-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-bold text-foreground">
            {selectedModule.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden md:block">
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Solidity 0.8.0</span>
          </div>
          <ThemeSelector />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Panel - Info */}
        <div className="col-span-12 md:col-span-3 border-r border-border bg-card overflow-y-auto">
          <InfoPanel module={selectedModule} />
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="col-span-12 md:col-span-6 flex flex-col bg-background min-h-[500px]">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <div className="border-b border-border bg-card px-4">
              <TabsList className="bg-transparent w-full justify-start h-12">
                <TabsTrigger value="vulnerable" className="gap-2 data-[state=active]:bg-muted">
                  <Bug className="w-4 h-4 text-destructive" />
                  Vulnerable
                </TabsTrigger>
                <TabsTrigger value="attack" className="gap-2 data-[state=active]:bg-muted">
                  <Code className="w-4 h-4 text-primary" />
                  Attack
                </TabsTrigger>
                <TabsTrigger value="fixed" className="gap-2 data-[state=active]:bg-muted">
                  <Shield className="w-4 h-4 text-green-500" />
                  Fixed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 relative">
              <TabsContent value="vulnerable" className="absolute inset-0 m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={theme === 'dark' || theme === 'cyberpunk' || theme === 'enterprise'}
                  readOnly={false}
                  onChange={setCode}
                />
              </TabsContent>
              <TabsContent value="attack" className="absolute inset-0 m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={theme === 'dark' || theme === 'cyberpunk' || theme === 'enterprise'}
                  readOnly={true}
                />
              </TabsContent>
              <TabsContent value="fixed" className="absolute inset-0 m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={theme === 'dark' || theme === 'cyberpunk' || theme === 'enterprise'}
                  readOnly={false}
                  onChange={setCode}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="border-t border-border bg-card p-4">
            <ActionButtons
              selectedModule={selectedModule}
              activeTab={activeTab}
              isDarkMode={theme === 'dark' || theme === 'cyberpunk'} // Passed for legacy support if needed
              onToggleDarkMode={() => { }} // No-op, handled by ThemeSelector
              onCompile={handleCompile}
              onDeploy={handleDeploy}
              onExploit={handleExploit}
              onReset={handleReset}
              onSave={handleSave}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Right Panel - Console */}
        <div className="col-span-12 md:col-span-3 border-l border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border font-mono text-sm font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            VM Console
          </div>
          <div className="flex-1 overflow-hidden">
            <VMConsole logs={logs} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  )
}