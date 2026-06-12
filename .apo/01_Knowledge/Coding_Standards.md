---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0006"
category: standards
title: "Coding Standards"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, standards]
---

# Coding Standards

The repo has 0 source files (**Source:** `find . -path ./.git -prune -o -path ./.apo -prune -o -type f -print` → only `.claude/settings.local.json`, read 2026-06-12), so every "Observed" section below records the empty baseline. Re-run `/apo:rescan stuffy-frights` after the base scaffold lands — that scan becomes the real rails.

## Lint / format (vault-wide)

No `.eslintrc*`, `biome.json`, `.prettierrc*`, or `.editorconfig` exists (read 2026-06-12).

> **(verify)** — lint/format stack to be chosen at scaffold time
>
> Expected answers when this section is filled:
> - [ ] Linter (ESLint flat config? Biome?)
> - [ ] Formatter + indent/quote style
> - [ ] TS strictness flags
>
> Look at: scaffold-phase decision notes; config files once created.

## Theme Tokens (Observed) (vault-wide)

No token system detected — no theme module, Tailwind config, token JSON, CSS custom properties, or SCSS variables exist (repo empty, read 2026-06-12). For a Three.js game, the analogous concern is a centralized palette/material/lighting constants module — flag its location here when it appears.

## Build / run commands (vault-wide)

None — no `package.json` or Makefile exists (read 2026-06-12). Verify config expects a dev server at `http://localhost:3000` (`.apo/.config.json`, user-confirmed 2026-06-12), so the scaffold's dev script should serve there.

## Naming Conventions (Observed) — stuffy-frights

**Subsystem path:** `.` (whole repo) — scanned 2026-06-12, 0 source files.

- All UI-primitive suffix counts (`*Dialog`, `*Modal`, `*Card`, `*Form`, `*Section`, `*Drawer`, `*Panel`, `*Page`, `*View`, `*Sheet`, `*Popover`, `*Tooltip`): 0 each — nothing exists to count.
- **Patterns NOT present:** all of the above (0 each). The first scaffold commit sets the precedent; record it via `/apo:rescan`.
- Test file suffix, hook prefix, module naming: no occurrences (0 files).

## API-Usage Patterns (Observed) — stuffy-frights

**Subsystem path:** `.` (whole repo) — scanned 2026-06-12, 0 source files.

| Area | Newer | Older | Verdict |
|---|---|---|---|
| _none scannable_ | — | — | No code exists; no modern-vs-legacy split possible. First scaffold defines the baseline. |

## File organization (observed) — stuffy-frights

Nothing beyond `.git/`, `.apo/`, `.claude/` (read 2026-06-12). No organization to observe.

## Test conventions (observed) (vault-wide)

No test framework, test files, or test config exist (read 2026-06-12).

> **(verify)** — test stack to be chosen at scaffold time
>
> Expected answers when this section is filled:
> - [ ] Framework (Vitest is the usual pairing with a Vite/Three.js stack — confirm)
> - [ ] File convention (`*.test.ts` vs `__tests__/`)
> - [ ] How game-loop/rendering code gets tested (headless? mocked WebGL?)
>
> Look at: first test file committed.
