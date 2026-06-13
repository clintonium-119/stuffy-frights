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
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Code Map

## Subsystems

The empty-repo single-subsystem fallback no longer applies: 35 source + 17 test files exist (scanned 2026-06-13). Split by `src/` directory — each is a cohesive subsystem.

| Slug | Path | Purpose | Files (src/test) | Status |
|---|---|---|---|---|
| core | `src/core/` | Engine/game-loop, fixed-timestep, input, collision, central state machine, seeded RNG, tuning config | 6 / 3 | active |
| player | `src/player/` | First-person controller, flashlight beam, interaction/raycast | 3 / 2 | active |
| world | `src/world/` | ASCII-grid house layout, procedural geometry (HouseBuilder, Props), exit doors | 5 / 1 | active |
| systems | `src/systems/` | Survival systems: battery, charging stations, hiding spots, objectives, secret passages | 6 / 3 | active |
| enemies | `src/enemies/` | The four stuffies + shared base + jumpscare | 6 / 3 | active |
| ai | `src/ai/` | Director, per-enemy brain, nav graph, perception | 4 / 3 | active |
| ui | `src/ui/` | HUD, map overlay, menus | 3 / 2 | active |
| audio | `src/audio/` | WebAudio synthesis engine (no audio files) | 1 / 0 | active |

Entry point `src/main.ts` (600 lines) wires every subsystem together; it belongs to no single subsystem.

**Source:** `find src -name '*.ts'` + per-directory counts, read 2026-06-13.

## Directory Structure

```
.
├── index.html             # Vite entry HTML
├── package.json           # three ^0.165, vite ^5.2, vitest ^1.6, typescript ^5.4
├── tsconfig.json          # ES2022, strict, bundler resolution, noEmit
├── vite.config.ts         # base /stuffy-frights/, outDir docs/, dev port 3000 (strict)
├── src/
│   ├── main.ts            # bootstrap + wiring (state machine ↔ systems ↔ UI ↔ audio)
│   ├── core/              # Engine, Input, Collision, GameState, config, rng
│   ├── player/            # PlayerController, Flashlight, Interaction
│   ├── world/             # houseLayout, layoutTypes, HouseBuilder, Props, ExitDoor
│   ├── systems/           # Battery, Charging, ChargingStation, HidingSpot, Objectives, SecretPassage
│   ├── enemies/           # EnemyBase, Charles, Poo, NewYama, Fuggie, Jumpscare
│   ├── ai/                # Director, EnemyBrain, NavGraph, Perception
│   ├── ui/                # HUD, MapOverlay, Menus
│   └── audio/             # AudioEngine
├── docs/                  # Vite build output (GitHub Pages publish dir)
├── .apo/                  # this vault
└── .claude/               # settings.local.json — local permission allowlist
```

**Source:** repo tree + configs, read 2026-06-13.

## Key Files

- `src/main.ts` — entry point and the **single wiring site**. Creates the Engine, parses the house, instantiates systems/enemies/AI/UI/audio, and connects them via callbacks. Also hosts the dev scenario harness (`?scenario=win|death`).
- `src/core/Engine.ts` — owns `WebGLRenderer`, `Scene`, `PerspectiveCamera`, and an `Updatable[]` list; drives the fixed-timestep loop.
- `src/core/config.ts` — centralized tuning constants (the project's "design-system tokens"); see [[01_Knowledge/Coding_Standards|Coding Standards]].
- `src/core/GameState.ts` — finite state machine (menu → playing → mapOpen/paused/caught → gameOver/won).
- `src/world/houseLayout.ts` — parses the ASCII house grid into a `House`; the single source of truth that drives geometry, nav graph, objective placement, and the map.
- `vite.config.ts` / `tsconfig.json` — build + type config.

## Module Boundaries (Vault-wide)

- **Game-loop ownership:** `core/Engine` owns the renderer/scene/camera and the `Updatable[]` list. `main.ts` registers one orchestrating updatable that ticks player → AI → systems → world each fixed step.
- **State sharing:** the `House` (parsed once) is passed into `NavGraph`, `Director`, `Objectives`, `HouseBuilder` as a **constructor argument**, not a global. `config` and `house` are the only module-level singletons; both are read-only.
- **Rendering vs gameplay:** gameplay modules never import `GameState`. The state machine lives in `main.ts`, which wires UI (`HUD`, `Menus`, `MapOverlay`) to it. Systems communicate outward through `on*` callbacks (`onEnter`, `onMessage`, …); `main.ts` subscribes and reacts.
- **UI/audio are leaves:** no gameplay module imports `ui/` or `audio/`. They only listen. `AudioEngine` is fully decoupled (WebAudio synthesis, no `GameState` import).
- **Assets:** there is no asset manifest and no asset files. All geometry is procedural (Three.js builder functions), all textures are runtime `CanvasTexture`, all audio is WebAudio synthesis. The ASCII house grid is the closest thing to a content manifest.

## Module Boundaries — per subsystem

- **core** → depended on by everything; depends on nothing else in `src/`.
- **player / systems / enemies / ai** → import `core` (config, rng, collision) and `world` data; expose callbacks consumed by `main.ts`.
- **ui** → reads `GameState` (via `main.ts` wiring) and snapshots; renders DOM + canvas overlays. No reverse dependency.
- **audio** → standalone leaf; invoked through callbacks only.
