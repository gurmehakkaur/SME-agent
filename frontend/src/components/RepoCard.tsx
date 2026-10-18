import { Link } from 'react-router-dom'
import type { Repo } from '../types'
import { StatusBadge } from './StatusBadge'

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Link
      to={`/r/${repo.id}`}
      className="group flex flex-col rounded-2xl border border-line bg-panel p-5 transition hover:border-line-strong hover:bg-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[12px] text-fog">
            {repo.owner}/<span className="text-paper">{repo.name}</span>
          </p>
          <p className="mt-2 text-sm leading-6 text-fog">{repo.description}</p>
        </div>
        <StatusBadge status={repo.freshness} />
      </div>

      <div className="mt-5 flex items-center gap-4 font-mono text-[11px] text-fog">
        <span>{repo.language}</span>
        <span className="text-line-strong">/</span>
        <span>{repo.findings} findings</span>
        <span className="text-line-strong">/</span>
        <span>{repo.coverage}% map</span>
      </div>

      <div className="mt-4 h-px bg-line" />

      <div className="mt-4 flex items-center justify-between text-[12px] text-fog">
        <span>
          {repo.freshness === 'indexing' ? 'Index in progress' : `Indexed ${repo.lastIndexed}`}
        </span>
        <span className="text-mint opacity-0 transition group-hover:opacity-100">Open workspace →</span>
      </div>
    </Link>
  )
}
