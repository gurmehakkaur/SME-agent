import type { ChatMessage, Repo, RepoMap } from '../types'

export const workspace = {
  name: 'SME',
  handle: 'sme',
  members: 4,
}

export const repos: Repo[] = [
  {
    id: 'payments-api',
    owner: 'acme',
    name: 'payments-api',
    description: 'Ledger, settlement, and webhook ingestion for merchant payouts.',
    language: 'Go',
    defaultBranch: 'main',
    lastIndexed: '8m ago',
    lastPr: '#482 merged · settlement retry',
    freshness: 'fresh',
    findings: 128,
    cachedAnswers: 34,
    coverage: 91,
  },
  {
    id: 'sme-agent',
    owner: 'acme',
    name: 'sme-agent',
    description: 'Shared engineering memory: retrieval, findings, and repo maps.',
    language: 'TypeScript',
    defaultBranch: 'main',
    lastIndexed: 'in progress',
    lastPr: 'awaiting first connect',
    freshness: 'indexing',
    findings: 0,
    cachedAnswers: 0,
    coverage: 12,
  },
  {
    id: 'checkout-web',
    owner: 'acme',
    name: 'checkout-web',
    description: 'Merchant checkout SPA, feature flags, and payment SDK glue.',
    language: 'TypeScript',
    defaultBranch: 'main',
    lastIndexed: '6h ago',
    lastPr: '#219 merged · 3DS fallback',
    freshness: 'aging',
    findings: 76,
    cachedAnswers: 19,
    coverage: 74,
  },
  {
    id: 'risk-engine',
    owner: 'acme',
    name: 'risk-engine',
    description: 'Scoring pipeline, rule packs, and delayed decision workers.',
    language: 'Python',
    defaultBranch: 'main',
    lastIndexed: '2d ago',
    lastPr: '#88 merged · velocity rules',
    freshness: 'stale',
    findings: 54,
    cachedAnswers: 11,
    coverage: 61,
  },
]

export const chats: Record<string, ChatMessage[]> = {
  'payments-api': [
    {
      id: 'm1',
      role: 'user',
      text: 'Where does a failed settlement retry get scheduled, and what can cancel it?',
      createdAt: '14:02',
    },
    {
      id: 'm2',
      role: 'sme',
      text: 'Failed settlements are queued by `RetryScheduler` after `SettleJob` returns a retryable error. The worker writes a `settlement_retry` row, then `RetryWorker` polls with exponential backoff. Cancellation happens when a later webhook marks the payout `settled` or ops sets `canceled_at` via the admin RPC.',
      createdAt: '14:02',
      reused: true,
      tokensSaved: 1840,
      evidence: [
        { path: 'internal/settle/retry.go', symbol: 'RetryScheduler.Enqueue', lines: '41–88', revision: 'c4f21a9' },
        { path: 'internal/worker/retry_worker.go', symbol: 'RetryWorker.Tick', lines: '112–176', revision: 'c4f21a9' },
        { path: 'internal/webhooks/payout.go', symbol: 'HandlePayoutSettled', lines: '90–121', revision: '9ab33e2' },
      ],
    },
  ],
  'sme-agent': [
    {
      id: 'm1',
      role: 'sme',
      text: 'This repository is still indexing. Chat will ground against the first codebase map once the initial pass finishes. Ask anyway — I’ll mark answers as unverified until findings exist.',
      createdAt: 'now',
    },
  ],
  'checkout-web': [
    {
      id: 'm1',
      role: 'user',
      text: 'How does 3DS fallback pick between redirect and challenge iframe?',
      createdAt: '11:18',
    },
    {
      id: 'm2',
      role: 'sme',
      text: '`ThreeDSController` prefers an in-place challenge iframe when the issuer returns `challengeWindowSize`. If the ACS URL is missing or the flag `checkout.threeds.redirectOnly` is on, it falls back to a full-page redirect through `/pay/3ds`.',
      createdAt: '11:18',
      evidence: [
        { path: 'src/payments/ThreeDSController.ts', symbol: 'startChallenge', lines: '58–140', revision: 'b81dd02' },
        { path: 'src/flags/checkout.ts', symbol: 'redirectOnly', lines: '12–18', revision: 'b81dd02' },
      ],
    },
  ],
  'risk-engine': [
    {
      id: 'm1',
      role: 'sme',
      text: 'Knowledge for this repo is stale relative to #88. Findings mentioning velocity rules should be rechecked before reuse.',
      createdAt: '09:41',
    },
  ],
}

