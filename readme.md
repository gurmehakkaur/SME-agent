# SME — Shared Memory for Engineering

## Product vision

SME is a repository-scoped engineering knowledge hub. It helps developers and, later, coding agents understand **what the codebase currently does** and reuse relevant knowledge instead of repeatedly investigating the same things and spending tokens rediscovering them.

SME is not intended to be another general-purpose chatbot. Its purpose is to maintain useful, up-to-date context about each connected codebase.

## User experience

### Dashboard
- Show all GitHub repositories connected to the user's/team's SME workspace.
- Selecting a repository opens that repository's dedicated SME space.

### Inside a repository
Two primary areas:

1. **Chat** — developers ask questions about the repository and receive answers grounded in current code and supporting evidence.
2. **Quick Reference Resources** — visual resources that can be explored rather than read as long documents. Examples include:
   - Architecture maps: services, APIs, databases, and dependencies.
   - Execution-flow diagrams: how important operations travel through the code.
   - Change-impact maps: related components and tests that may be affected by a change.

The diagrams are generated from structured, evidence-backed information. They are not just pictures: agents should later be able to retrieve the same underlying relationships as structured context.

## Repository onboarding and synchronization

- A team connects a repository through GitHub.
- SME indexes the repository to build its initial codebase map and knowledge base.
- Each repository's data is kept scoped to that repository and its authorized team.
- SME tracks merged pull requests and updates affected knowledge and visual resources.
- Periodic checks act as a safety net to detect missed changes or stale information; they should not replace change-triggered updates.
- Questions and reusable findings should be available consistently to authorized teammates, not isolated to one developer's session.

## Internal knowledge storage

The database and memory mechanism are internal implementation details; users do not browse the raw memory store.

Use **SurrealDB Agent Memory** for persistent, shared engineering memory. Store reusable information such as:

- Evidence-backed findings about code behavior and design decisions.
- Relationships between files, symbols, services, tests, and PRs.
- PR changes and the code revision relevant to a finding.
- Freshness/provenance metadata, including links to supporting code, tests, commits, or PRs.
- Carefully scoped cached answers, tied to the relevant repository and code revision.

**Do not store raw conversations as the product's memory.** A question can lead to a durable finding only when useful and supported by evidence. Question/answer cache entries are separate from verified reusable knowledge.

The source code and current tests remain authoritative. SME memory is a context aid, not a replacement for the repository. Findings and cached answers must be rechecked or invalidated when relevant code changes.

## Token-efficiency principle

The central engineering challenge is to answer correctly while burning as few tokens as possible.

SME should reuse, retrieve, and verify existing knowledge before launching a broad investigation. Prefer direct code/symbol lookup and known relationships for precise questions; use semantic retrieval for broader questions; invoke an LLM for synthesis only when needed. Cache reuse must be scoped and invalidated when relevant source changes. Correctness and freshness must not be sacrificed just to reduce token use.

## Agent access

- First interface: a simple repository-scoped chat UI for developers.
- Planned later: an MCP server that exposes the same SME knowledge and retrieval capabilities to coding agents.
- The UI and MCP server should use the same underlying repository-scoped service and knowledge base, so developers and agents share context.

## Initial implementation direction

1. Build the dashboard for connected repositories and a basic repository chat UI.
2. Implement repository scoping and initial code indexing.
3. Integrate SurrealDB Agent Memory for reusable, evidence-backed findings.
4. Add visual quick-reference resources backed by structured code relationships.
5. Add GitHub PR-triggered updates and periodic freshness checks.
6. Add MCP access for coding agents.
7. Evaluate token savings, answer correctness, and stale-memory failures against a no-memory baseline.

This ordering is a practical starting sequence, not a claim that all features are already specified in detail.

## Development choice

Use **Cursor** as the initial development environment. Avoid adding extra tools or subscriptions until the first working version is in place.

## Principles to preserve

- Repository-scoped and permission-aware.
- Shared across authorized team members and later their coding agents.
- Visual references first-class; not just long text documentation.
- No raw conversation storage as durable memory.
- Evidence and freshness attached to reusable findings.
- PR-driven incremental updates, with periodic checks as backup.
- Token efficiency measured alongside correctness.

## Frontend (starting point)

The first interface is a **dark-mode Vite + React + TypeScript** app in `frontend/`. It is built for developers: repository dashboard, scoped chat with evidence chips, and visual quick-reference maps. Data is mocked until GitHub auth, indexing, and SurrealDB are wired.

See `frontend/README.md` for the UI plan, routes, and next slices.

## Not decided yet

The following details remain open and should be chosen during implementation rather than treated as settled decisions:

- Exact backend framework and hosting setup.
- How GitHub authentication and organization/team permissions will be implemented.
- Which language/repository to support first for code indexing.
- Exact schema for findings, diagrams, PR events, and cached answers.
- Whether the first MVP generates all diagram types or starts with one or two.
- Exact benchmark tasks and acceptance thresholds for token savings and correctness.
