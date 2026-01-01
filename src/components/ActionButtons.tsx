'use client'

import React, { useState } from 'react'
import { SecurityModule } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Square,
  RotateCcw,
  Save,
  Upload,
  Eye,
  EyeOff,
  Moon,
  Sun,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

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
  isDarkMode,
  onToggleDarkMode,
  onCompile,
  onDeploy,
  onExploit,
  onReset,
  onSave,
  isRunning
}: ActionButtonsProps) {
  const [status, setStatus] = useState<'idle' | 'compiling' | 'deploying' | 'executing' | 'success' | 'error'>('idle')
  const [showSolution, setShowSolution] = useState(false)

  // This would be managed by the playground service in a real implementation
  React.useEffect(() => {
    if (isRunning) {
      setStatus('executing')
    } else {
      setStatus('idle')
    }
  }, [isRunning])

  const getStatusIcon = () => {
    switch (status) {
      case 'compiling':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case 'deploying':
        return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      case 'executing':
        return <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'compiling':
        return 'Compiling...'
      case 'deploying':
        return 'Deploying...'
      case 'executing':
        return 'Executing exploit...'
      case 'success':
        return activeTab === 'vulnerable' ? 'Exploit successful!' : 'Fix verified!'
      case 'error':
        return 'Exploit failed!'
      default:
        return 'Ready'
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {getStatusText()}
          </span>
        </div>

        {status === 'error' && activeTab === 'vulnerable' && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Vulnerability detected!
          </Badge>
        )}

        {status === 'success' && activeTab === 'fixed' && (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle className="w-3 h-3" />
            Fix verified!
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCompile}
          disabled={isRunning}
          className="gap-1"
        >
          <Play className="w-4 h-4" />
          Compile
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDeploy}
          disabled={isRunning}
          className="gap-1"
        >
          <Upload className="w-4 h-4" />
          Deploy
        </Button>

        <Button
          variant={activeTab === 'vulnerable' ? 'destructive' : 'default'}
          size="sm"
          onClick={onExploit}
          disabled={isRunning}
          className="gap-1"
        >
          <Zap className="w-4 h-4" />
          {activeTab === 'vulnerable' ? 'Run Exploit' : 'Test Fix'}
        </Button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="gap-1"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
          className="gap-1"
        >
          {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showSolution ? 'Hide' : 'Show'} Solution
        </Button>
      </div>
    </div>
  )
}

function Zap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )
}