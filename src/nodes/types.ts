import type { Node } from '@xyflow/react'

export type AppNode = Node<{ label: string; color: string; configuration?: Record<string, unknown>; attributes?: { label: string; value: string }[] }, 'ServiceNode' | 'NetworkNode' | 'VolumeNode' | 'lane'>
export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>
