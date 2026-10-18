import { useEffect, useMemo, useRef, useState } from 'react'
import { RepoCard } from '../components/RepoCard'
import { repos, workspace } from '../data/mock'

export function Dashboard() {
  const [query, setQuery] = useState('')
  const [connectOpen, setConnectOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((repo) =>
      `${repo.owner}/${repo.name} ${repo.description} ${repo.language}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-line px-8 py-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
            Shared Memory for Engineering
          </p>
          <h1 className="mt-1 text-lg font-medium">{workspace.name}</h1>
        </div>
        <button
          type="button"
          onClick={() => setConnectOpen(true)}
          className="rounded-lg bg-mint-dim px-3 py-2 font-mono text-[12px] text-mint ring-1 ring-mint/30 transition hover:bg-teal-900"
        >
          Connect repository
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium tracking-tight">Connected repositories</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-fog">
                Each repo is its own SME space: grounded chat plus structured maps. Memory stays
                scoped here — conversations are not stored as knowledge.
              </p>
            </div>
            <label className="relative block w-full max-w-xs">
              <span className="sr-only">Filter repositories</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter repos"
                className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-sm text-paper outline-none placeholder:text-fog/60 focus:border-mint/40"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-fog">
                /
              </kbd>
            </label>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-line p-8 text-sm text-fog">
                No repositories match “{query}”.
              </p>
            )}
          </div>
        </div>
      </div>

      {connectOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 shadow-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mint">GitHub</p>
            <h2 className="mt-2 text-lg font-medium">Connect a repository</h2>
            <p className="mt-2 text-sm leading-6 text-fog">
              Auth and org permissions are not wired yet. This first UI is local mock data so we
              can lock navigation, chat, and maps before indexing lands.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConnectOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-fog hover:text-paper"
              >
                Close
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg bg-raised px-3 py-2 font-mono text-[12px] text-fog ring-1 ring-line"
              >
                Waiting on GitHub OAuth
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
