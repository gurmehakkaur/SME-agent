import type { Freshness } from '../types'

export const freshnessLabel: Record<Freshness, string> = {
  fresh: 'Fresh',
  aging: 'Aging',
  stale: 'Stale',
  indexing: 'Indexing',
}

export const freshnessClass: Record<Freshness, string> = {
  fresh: 'text-emerald-300 bg-emerald-400/10 ring-emerald-400/20',
  aging: 'text-amber-300 bg-amber-400/10 ring-amber-400/20',
  stale: 'text-orange-300 bg-orange-400/10 ring-orange-400/25',
  indexing: 'text-mint bg-teal-400/10 ring-teal-400/20',
}
