# SME frontend

Dark-mode starting UI for **Shared Memory for Engineering**. The audience is developers: dense, keyboard-aware, evidence-first — not a consumer chatbot.

## Plan

### Stack

- Vite + React + TypeScript for a fast local loop with no extra subscriptions.
- Tailwind CSS for a consistent dark system (`ink` / `panel` / `mint`).
- React Router for workspace → repository spaces.
- Mock repository, chat, and map data until indexing and SurrealDB exist.

### Information architecture

| Route | Purpose |
| --- | --- |
| `/` | Workspace dashboard of connected GitHub repositories |
| `/r/:repoId` | Repository-scoped SME space |

Inside a repository:

1. **Chat** — questions about *this* codebase. Answers show evidence (`path`, symbol, lines, revision) and cache-reuse / token savings when a finding is reused. Raw threads are not treated as memory.
2. **Quick reference** — architecture, execution, and change-impact maps from structured relationships. Nodes are selectable; later they bind to the same graph agents will retrieve over MCP.

### Design principles

- Dark-first, IDE density, IBM Plex Sans + Mono.
- Freshness is visible (`fresh` / `aging` / `stale` / `indexing`).
- Connect-repo is an explicit stub until GitHub OAuth exists.
- `/` focuses repo filter; `⌘/Ctrl + Enter` sends chat.

### What is intentionally fake

GitHub connect, live indexing, SurrealDB reads/writes, and real retrieval. The UI is the contract those services should fill.

### Next frontend slices

1. Replace mocks with a thin repo-scoped API.
2. Stream index/job status on the dashboard and repo header.
3. Bind map nodes to findings and file deep-links.
4. Add MCP connection status in the rail once the server exists.

## Scripts

```bash
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)
