import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor/editor.api'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import 'monaco-editor/languages/definitions/yaml/register'

self.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco })

export default function YamlEditor() {
  return (
    <Editor
      height="100%"
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
