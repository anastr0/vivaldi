import type { NodeTypes } from '@xyflow/react'
import { ResourceNode, LaneNode } from './TopologyNode'

export const nodeTypes = {
  ServiceNode: ResourceNode,
  NetworkNode: ResourceNode,
  VolumeNode: ResourceNode,
  lane: LaneNode,
} satisfies NodeTypes
