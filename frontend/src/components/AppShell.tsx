import { NavLink, Outlet } from 'react-router-dom'

const item =
  'flex h-10 w-10 items-center justify-center rounded-lg text-fog transition hover:bg-raised hover:text-paper'

export function AppShell() {
  return (
    <div className="flex h-full bg-ink text-paper">
      <aside className="flex w-16 shrink-0 flex-col items-center border-r border-line bg-panel py-4">
        <NavLink
          to="/"
          className="mb-8 flex size-10 items-center justify-center rounded-xl bg-mint-dim text-mint ring-1 ring-mint/30"
          title="SME"
        >
          <span className="font-mono text-sm font-medium">S</span>
        </NavLink>

        <nav className="flex flex-1 flex-col gap-2">
          <NavLink to="/" end className={({ isActive }) => `${item} ${isActive ? 'bg-raised text-mint' : ''}`} title="Workspace">
            <IconGrid />
          </NavLink>
        </nav>

        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint/80">
          SME
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
