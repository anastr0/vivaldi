import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor/editor.api'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import 'monaco-editor/languages/definitions/yaml/register'

self.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco })

monaco.editor.defineTheme('vivaldi-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#020617',
    'editor.foreground': '#f1f5f9',
    'editorLineNumber.foreground': '#64748b',
    'editorLineNumber.activeForeground': '#cbd5e1',
    'editor.lineHighlightBackground': '#0f172a',
    'editor.selectionBackground': '#1d4ed8',
    'editor.inactiveSelectionBackground': '#1e3a8a',
    'editorCursor.foreground': '#1d4ed8',
    'editorIndentGuide.background1': '#1e293b',
    focusBorder: '#1d4ed8',
  },
})

export default function YamlEditor() {
  return (
    <Editor
      height="100%"
      theme="vivaldi-dark"
      loading={<span className="text-sm text-slate-400">Loading editor…</span>}
      defaultLanguage="yaml"
      defaultValue=""
      options={{
        ariaLabel: 'YAML editor',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        insertSpaces: true,
        scrollBeyondLastLine: false,
        padding: { top: 16 },
      }}
    />
  )
}
