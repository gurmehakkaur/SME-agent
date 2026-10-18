import { useMemo, useState } from 'react'
import { maps } from '../data/mock'
import type { MapKind, MapNode, Repo, RepoMap } from '../types'

const tabs: { id: MapKind; label: string }[] = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'execution', label: 'Execution' },
  { id: 'impact', label: 'Impact' },
]

const nodeFill: Record<MapNode['kind'], string> = {
  service: '#134e4a',
  store: '#1e293b',
  edge: '#312e81',
  job: '#3f3f46',
  test: '#1f2937',
}

const nodeStroke: Record<MapNode['kind'], string> = {
  service: '#5eead4',
  store: '#93c5fd',
  edge: '#a5b4fc',
  job: '#d6d3d1',
  test: '#86efac',
}

export function MapPanel({ repo }: { repo: Repo }) {
  const [kind, setKind] = useState<MapKind>('architecture')
  const [selected, setSelected] = useState<string | null>(null)

  const available = maps[repo.id] ?? fallbackMaps(repo)
  const current = useMemo<RepoMap>(
    () => available.find((item) => item.kind === kind) ?? available[0],
    [available, kind],
  )

  const selectedNode = current.nodes.find((node) => node.id === selected)

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-ink">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <h2 className="text-sm font-medium">Quick reference</h2>
          <p className="text-[12px] text-fog">Structured maps, not wiki pages.</p>
        </div>
        <div className="flex rounded-lg border border-line bg-panel p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setKind(tab.id)
                setSelected(null)
              }}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] ${
                current.kind === tab.id ? 'bg-raised text-mint' : 'text-fog hover:text-paper'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">{current.title}</p>
        <p className="mt-1 text-sm text-fog">{current.subtitle}</p>

        <svg viewBox="0 0 760 280" className="mt-4 w-full overflow-visible rounded-2xl border border-line bg-panel">
          {current.edges.map((edge) => {
            const from = current.nodes.find((node) => node.id === edge.from)
            const to = current.nodes.find((node) => node.id === edge.to)
            if (!from || !to) return null
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={from.x + 70}
                  y1={from.y + 22}
                  x2={to.x + 70}
                  y2={to.y + 22}
                  stroke="#323a4d"
                  strokeWidth="1.4"
                />
                {edge.label && (
                  <text
                    x={(from.x + to.x) / 2 + 70}
                    y={(from.y + to.y) / 2 + 16}
                    fill="#8b93a7"
                    fontSize="10"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}
          {current.nodes.map((node) => (
            <g
              key={node.id}
              className="cursor-pointer"
              onClick={() => setSelected(node.id)}
            >
              <rect
                x={node.x}
                y={node.y}
                width="140"
                height="44"
                rx="10"
                fill={nodeFill[node.kind]}
                stroke={selected === node.id ? '#5eead4' : nodeStroke[node.kind]}
                strokeWidth={selected === node.id ? 2 : 1.2}
              />
              <text
                x={node.x + 70}
                y={node.y + 27}
                textAnchor="middle"
                fill="#eef2f8"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-4 rounded-xl border border-line bg-panel px-4 py-3">
          {selectedNode ? (
            <>
              <p className="font-mono text-[12px] text-mint">{selectedNode.label}</p>
              <p className="mt-1 text-sm leading-6 text-fog">{selectedNode.detail}</p>
            </>
          ) : (
            <p className="text-sm text-fog">Select a node for the evidence-backed relationship.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function fallbackMaps(repo: Repo): RepoMap[] {
  return [
    {
      kind: 'architecture',
      title: 'Initial map',
      subtitle: `${repo.name} is still collecting structure`,
      nodes: [
        { id: 'src', label: 'source', kind: 'service', x: 80, y: 110, detail: 'Repository contents awaiting first index.' },
        { id: 'idx', label: 'indexer', kind: 'job', x: 310, y: 110, detail: 'Builds the codebase map and findings.' },
        { id: 'mem', label: 'surrealdb', kind: 'store', x: 540, y: 110, detail: 'Shared memory stays empty until verified findings exist.' },
      ],
      edges: [
        { from: 'src', to: 'idx' },
        { from: 'idx', to: 'mem' },
      ],
    },
    {
      kind: 'execution',
      title: 'Execution',
      subtitle: 'No hot paths extracted yet',
      nodes: [
        { id: 'q', label: 'question', kind: 'edge', x: 180, y: 120, detail: 'Developer or agent asks.' },
        { id: 'hold', label: 'unverified', kind: 'job', x: 430, y: 120, detail: 'Answers stay session-only during indexing.' },
      ],
      edges: [{ from: 'q', to: 'hold' }],
    },
    {
      kind: 'impact',
      title: 'Impact',
      subtitle: 'No change graph yet',
      nodes: [
        { id: 'pr', label: 'merged PRs', kind: 'edge', x: 300, y: 120, detail: 'PR-triggered updates will land after GitHub sync.' },
      ],
      edges: [],
    },
  ]
}
