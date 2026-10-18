export type Freshness = 'fresh' | 'aging' | 'stale' | 'indexing'

export type Repo = {
  id: string
  owner: string
  name: string
  description: string
  language: string
  defaultBranch: string
  lastIndexed: string
  lastPr: string
  freshness: Freshness
  findings: number
  cachedAnswers: number
  coverage: number
}

export type Evidence = {
  path: string
  symbol?: string
  lines?: string
  revision: string
}

export type ChatRole = 'user' | 'sme'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  createdAt: string
  evidence?: Evidence[]
  reused?: boolean
  tokensSaved?: number
}

export type MapKind = 'architecture' | 'execution' | 'impact'

export type MapNode = {
  id: string
  label: string
  kind: 'service' | 'store' | 'edge' | 'job' | 'test'
  x: number
  y: number
  detail: string
}

export type MapEdge = {
  from: string
  to: string
  label?: string
}

export type RepoMap = {
  kind: MapKind
  title: string
  subtitle: string
  nodes: MapNode[]
  edges: MapEdge[]
}
