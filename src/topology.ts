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
  const volumePaths = new Map<string, Set<string>>()
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
          const target = typeof mount === 'string' ? mount.split(':')[1] : config.target
          if (typeof target === 'string' && target) {
            const paths = volumePaths.get(source) ?? new Set<string>()
            paths.add(target)
            volumePaths.set(source, paths)
          }
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

  const resourceData = (prefix: string, name: string, color: string): AppNode['data'] => {
    const attributes: { label: string; value: string }[] = []
    if (prefix === 'service') {
      const service = record(services[name])
      for (const key of ['image', 'container_name']) {
        if (typeof service[key] === 'string' && service[key]) {
          attributes.push({ label: key, value: service[key] })
        }
      }
    } else if (prefix === 'volume') {
      for (const path of volumePaths.get(name) ?? []) {
        attributes.push({ label: 'Mount path', value: path })
      }
    }
    const configuration = prefix === 'service' ? record(services[name])
      : record(record(prefix === 'network' ? compose.networks : compose.volumes)[name])
    return { label: name, color, attributes, configuration }
  }
  const resourceHeight = (data: AppNode['data']) => 32 + Math.ceil(data.label.length / 20) * 27
    + (data.attributes ?? []).reduce((height, attribute) =>
      height + 24 + Math.ceil(attribute.value.length / 28) * 18, 0)

  const lanes = [
    { title: 'SERVICES', type: 'ServiceNode', prefix: 'service', names: Object.keys(services), color: '#2563eb' },
    { title: 'NETWORKS', type: 'NetworkNode', prefix: 'network', names: [...networks], color: '#0d9488' },
    { title: 'STORAGE', type: 'VolumeNode', prefix: 'volume', names: [...volumes], color: '#d97706' },
  ] as const
  const visibleLanes = lanes.filter(lane => lane.names.length > 0)
  const width = Math.max(720, ...visibleLanes.map(lane => lane.names.length * 300 + 48))
  const nodes: AppNode[] = []
  let laneY = 0
  for (const lane of visibleLanes) {
    const height = Math.max(170, ...lane.names.map(name =>
      resourceHeight(resourceData(lane.prefix, name, lane.color)) + 90))
    const parentId = `lane:${lane.prefix}`
    nodes.push({
      id: parentId, type: 'lane', position: { x: 0, y: laneY },
      data: { label: lane.title, color: lane.color },
      style: { width, height }, selectable: false, draggable: false,
      connectable: false,
    })
    lane.names.forEach((name, itemIndex) => nodes.push({
      id: `${lane.prefix}:${name}`, type: lane.type, parentId,
      position: { x: (width - lane.names.length * 300 + 40) / 2 + itemIndex * 300, y: 65 },
      data: resourceData(lane.prefix, name, lane.color), draggable: false,
      connectable: false, extent: 'parent',
    }))
    laneY += height + 20
  }
  const edges: Edge[] = attachments.map(({ service, kind, target }) => ({
    id: JSON.stringify([service, kind, target]), source: `service:${service}`,
    target: `${kind}:${target}`, sourceHandle: kind === 'service' ? 'dependency' : 'attachment',
    targetHandle: kind === 'service' ? 'dependency-target' : 'attachment-target',
    animated: kind === 'network',
    type: 'straight', style: { stroke: '#94a3b8', strokeDasharray: '6 5' },
    label: kind === 'service' ? 'depends on' : undefined,
  }))
  return { nodes, edges }
}
