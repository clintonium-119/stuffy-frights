---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0004"
category: architecture
title: "Integration Map"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Integration Map

## External Services

None detected — no `package.json`, no `.env*`, no network code exists. **Source:** `find` over repo root, 0 source files (read 2026-06-12). A client-side WebGL game may legitimately stay at zero external services.

> **(verify)** — confirm intended integrations
>
> Expected answers when this section is filled:
> - [ ] Hosting/deploy target (GitHub Pages, itch.io, Netlify/Vercel)?
> - [ ] Analytics or telemetry (or deliberately none)?
> - [ ] CDN-hosted assets vs bundled?
>
> Look at: deploy config / CI workflows once added.

## Internal APIs

None — no routing or server code exists (read 2026-06-12).

## Data Flow

> **(verify)** — no data flow to characterize yet
>
> Expected answers when this section is filled:
> - [ ] Input → game state → render loop wiring
> - [ ] Asset load lifecycle (preload vs lazy)
>
> Look at: entry point + game loop once scaffolded.
