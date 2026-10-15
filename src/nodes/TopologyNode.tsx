import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CSSProperties } from 'react'
import type { AppNode } from './types'

export function ResourceNode({ data, type }: NodeProps<AppNode>) {
  return (
    <div className="topology-resource" style={{ '--node-color': data.color } as CSSProperties}>
      <Handle id="attachment-target" type="target" position={Position.Top} />
      <span>{data.label}</span>
      {type === 'ServiceNode' && <>
        <Handle id="attachment" type="source" position={Position.Bottom} />
        <Handle id="dependency" type="source" position={Position.Right} />
        <Handle id="dependency-target" type="target" position={Position.Left} />
      </>}
    </div>
  )
}

export function LaneNode({ data }: NodeProps<AppNode>) {
  return <div className="topology-lane" style={{ '--node-color': data.color } as CSSProperties}>
    <span>{data.label}</span>
  </div>
}
