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
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Integration Map

## External Services

None at runtime — fully client-side WebGL game. No network code, no `.env*`, no API clients, no telemetry/analytics (source scan, read 2026-06-13). This is the intended steady state for the game itself.

- **Target:** GitHub Pages, project-pages URL (base `/stuffy-frights/`). **Source:** `vite.config.ts`, `.github/workflows/deploy.yml` (read 2026-06-13).
- **CI:** `.github/workflows/deploy.yml` runs on push to `main` (and `workflow_dispatch`): `npm ci` → `npm run build` → `upload-pages-artifact` → `deploy-pages`, on Node 22, with `pages: write` / `id-token: write` permissions and a `pages` concurrency group.
- **Build:** `npm run build` = `tsc --noEmit && vite build`.
- **⚠️ Output-dir mismatch (open discrepancy, 2026-06-13):** `vite.config.ts` sets `build.outDir: 'docs'`, but the workflow uploads `path: dist`. The Pages artifact would be empty/stale since Vite writes to `docs/`, not `dist/`. One of the two must change (align the workflow to `docs`, or set `outDir: 'dist'`). Flagged here, not silently reconciled — confirm intended publish dir before fixing.

## Internal APIs

None — no server, routing, or RPC. All "APIs" are in-process TypeScript module boundaries wired in `src/main.ts`; see [[01_Knowledge/Code_Map|Code Map]] § Module Boundaries.

## Data Flow

- **Input → state → render:** `core/Input` captures keyboard/mouse/pointer-lock; `main.ts` feeds it to the `PlayerController`; the `Engine` fixed-step loop ticks player → AI → systems → world, then renders. The `GameState` machine gates which updates run (e.g., paused/menu freeze the sim).
- **Systems → UI/audio (one-way):** gameplay systems emit `on*` callbacks; `main.ts` routes them to `HUD`/`Menus`/`MapOverlay` and `AudioEngine`. UI/audio never call back into gameplay.
- **Content load:** no async asset lifecycle — the ASCII house grid is parsed at startup and all geometry/textures/audio are generated procedurally in memory. Effectively zero preload latency beyond bundle download.
- **Persistence:** none observed (no `localStorage`/save system as of 2026-06-13); each run starts fresh with a new seed.
