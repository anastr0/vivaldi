import type { Edge } from '@xyflow/react'
import type { AppNode } from './nodes/types'

type RecordValue = Record<string, unknown>
const record = (value: unknown): RecordValue =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as RecordValue : {}
const names = (value: unknown): string[] => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string')
  : Object.keys(record(value))

export function createTopology(document: unknown): { nodes: AppNode[]; edges: Edge[] } {
  const compose = record(document)
  const services = record(compose.services)
  const networks = new Set(Object.keys(record(compose.networks)))
  const volumes = new Set(Object.keys(record(compose.volumes)))
  const attachments: { service: string; kind: 'network' | 'volume' | 'service'; target: string }[] = []

  for (const [name, value] of Object.entries(services)) {
    const service = record(value)
    const attachedNetworks = names(service.networks)
    if (!service.network_mode && service.networks == null) attachedNetworks.push('default')
    for (const network of attachedNetworks) {
      networks.add(network)
      attachments.push({ service: name, kind: 'network', target: network })
    }
    if (Array.isArray(service.volumes)) {
      for (const mount of service.volumes) {
        const config = record(mount)
        const source = typeof mount === 'string' ? mount.split(':')[0] : config.source
        const named = typeof mount === 'string'
          ? mount.includes(':') && !/^(\.|\/|~|[A-Za-z]:)/.test(mount)
          : config.type === 'volume'
        if (named && typeof source === 'string' && source) {
          volumes.add(source)
          attachments.push({ service: name, kind: 'volume', target: source })
        }
      }
    }
    for (const dependency of names(service.depends_on)) {
      if (Object.prototype.hasOwnProperty.call(services, dependency)) {
        attachments.push({ service: name, kind: 'service', target: dependency })
      }
    }
  }

  const lanes = [
    { title: 'SERVICES', type: 'ServiceNode', prefix: 'service', names: Object.keys(services), color: '#2563eb' },
    { title: 'NETWORKS', type: 'NetworkNode', prefix: 'network', names: [...networks], color: '#0d9488' },
    { title: 'STORAGE', type: 'VolumeNode', prefix: 'volume', names: [...volumes], color: '#d97706' },
  ] as const
  const width = Math.max(720, ...lanes.map(lane => lane.names.length * 240 + 48))
  const nodes: AppNode[] = []
  for (const [index, lane] of lanes.entries()) {
    const parentId = `lane:${lane.prefix}`
    nodes.push({
      id: parentId, type: 'lane', position: { x: 0, y: index * 190 },
      data: { label: lane.title, color: lane.color },
      style: { width, height: 170 }, selectable: false, draggable: false,
      connectable: false,
    })
    lane.names.forEach((name, itemIndex) => nodes.push({
      id: `${lane.prefix}:${name}`, type: lane.type, parentId,
      position: { x: (width - lane.names.length * 240 + 40) / 2 + itemIndex * 240, y: 65 },
      data: { label: name, color: lane.color }, draggable: false,
      connectable: false, extent: 'parent',
    }))
  }
  const edges: Edge[] = attachments.map(({ service, kind, target }) => ({
    id: JSON.stringify([service, kind, target]), source: `service:${service}`,
    target: `${kind}:${target}`, sourceHandle: kind === 'service' ? 'dependency' : 'attachment',
    targetHandle: kind === 'service' ? 'dependency-target' : 'attachment-target',
    type: 'straight', style: { stroke: '#94a3b8', strokeDasharray: '6 5' },
    label: kind === 'service' ? 'depends on' : undefined,
  }))
  return { nodes, edges }
}
