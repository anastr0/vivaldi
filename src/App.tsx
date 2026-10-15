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
      <header className="flex shrink-0 items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="border-l-4 border-blue-700 pl-3 text-xl font-semibold tracking-tight">
          Vivaldi
        </h1>
        <a
          href="https://github.com/anastr0/vivaldi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Vivaldi on GitHub (opens in a new tab)"
          className="flex items-center gap-2 rounded px-2 py-1 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.768-.244.768-.542 0-.267-.01-.975-.015-1.914-3.13.68-3.791-1.508-3.791-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.023-.7.078-.686.078-.686 1.13.08 1.725 1.16 1.725 1.16 1.006 1.724 2.64 1.226 3.282.938.102-.73.393-1.227.715-1.51-2.499-.284-5.126-1.25-5.126-5.563 0-1.23.44-2.233 1.16-3.02-.117-.284-.503-1.429.11-2.978 0 0 .945-.302 3.094 1.154A10.78 10.78 0 0 1 12 6.18c.956.004 1.919.13 2.818.379 2.148-1.456 3.091-1.154 3.091-1.154.615 1.55.229 2.694.113 2.978.722.787 1.158 1.79 1.158 3.02 0 4.324-2.631 5.276-5.138 5.555.404.35.764 1.042.764 2.1 0 1.516-.014 2.739-.014 3.111 0 .301.203.652.774.541A11.252 11.252 0 0 0 12 .75Z" />
          </svg>
        </a>
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
