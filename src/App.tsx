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
import YamlEditor from './YamlEditor'

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )

  return (
    <main className="grid h-full grid-cols-2 bg-slate-950 text-slate-100">
      <section
        className="min-h-0 min-w-0 border-r border-slate-800"
        aria-label="YAML editor area"
      >
        <YamlEditor />
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
  )
}
