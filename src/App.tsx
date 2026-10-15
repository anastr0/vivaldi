import { useMemo, useState } from 'react'
import { parse } from 'yaml'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import { nodeTypes } from './nodes/index.tsx'
import { createTopology } from './topology'
import YamlPane from './YamlPane'

export default function App() {
  const [source, setSource] = useState('')
  const result = useMemo(() => {
    try {
      const document: unknown = source.trim() ? parse(source, { merge: true }) : null
      return { text: source.trim() ? JSON.stringify(document, null, 2) ?? '' : '', error: false, ...createTopology(document) }
    } catch (error) {
      return { text: error instanceof Error ? error.message : 'Unable to parse YAML.', error: true, ...createTopology(null) }
    }
  }, [source])
  const layoutKey = result.nodes.map(node => node.id).join('|')

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <header className="shrink-0 border-b border-slate-800 px-6 py-4">
        <h1 className="border-l-4 border-blue-700 pl-3 text-xl font-semibold tracking-tight">
          Vivaldi
        </h1>
      </header>
      <main className="grid min-h-0 flex-1 grid-cols-2">
        <section
          className="min-h-0 min-w-0 border-r border-slate-800"
          aria-label="YAML workspace"
        >
          <YamlPane onChange={setSource} result={result} />
        </section>
        <section className="min-h-0 min-w-0" aria-label="Node graph">
          <ReactFlow
            colorMode="dark"
            key={layoutKey}
            nodes={result.nodes}
            nodeTypes={nodeTypes}
            edges={result.edges}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            fitViewOptions={{ padding: 0.12 }}
            fitView
          >
            <Background />
            <MiniMap nodeColor={(node) => String(node.data.color ?? '#64748b')} />
            <Controls />
          </ReactFlow>
        </section>
      </main>
    </div>
  )
}
