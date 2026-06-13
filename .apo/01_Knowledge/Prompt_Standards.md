---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0007"
category: standards
title: "Prompt Standards"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, standards]
---

# Prompt Standards

## Project rails

No project-level `CLAUDE.md` / `AGENTS.md` exists (read 2026-06-13). User-global `~/.pi/agent/AGENTS.md` rails apply — see [[01_Knowledge/Agent_Workflow|Agent Workflow]].

**Observed working rails** (from the `loop` + `refine` workstreams):

- **Playable verification is expected.** Every gameplay/visual change is validated in-browser via chrome-devtools against `npm run dev` (`http://localhost:3000/stuffy-frights/`) before a phase is considered done — not just unit tests.
- **No new asset files.** The game is 100% procedural: geometry built in code, textures as runtime `CanvasTexture`, audio as WebAudio synthesis. Do not introduce binary mesh/texture/audio assets without a DEC note.
- **Tuning goes through `src/core/config.ts`**, not inline magic numbers. Balance values are explicitly playtest-tunable knobs.
- **Determinism:** use the injected seeded `Rng`, never `Math.random()` in gameplay logic.

## Vault-artifact citations in generated content

- **Do not** embed vault IDs (`DEC-NNNN`, `OBS-NNNN`, `PHASE-NN`, `STEP-NN-NN`, `SESSION-*`) or `02_Work/**` / `01_Knowledge/_pending/**` / `01_Knowledge/_archive/**` wikilinks in code comments, test titles, runtime strings, or `01_Knowledge/*` rail bodies.
- **Do** keep vault IDs in their structural homes: file names, frontmatter, and `02_Work/**` cross-refs.
- Domain item IDs (`TASK-NNNN` / `BUG-NNNN`) referenced as kanban items are allowed.
- Enforced by `/apo:lint` (check for vault-artifact citations).

## Engine / stack direction (user-confirmed)

- **Do** target the web: Three.js/WebGL for rendering. **Confirmed during /apo:init on 2026-06-12** (engine ASK gate; chosen over Godot/Unity/Unreal).
- **Do not** introduce a second rendering stack without a DEC note.

## Modernity preferences (observed 2026-06-13)

No mixed newer-vs-older API area exists — the codebase is consistently modern, so these are "stay on the established path" rails, not tie-breakers:

- **TypeScript, strict.** No `any`; `interface` for shapes, `type` for unions, string-literal unions over `enum`.
- **Named exports only** — never add `export default`.
- **Three.js:** namespace import (`import * as THREE`); modern `BufferGeometry` primitives only — no deprecated `Geometry`/legacy APIs.
- **Constructor injection** for collaborators; avoid new global singletons (only `config` and the parsed `house` are module-level).

## Theme tokens

The centralized tuning module is **`src/core/config.ts`** (`GameConfig` + `config`). Do not invent new magic numbers in gameplay code — read from `config`, and add a new field there if a tunable is missing. Shape documented in [[01_Knowledge/Coding_Standards|Coding Standards]] § Theme Tokens.
