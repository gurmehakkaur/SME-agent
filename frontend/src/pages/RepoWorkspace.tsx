import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
import { MapPanel } from '../components/MapPanel'
import { StatusBadge } from '../components/StatusBadge'
import { repos } from '../data/mock'

export function RepoWorkspace() {
  const { repoId } = useParams()
  const repo = repos.find((item) => item.id === repoId)
  const [pane, setPane] = useState<'chat' | 'maps'>('chat')

  if (!repo) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="font-mono text-[12px] text-fog hover:text-mint">
            ← workspace
          </Link>
          <span className="text-line-strong">/</span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm">
              {repo.owner}/<span className="text-paper">{repo.name}</span>
            </p>
            <p className="truncate text-[12px] text-fog">
              {repo.defaultBranch} · {repo.lastPr} · indexed {repo.lastIndexed}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={repo.freshness} />
          <span className="hidden font-mono text-[11px] text-fog sm:inline">
            {repo.findings} findings · {repo.cachedAnswers} cached
          </span>
          <div className="flex rounded-lg border border-line bg-panel p-0.5 lg:hidden">
            <button
              type="button"
              onClick={() => setPane('chat')}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] ${pane === 'chat' ? 'bg-raised text-mint' : 'text-fog'}`}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setPane('maps')}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] ${pane === 'maps' ? 'bg-raised text-mint' : 'text-fog'}`}
            >
              Maps
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className={`min-h-0 min-w-0 flex-1 ${pane === 'maps' ? 'hidden lg:flex' : 'flex'}`}>
          <ChatPanel repo={repo} />
        </div>
        <div className={`min-h-0 min-w-0 flex-1 ${pane === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
          <MapPanel repo={repo} />
        </div>
      </div>
    </div>
  )
}
