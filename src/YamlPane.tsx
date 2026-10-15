import { useMemo, useState } from 'react'
import { parse } from 'yaml'

import YamlEditor from './YamlEditor'

export default function YamlPane() {
  const [source, setSource] = useState('')
  const result = useMemo(() => {
    if (!source.trim()) return { text: '', error: false }

    try {
      return { text: JSON.stringify(parse(source), null, 2), error: false }
    } catch (error) {
      return {
        text: error instanceof Error ? error.message : 'Unable to parse YAML.',
        error: true,
      }
    }
  }, [source])

  return (
    <div className="grid h-full min-h-0 grid-rows-2">
      <section className="min-h-0 min-w-0" aria-label="YAML editor">
        <YamlEditor onChange={setSource} />
      </section>
      <section
        className="flex min-h-0 min-w-0 flex-col border-t border-slate-800"
        aria-labelledby="parsed-yaml-title"
      >
        <h2
          id="parsed-yaml-title"
          className="shrink-0 border-b border-slate-800 px-4 py-2 text-sm font-medium text-slate-300"
        >
          Parsed YAML
          <span className="ml-2 text-xs text-slate-500">JSON</span>
        </h2>
        <pre
          className={`min-h-0 flex-1 overflow-auto p-4 font-mono text-sm ${result.error ? 'text-red-400' : 'text-slate-300'}`}
          role={result.error ? 'alert' : undefined}
        >
          {result.text || 'Paste or type YAML above to see the parsed result.'}
        </pre>
      </section>
    </div>
  )
}
