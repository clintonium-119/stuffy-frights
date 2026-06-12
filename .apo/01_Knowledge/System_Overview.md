---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0001"
category: architecture
title: "System Overview"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, architecture]
---

# System Overview

## Purpose

Stuffy Frights is a first-person horror video game, initialized as a greenfield project. **Source:** user input to `/apo:init` (2026-06-12): "base init scaffold for new stuffy frights first person horror video game." No README exists yet to refine this further. **Source:** `find . -path ./.git -prune -o -path ./.apo -prune -o -type f -print` returned only `.claude/settings.local.json` (read 2026-06-12).

## High-Level Architecture

Intended target: web (browser-based), built on Three.js/WebGL. **Confirmed during /apo:init on 2026-06-12** (engine ASK gate — user selected "Web (Three.js/WebGL)" over Godot/Unity/Unreal). No code exists yet to verify against.

> **(verify)** — concrete architecture once scaffolded
>
> Expected answers when this section is filled:
> - [ ] Build tool / bundler (Vite? esbuild? other?) and dev-server port (verify config expects `http://localhost:3000` — `.apo/.config.json`, written 2026-06-12)
> - [ ] Language: TypeScript or JavaScript?
> - [ ] Three.js usage style: raw Three.js, or a framework layer (react-three-fiber, A-Frame, custom ECS)?
> - [ ] Where game state lives (ECS, plain modules, state library)?
> - [ ] Asset pipeline (GLTF models, texture compression, audio formats)
>
> Look at: `package.json`, `vite.config.*` / build config, `src/` entry point — once they exist.

## Key Components

None yet — the repo has no source directories. **Source:** `ls -la` repo root shows only `.git/`, `.apo/`, `.claude/` (read 2026-06-12).

## Technology Stack

- **Rendering/engine (intended):** Three.js / WebGL. **Confirmed during /apo:init on 2026-06-12.** Not yet present in any manifest — no `package.json` exists (read 2026-06-12).
- **Runtime, framework, testing, build tool:** _(see (verify) block above — nothing installed yet)_
