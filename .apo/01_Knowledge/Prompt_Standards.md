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
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, standards]
---

# Prompt Standards

## Project rails

No project-level `CLAUDE.md` / `AGENTS.md` exists (read 2026-06-12). User-global `~/.pi/agent/AGENTS.md` rails apply — see [[01_Knowledge/Agent_Workflow|Agent Workflow]].

> **(verify)** — populate after first /apo:plan dogfood
>
> Expected answers when this section is filled:
> - [ ] Game-specific prompting rails (e.g., perf budget per frame, asset-size limits)
> - [ ] Whether plans must include a playable-verification step
>
> Look at: first `/apo:plan` + `/apo:execute` sessions on this project.

## Vault-artifact citations in generated content

- **Do not** embed vault IDs (`DEC-NNNN`, `OBS-NNNN`, `PHASE-NN`, `STEP-NN-NN`, `SESSION-*`) or `02_Work/**` / `01_Knowledge/_pending/**` / `01_Knowledge/_archive/**` wikilinks in code comments, test titles, runtime strings, or `01_Knowledge/*` rail bodies.
- **Do** keep vault IDs in their structural homes: file names, frontmatter, and `02_Work/**` cross-refs.
- Domain item IDs (`TASK-NNNN` / `BUG-NNNN`) referenced as kanban items are allowed.
- Enforced by `/apo:lint` (check for vault-artifact citations).

## Engine / stack direction (user-confirmed)

- **Do** target the web: Three.js/WebGL for rendering. **Confirmed during /apo:init on 2026-06-12** (engine ASK gate; chosen over Godot/Unity/Unreal).
- **Do not** introduce a second rendering stack without a DEC note.

## Modernity preferences (user-confirmed)

_Omitted — the repo had 0 source files at init, so no API area had competing approaches. First populated by `/apo:rescan` after real code exists._

## Theme tokens

No centralized token system exists (repo empty, read 2026-06-12). When a palette/material-constants module appears, record its shape in [[01_Knowledge/Coding_Standards|Coding Standards]] and add the do-not-invent-tokens rail here.
