---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0002"
category: architecture
title: "Code Map"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Code Map

## Subsystems

| Slug | Path | Purpose | File count | Status |
|---|---|---|---|---|
| stuffy-frights | `.` (whole repo) | First-person horror game — greenfield, pre-scaffold | 0 source files | active |

Single-subsystem fallback applied: <30 source files (actually 0). **Source:** `find . -path ./.git -prune -o -path ./.apo -prune -o -type f -print` → 1 file (`.claude/settings.local.json`), read 2026-06-12. Re-run `/apo:rescan` after the base scaffold lands to split real subsystems (e.g., rendering, gameplay, audio, UI).

## Directory Structure

```
.
├── .apo/        # this vault (created 2026-06-12 by /apo:init)
├── .claude/     # settings.local.json — local permission allowlist only
└── .git/        # empty repo, branch `loop`, no commits
```

**Source:** `ls -la` repo root (read 2026-06-12).

## Key Files

- `.claude/settings.local.json` — Claude Code local permissions (allows reading `~/.apo/**`). **Source:** read 2026-06-12.
- Entry point, routing, configs: none exist yet.

> **(verify)** — key files once the scaffold lands
>
> Expected answers when this section is filled:
> - [ ] Entry point (`src/main.ts`? `index.html`?)
> - [ ] Build config path
> - [ ] Scene/level bootstrap file
>
> Look at: repo root and `src/` after the first scaffold commit.

## Module Boundaries (Vault-wide)

> **(verify)** — no modules exist
>
> Expected answers when this section is filled:
> - [ ] Does rendering code import gameplay state directly, or via an interface?
> - [ ] Are assets referenced by path constants or a manifest module?
> - [ ] Is there an ECS or scene-graph ownership rule?
>
> Look at: `src/` layout after scaffold; revisit during `/apo:rescan`.

## Module Boundaries — stuffy-frights

Same as vault-wide — single subsystem, no code. See `(verify)` above.
