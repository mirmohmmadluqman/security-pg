'use client'

import { useEffect, useRef, useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import { Skeleton } from '@/components/ui/skeleton'

// Optimize Monaco loading
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } })

interface CodeEditorProps {
  code: string
  language: string
  isDarkMode: boolean
  readOnly?: boolean
  onChange?: (value: string) => void
}

export function CodeEditor({ code, language, isDarkMode, readOnly = false, onChange }: CodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Register Solidity
    if (!monaco.languages.getLanguages().some((l: any) => l.id === 'solidity')) {
      monaco.languages.register({ id: 'solidity' })
      monaco.languages.setMonarchTokensProvider('solidity', {
        tokenizer: {
          root: [
            [/\b(contract|function|modifier|event|struct|enum|library|interface|using|pragma|solidity)\b/, 'keyword'],
            [/\b(address|uint|int|bool|string|bytes|mapping|storage|memory|calldata)\b/, 'type'],
            [/\b(public|private|internal|external|view|pure|payable|constant|immutable|virtual|override)\b/, 'keyword'],
            [/\b(if|else|for|while|do|break|continue|return|throw|revert|require|assert|emit)\b/, 'keyword'],
            [/\b(msg|block|tx|this|super|now|suicide|selfdestruct)\b/, 'variable.predefined'],
            [/\b(true|false|null|nil|undefined)\b/, 'constant.language'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string_double'],
            [/\d+/, 'number'],
            [/[{}]/, 'delimiter.bracket'],
            [/[a-zA-Z_]\w*/, 'identifier'],
            [/\/\/.*$/, 'comment'],
          ],
          string_double: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape'],
            [/"/, 'string', '@pop']
          ],
        }
      })
    }

    // Custom Web3 Dark Theme
    monaco.editor.defineTheme('web3-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' }, // Purple-400
        { token: 'type', foreground: '22d3ee' }, // Cyan-400
        { token: 'string', foreground: '4ade80' }, // Green-400
        { token: 'number', foreground: 'f472b6' }, // Pink-400
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' }, // Slate-500
        { token: 'variable.predefined', foreground: 'fbbf24' }, // Amber-400
        { token: 'identifier', foreground: 'e2e8f0' }, // Slate-200
        { token: 'delimiter', foreground: '94a3b8' }, // Slate-400
      ],
      colors: {
        'editor.background': '#00000000', // Transparent
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#ffffff0a',
        'editorCursor.foreground': '#22d3ee',
        'editorIndentGuide.background': '#ffffff1a',
        'editor.selectionBackground': '#22d3ee33',
        'scrollbarSlider.background': '#ffffff1a',
        'scrollbarSlider.hoverBackground': '#ffffff33',
        'scrollbarSlider.activeBackground': '#ffffff4d',
        'widget.shadow': '#00000000',
      }
    })

    monaco.editor.setTheme('web3-dark')
  }

  // Update theme when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'web3-dark' : 'vs')
      }
    }
  }, [isDarkMode])

  return (
    <div className="h-full relative font-mono text-sm">
      {!isEditorReady && (
        <div className="absolute inset-0 p-4 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-2/3 bg-white/5" />
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage="solidity"
        language="solidity"
        value={code}
        theme="web3-dark"
        onChange={(value) => onChange?.(value || '')}
        onMount={handleEditorDidMount}
        loading=""
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          contextmenu: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  )
}
