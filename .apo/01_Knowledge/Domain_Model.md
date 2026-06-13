---
note_type: knowledge
template_version: 1
contract_version: 1
knowledge_id: "KNOW-0003"
category: architecture
title: "Domain Model"
status: in_progress
owner: ""
created: '2026-06-12'
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Domain Model

Mined 2026-06-13 from the TypeScript source (no DB/schema — domain types are TS interfaces/classes). The "stuffy" theme is literal: the antagonists are stuffed animals.

## Entities

- **Player** — first-person actor (`player/PlayerController`). Carries position/orientation, movement mode (walk/sprint/crawl) and **stamina**, an eye-height camera, a held **flashlight** with a **battery** charge level, and whether keys are collected. State lives in the controller + systems, not a global blob.
- **Flashlight / Battery** — the core survival resource. The beam (`SpotLight`) is the only enemy deterrent; battery drains while on and recharges only at a `ChargingStation` (light off, standing still). Tuning in `config.flashlight` / `config.battery`.
- **Enemies (the four stuffies)** — share `enemies/EnemyBase`; each subclass defines appearance + gait:
  - `Charles` — displayed in-game as **"Little Timmy"** (mint gorilla, walks on hands, attic).
  - `Poo` — displayed as **"Pou"** (tan blob alien, bounces, basement).
  - `NewYama` — **"New Yama"** (large llama, main floor).
  - `Fuggie` — **"Fuggie"** (teal fuggler, upstairs).
  - Class name ≠ display name for Charles/Poo — display strings are deliberately remapped (a `refine`-workstream rename). Keep that split in mind when grepping.
- **House** — parsed once from an ASCII grid (`world/houseLayout`) into a `House` of cells across floors (`layoutTypes`: `CellKind`, `CELL_SIZE`, `FLOOR_SPACING`). Single source of truth for geometry, nav graph, objective placement, and the map.
- **Interactables** — `ExitDoor` (three, one openable per run), `ChargingStation`, `HidingSpot`, `SecretPassage`. Surfaced to the player through `player/Interaction` raycasts.
- **Objectives** — `systems/Objectives` places the key ring and selects which exit door it opens, seeded per run.
- **Director / Brains** — `ai/Director` is the run-level antagonist orchestrator (threat escalation, enemy migration between floors, anti-camping); each enemy has an `EnemyBrain` over the `NavGraph` using `Perception`.

## Relationships

- **House 1—N cells/floors**; the parsed `House` is injected (constructor arg) into `NavGraph`, `Director`, `Objectives`, `HouseBuilder`.
- **Director 1—N enemy brains**; the Director spawns/migrates enemies; brains path over the shared `NavGraph`.
- **Player 1—1 flashlight/battery**; 1—1 stamina; 0—1 active hiding spot; 0—N keys (a single ring).
- **Objectives → ExitDoors:** exactly one door is the valid exit per seed; the others are decoys.
- **Perception couples enemies → player via the flashlight:** detection depends on beam state (light off ≈ near-invisible), not just proximity.

## Invariants

- **Fixed timestep.** Simulation advances at `config.timestep` (1/60 s); rendering is decoupled from the sim step. Update order is player → AI → systems → world, orchestrated from `main.ts`.
- **Determinism.** All gameplay randomness comes from the injected seeded `Rng` (mulberry32); `Math.random()` is used only to pick the initial seed. The dev harness replays deterministic `?scenario=win|death` runs.
- **Single tuning surface.** Gameplay-feel constants live only in `config.ts`; no magic numbers in logic.
- **Procedural-only content.** No runtime asset loading; all geometry/textures/audio are generated in code.
- **Decoupling.** Gameplay never imports `ui/` or `audio/`; those react via callbacks. The valid exit door is fixed at run start (objective seed) and does not change mid-run.
