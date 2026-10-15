import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react'

import { initialNodes, nodeTypes } from './nodes'
import { initialEdges, edgeTypes } from './edges'
import YamlPane from './YamlPane'

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )

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
          <YamlPane />
        </section>
        <section className="min-h-0 min-w-0" aria-label="Node graph">
          <ReactFlow
            colorMode="dark"
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </section>
      </main>
    </div>
  )
}
