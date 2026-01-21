'use client'

import React, { useState, useEffect } from 'react'
import { SecurityModule } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  RotateCcw,
  Save,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  selectedModule: SecurityModule
  activeTab: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onCompile: () => void
  onDeploy: () => void
  onExploit: () => void
  onReset: () => void
  onSave: () => void
  isRunning: boolean
}

export function ActionButtons({
  selectedModule,
  activeTab,
  onCompile,
  onDeploy,
  onExploit,
  onReset,
  onSave,
  isRunning
}: ActionButtonsProps) {
  const [status, setStatus] = useState<'idle' | 'compiling' | 'deploying' | 'executing' | 'success' | 'error'>('idle')
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    if (isRunning) {
      setStatus('executing')
    } else {
      setStatus('idle')
    }
  }, [isRunning])

  const getStatusIcon = () => {
    switch (status) {
      case 'compiling':
        return <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      case 'deploying':
        return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      case 'executing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'compiling': return 'Compiling...'
      case 'deploying': return 'Deploying...'
      case 'executing': return 'Executing exploit...'
      case 'success': return activeTab === 'vulnerable' ? 'Exploit successful!' : 'Fix verified!'
      case 'error': return 'Exploit failed!'
      default: return 'Ready'
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-mono text-muted-foreground">
            {getStatusText()}
          </span>
        </div>

        {status === 'error' && activeTab === 'vulnerable' && (
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            VULN DETECTED
          </Badge>
        )}

        {status === 'success' && activeTab === 'fixed' && (
          <Badge className="gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">
            <CheckCircle className="w-3 h-3" />
            SECURED
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onCompile}
          disabled={isRunning}
          className="gap-2 border-white/10 hover:bg-white/5 hover:text-cyan-400 transition-all hover:border-cyan-400/50"
        >
          <Play className="w-3.5 h-3.5" />
          Compile
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDeploy}
          disabled={isRunning}
          className="gap-2 border-white/10 hover:bg-white/5 hover:text-yellow-400 transition-all hover:border-yellow-400/50"
        >
          <Upload className="w-3.5 h-3.5" />
          Deploy
        </Button>

        <Button
          size="sm"
          onClick={onExploit}
          disabled={isRunning}
          className={cn(
            "gap-2 font-bold shadow-lg transition-all",
            activeTab === 'vulnerable'
              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-500/20"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-500/20"
          )}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          {activeTab === 'vulnerable' ? 'Run Exploit' : 'Verify Fix'}
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="text-muted-foreground hover:text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          className="text-muted-foreground hover:text-white hover:bg-white/10"
        >
          <Save className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSolution(!showSolution)}
          className={cn("text-muted-foreground hover:bg-white/10", showSolution && "text-primary bg-primary/10")}
        >
          {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
