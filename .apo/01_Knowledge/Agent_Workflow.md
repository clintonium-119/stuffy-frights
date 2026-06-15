---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0005"
category: architecture
title: "Agent Workflow"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-13'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Agent Workflow

## Agent Roles

No project-level `CLAUDE.md`, `AGENTS.md`, or `.cursorrules` exist in this repo. **Source:** `find` over repo root (read 2026-06-12). User-global rails exist and apply:

- `~/.pi/agent/AGENTS.md` (read 2026-06-12) — delegation routing: inline for trivial edits/judgment work; `pi-fork` for multi-file refactors, hypothesis testing, large writes (>100-line new files in multi-slot mode). No fork retries on failure. Review/verify second opinions go to a different-model remote, not a local fork.
- Same file — ApoVault is the source of truth for project lifecycle; `/apo:plan`, `/apo:refine`, `/apo:execute`, `/apo:promote` are the canonical entry points for workstream-scoped work.

## Workflow Patterns

Fork spec terseness directive (from `~/.pi/agent/AGENTS.md`, read 2026-06-12): inline the structured-summary directive in every fork spec; never have a fork run `/caveman full` (it would clobber the shared config).

- **Do:** stop any long-lived background process you start during a run — most often the `npm run dev` server launched for in-browser verification — before ending the session, and confirm the port is free afterward. Start the dev server once and reuse it for the whole run rather than relaunching it per phase (`vite`'s `strictPort` means a second copy fails to start anyway), so no dangling processes are left for the user to find and kill.

> **(verify)** — project-specific workflow rails
>
> Expected answers when this section is filled:
> - [ ] Should a project-level `CLAUDE.md`/`AGENTS.md` exist with game-specific rails (asset handling, perf budgets)?
> - [ ] Playtest workflow: how do agents verify gameplay changes (verify loop at `http://localhost:3100` is configured — `.apo/.config.json`, written 2026-06-12)?
>
> Look at: team preference; first few `/apo:execute` sessions.

## Tooling

- `.claude/settings.local.json` — local Claude Code permission allowlist (`Read(//home/clintonium-119/.apo/**)`). **Source:** read 2026-06-12.
- `apo` bin at `~/.local/bin/apo` — control-plane bookkeeping (workstreams, items, ids). **Source:** `apo --help` (run 2026-06-12).
- Verify loop configured: `verify.localhostUrl = http://localhost:3100` in `.apo/.config.json` (user-confirmed during init, 2026-06-12). Fires on `/apo:execute` / `/apo:bug-fix` when ground truth (Figma ref / attachments) exists.
