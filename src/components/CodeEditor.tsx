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
  const monacoRef = useRef<any>(null)

  const handleEditorWillMount = (monaco: any) => {
    monacoRef.current = monaco
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
        { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' }, // Violet-400
        { token: 'type', foreground: '22d3ee' }, // Cyan-400
        { token: 'string', foreground: '4ade80' }, // Green-400
        { token: 'number', foreground: 'f472b6' }, // Pink-400
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' }, // Slate-400
        { token: 'variable.predefined', foreground: 'fbbf24' }, // Amber-400
        { token: 'identifier', foreground: 'e2e8f0' }, // Slate-200
        { token: 'delimiter', foreground: '94a3b8' }, // Slate-400
      ],
      colors: {
        'editor.background': '#020617', // Slate-950
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#ffffff0a',
        'editorCursor.foreground': '#a78bfa',
        'editorIndentGuide.background': '#ffffff1a',
        'editor.activeIndentGuide.background': '#ffffff33',
        'editor.selectionBackground': '#a78bfa33',
        'scrollbarSlider.background': '#ffffff1a',
        'scrollbarSlider.hoverBackground': '#ffffff33',
        'scrollbarSlider.activeBackground': '#ffffff4d',
        'widget.shadow': '#00000000',
      }
    })

    // Custom Web3 Light Theme
    monaco.editor.defineTheme('web3-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' }, // Purple-600
        { token: 'type', foreground: '0891b2' }, // Cyan-600
        { token: 'string', foreground: '16a34a' }, // Green-600
        { token: 'number', foreground: 'db2777' }, // Pink-600
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' }, // Slate-500
        { token: 'variable.predefined', foreground: 'd97706' }, // Amber-600
        { token: 'identifier', foreground: '0f172a' }, // Slate-900
        { token: 'delimiter', foreground: '475569' }, // Slate-600
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editor.lineHighlightBackground': '#0000000a',
        'editorCursor.foreground': '#7c3aed',
        'editorIndentGuide.background': '#0000001a',
        'editor.activeIndentGuide.background': '#00000033',
        'editor.selectionBackground': '#7c3aed33',
        'scrollbarSlider.background': '#0000001a',
        'scrollbarSlider.hoverBackground': '#00000033',
        'scrollbarSlider.activeBackground': '#0000004d',
        'widget.shadow': '#00000000',
      }
    })
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    setIsEditorReady(true)
  }

  // Update theme when prop changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isDarkMode ? 'web3-dark' : 'web3-light')
    }
  }, [isDarkMode])

  return (
    <div className="h-full relative font-mono text-sm overflow-hidden border border-border">
      {!isEditorReady && (
        <div className="absolute inset-0 p-4 space-y-2 bg-background z-10">
          <Skeleton className="h-4 w-3/4 bg-primary/5" />
          <Skeleton className="h-4 w-1/2 bg-primary/5" />
          <Skeleton className="h-4 w-full bg-primary/5" />
          <Skeleton className="h-4 w-2/3 bg-primary/5" />
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage="solidity"
        language="solidity"
        value={code}
        theme={isDarkMode ? 'web3-dark' : 'web3-light'}
        onChange={(value) => onChange?.(value || '')}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
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