export const maps: Record<string, RepoMap[]> = {
  'payments-api': [
    {
      kind: 'architecture',
      title: 'Service map',
      subtitle: 'Ingress, ledger write path, and stores',
      nodes: [
        { id: 'gw', label: 'edge-gateway', kind: 'edge', x: 40, y: 90, detail: 'Terminates TLS and routes /v1/payouts.' },
        { id: 'api', label: 'payments-api', kind: 'service', x: 230, y: 90, detail: 'Public HTTP + admin RPC. Owns settle orchestration.' },
        { id: 'wh', label: 'webhook-ingestor', kind: 'service', x: 230, y: 210, detail: 'Normalizes processor events onto the outbox.' },
        { id: 'job', label: 'retry-worker', kind: 'job', x: 430, y: 90, detail: 'Polls settlement_retry with bounded backoff.' },
        { id: 'pg', label: 'postgres', kind: 'store', x: 430, y: 210, detail: 'Ledger, payouts, retry rows. Source of truth.' },
        { id: 'redis', label: 'redis', kind: 'store', x: 620, y: 90, detail: 'Idempotency keys and worker leases.' },
      ],
      edges: [
        { from: 'gw', to: 'api', label: 'HTTP' },
        { from: 'api', to: 'job', label: 'enqueue' },
        { from: 'api', to: 'pg', label: 'tx' },
        { from: 'wh', to: 'pg', label: 'outbox' },
        { from: 'job', to: 'pg' },
        { from: 'job', to: 'redis', label: 'lease' },
      ],
    },
    {
      kind: 'execution',
      title: 'Settlement retry flow',
      subtitle: 'Hot path for failed payouts',
      nodes: [
        { id: 'err', label: 'SettleJob error', kind: 'service', x: 40, y: 140, detail: 'Retryable processor codes only.' },
        { id: 'enq', label: 'RetryScheduler', kind: 'job', x: 250, y: 140, detail: 'Writes settlement_retry + jittered next_run.' },
        { id: 'tick', label: 'RetryWorker.Tick', kind: 'job', x: 470, y: 80, detail: 'Claims due rows under a Redis lease.' },
        { id: 'done', label: 'payout settled', kind: 'edge', x: 470, y: 220, detail: 'Webhook cancels outstanding retries.' },
        { id: 'test', label: 'retry_test.go', kind: 'test', x: 680, y: 140, detail: 'Covers cancel-on-settled and backoff caps.' },
      ],
      edges: [
        { from: 'err', to: 'enq' },
        { from: 'enq', to: 'tick' },
        { from: 'done', to: 'tick', label: 'cancel' },
        { from: 'tick', to: 'test' },
      ],
    },
    {
      kind: 'impact',
      title: 'Change impact',
      subtitle: 'If you touch retry scheduling',
      nodes: [
        { id: 'retry', label: 'retry.go', kind: 'service', x: 80, y: 120, detail: 'Enqueue policy and jitter.' },
        { id: 'worker', label: 'retry_worker.go', kind: 'job', x: 300, y: 40, detail: 'Lease + backoff consumer.' },
        { id: 'wh', label: 'payout.go', kind: 'edge', x: 300, y: 200, detail: 'Settled webhook cancellation.' },
        { id: 't1', label: 'retry_test.go', kind: 'test', x: 530, y: 40, detail: 'Must stay green on cancel paths.' },
        { id: 't2', label: 'webhook_test.go', kind: 'test', x: 530, y: 200, detail: 'Idempotent settled events.' },
      ],
      edges: [
        { from: 'retry', to: 'worker' },
        { from: 'retry', to: 'wh' },
        { from: 'worker', to: 't1' },
        { from: 'wh', to: 't2' },
      ],
    },
  ],
}

export function answerFor(query: string, repo: Repo): ChatMessage {
  const q = query.toLowerCase()
  if (repo.freshness === 'indexing') {
    return {
      id: crypto.randomUUID(),
      role: 'sme',
      text: `Indexed coverage is still ${repo.coverage}%. I don’t have verified findings for “${query.trim()}” yet. I’ll keep this as a session answer only — nothing is written to shared memory until the first map lands.`,
      createdAt: timeNow(),
    }
  }

  if (q.includes('test') || q.includes('impact')) {
    return {
      id: crypto.randomUUID(),
      role: 'sme',
      text: 'Closest impact map: changing retry policy also hits `RetryWorker` and the payout webhook cancel path. Re-run `retry_test.go` and `webhook_test.go` before merge. This answer is scoped to the last indexed revision.',
      createdAt: timeNow(),
      reused: true,
      tokensSaved: 960,
      evidence: [
        { path: 'internal/settle/retry.go', symbol: 'Enqueue', lines: '41–88', revision: 'c4f21a9' },
        { path: 'internal/worker/retry_worker.go', symbol: 'Tick', lines: '112–176', revision: 'c4f21a9' },
      ],
    }
  }

  return {
    id: crypto.randomUUID(),
    role: 'sme',
    text: `Grounded against ${repo.owner}/${repo.name}@${repo.defaultBranch}. I would look up symbols first, then reuse findings if the revision still matches. No durable memory is written from this turn unless the answer is evidence-backed.`,
    createdAt: timeNow(),
    evidence: [
      { path: 'README.md', lines: '1–40', revision: repo.defaultBranch },
    ],
  }
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
