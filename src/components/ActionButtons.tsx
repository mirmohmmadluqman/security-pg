'use client'

import React, { useState } from 'react'
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
  Zap,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type IDEStatus = 'idle' | 'compiling' | 'deploying' | 'executing' | 'success' | 'error'

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
  status: IDEStatus
}

export function ActionButtons({
  selectedModule,
  activeTab,
  onCompile,
  onDeploy,
  onExploit,
  onReset,
  onSave,
  isRunning,
  status
}: ActionButtonsProps) {
  const [showSolution, setShowSolution] = useState(false)

  const getStatusIcon = () => {
    switch (status) {
      case 'compiling':
      case 'deploying':
      case 'executing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />
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
      case 'executing': return activeTab === 'fixed' ? 'Verifying fix...' : 'Executing exploit...'
      case 'success': return activeTab === 'fixed' ? 'Contract secured!' : 'Action complete'
      case 'error': return 'Vulnerability found!'
      default: return 'Ready'
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 bg-black/20 px-3 py-1.5 rounded-none border border-white/5">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-mono text-muted-foreground min-w-[100px]">
            {getStatusText()}
          </span>
        </div>

        {status === 'error' && activeTab === 'vulnerable' && (
          <Badge variant="destructive" className="gap-1 animate-pulse bg-red-500/20 text-red-500 border-red-500/50">
            <AlertTriangle className="w-3 h-3" />
            ATTACK SUCCESS
          </Badge>
        )}

        {status === 'success' && activeTab === 'fixed' && (
          <Badge className="gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">
            <CheckCircle className="w-3 h-3" />
            FIX VERIFIED
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onCompile}
          disabled={isRunning}
          className="cursor-pointer animate-shine gap-2 border-white/10 rounded-none hover:bg-primary/20 hover:text-primary transition-all hover:border-primary/50 uppercase tracking-widest font-mono text-xs"
        >
          <Play className="w-3.5 h-3.5" />
          Compile
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDeploy}
          disabled={isRunning}
          className="cursor-pointer animate-shine gap-2 border-white/10 rounded-none hover:bg-primary/20 hover:text-primary transition-all hover:border-primary/50 uppercase tracking-widest font-mono text-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          Deploy
        </Button>

        <Button
          size="sm"
          onClick={onExploit}
          disabled={isRunning}
          className={cn(
            "cursor-pointer animate-shine gap-2 font-bold shadow-lg transition-all min-w-[120px] rounded-none uppercase tracking-widest",
            activeTab === 'fixed'
              ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20 hover:shadow-green-500/40"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40"
          )}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          {activeTab === 'fixed' ? 'Verify Fix' : 'Run Exploit'}
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
