import type { Edge } from '@xyflow/react'
import type { AppNode } from './nodes/types'
import YamlEditor from './YamlEditor'

const nodeTypeLabel = (node: AppNode) => node.type === 'ServiceNode' ? 'Service'
  : node.type === 'NetworkNode' ? 'Network' : 'Storage'

function DetailValue({ value }: { value: unknown }) {
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return <span className="text-slate-500">{Array.isArray(value) ? 'Empty list' : 'Default settings'}</span>
    if (Array.isArray(value)) return <ul className="space-y-0.5">
      {value.map((item, index) => <li key={index} className="flex min-w-0 gap-2">
        <span className="text-slate-600" aria-hidden="true">·</span>
        <div className="min-w-0 flex-1"><DetailValue value={item} /></div>
      </li>)}
    </ul>
    return <dl className="detail-fields">
      {entries.map(([key, item]) => <div key={key} className="detail-field">
        <dt className="font-medium text-slate-400">{key}</dt>
        <dd className="min-w-0"><DetailValue value={item} /></dd>
      </div>)}
    </dl>
  }
  return <span className="whitespace-pre-wrap break-words font-mono">{value === null ? 'Default' : String(value)}</span>
}

type YamlPaneProps = {
  onChange: (source: string) => void
  result: { text: string; error: boolean; nodes: AppNode[]; edges: Edge[] }
  selectedNode?: AppNode
  onSelectNode: (id: string) => void
}

export default function YamlPane({ onChange, result, selectedNode, onSelectNode }: YamlPaneProps) {
  const resources = result.nodes.filter(node => node.type !== 'lane')
  const connectedIds = new Set(result.edges.flatMap(edge => edge.source === selectedNode?.id
    ? [edge.target] : edge.target === selectedNode?.id ? [edge.source] : []))
  const connections = resources.filter(node => connectedIds.has(node.id))

  return (
    <div className="grid h-full min-h-0 grid-rows-2">
      <section className="min-h-0 min-w-0" aria-label="YAML editor">
        <YamlEditor onChange={onChange} />
      </section>
      <section
        className="flex min-h-0 min-w-0 flex-col border-t border-slate-800"
        aria-labelledby="node-details-title"
      >
        <h2 id="node-details-title" className="shrink-0 border-b border-slate-800 px-4 py-2 text-sm font-medium text-slate-300">
          Node details
        </h2>
        <div className="min-h-0 flex-1 overflow-auto px-4 py-3 text-xs leading-5 text-slate-300">
          {result.error ? <p role="alert" className="whitespace-pre-wrap text-red-400">{result.text}</p> : <>
            {!!resources.length && <label className="mb-3 flex items-center gap-3 text-slate-400">
              Select node
              <select
                className="min-w-0 flex-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
                value={selectedNode?.id ?? ''}
                onChange={event => onSelectNode(event.target.value)}
              >
                <option value="">Choose a node…</option>
                {resources.map(node => <option key={node.id} value={node.id}>{nodeTypeLabel(node)}: {node.data.label}</option>)}
              </select>
            </label>}
            {selectedNode ? <>
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
              <p className="text-xs font-medium uppercase" style={{ color: selectedNode.data.color }}>{nodeTypeLabel(selectedNode)}</p>
              <h3 className="break-all text-sm font-semibold text-slate-100">{selectedNode.data.label}</h3>
              </div>
              {!!selectedNode.data.attributes?.some(attribute => !(attribute.label in (selectedNode.data.configuration ?? {}))) && <dl className="detail-fields mb-2">
                {selectedNode.data.attributes.filter(attribute => !(attribute.label in (selectedNode.data.configuration ?? {}))).map(attribute => <div className="detail-field" key={`${attribute.label}:${attribute.value}`}>
                  <dt className="text-slate-400">{attribute.label}</dt>
                  <dd className="min-w-0 break-words font-mono">{attribute.value}</dd>
                </div>)}
              </dl>}
              <h4 className="mb-1 mt-3 font-medium text-slate-100">Configuration</h4>
              {Object.keys(selectedNode.data.configuration ?? {}).length
                ? <DetailValue value={selectedNode.data.configuration} />
                : <p className="text-slate-500">No explicit configuration. Compose defaults apply.</p>}
              <h4 className="mb-1 mt-3 font-medium text-slate-100">Connections</h4>
              {connections.length ? <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {connections.map(node => <li key={node.id}>
                  <button className="rounded text-blue-400 underline-offset-4 hover:underline focus-visible:outline-2" onClick={() => onSelectNode(node.id)}>
                    {nodeTypeLabel(node)}: {node.data.label}
                  </button>
                </li>)}
              </ul> : <p className="text-slate-500">No connections.</p>}
            </> : <p className="text-slate-400">{resources.length
              ? 'Click a node in the topology or select one above to view its details.'
              : 'Paste or type Compose YAML above, then select a node to view its details.'}</p>}
          </>}
        </div>
      </section>
    </div>
  )
}
