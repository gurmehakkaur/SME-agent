import { freshnessClass, freshnessLabel } from '../lib/status'
import type { Freshness } from '../types'

export function StatusBadge({ status }: { status: Freshness }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ring-1 ${freshnessClass[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {freshnessLabel[status]}
    </span>
  )
}
