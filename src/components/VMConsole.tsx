'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, Download, Terminal } from 'lucide-react'

interface VMConsoleProps {
  logs?: string[]
  isRunning?: boolean
}

export function VMConsole({ logs = [], isRunning }: VMConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'))
  }

  const downloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "vm_logs.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] font-mono text-sm border-t border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider">EVM_OUTPUT_STREAM</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={copyLogs}>
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={downloadLogs}>
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 opacity-50">
            <Terminal className="w-8 h-8 mb-2" />
            <p className="text-xs">Waiting for contract interaction...</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-slate-600 select-none">{'>'}</span>
              <span className={`break-all ${log.includes('❌') || log.includes('error') ? 'text-red-400' :
                  log.includes('✅') || log.includes('safe') ? 'text-green-400' :
                    log.includes('⚠️') ? 'text-yellow-400' :
                      'text-slate-300'
                }`}>
                {log}
              </span>
            </div>
          ))
        )}
        {isRunning && (
          <div className="flex gap-2">
            <span className="text-slate-600 select-none">{'>'}</span>
            <span className="w-2 h-4 bg-green-500 animate-pulse block" />
          </div>
        )}
      </div>
    </div>
  )
}
