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
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, architecture]
---

# System Overview

## Purpose

Stuffy Frights is a first-person survival-horror browser game: the player is locked in a dark house with four oversized, hostile stuffed animals, must find the one ring of keys that fits one of three exit doors (randomized per run), and escape — while a flashlight (the only deterrent) drains and must be recharged at wall stations. **Source:** `README.md` + `package.json` description (read 2026-06-13).

## High-Level Architecture

Single-page Three.js/WebGL application, no backend. **Confirmed during /apo:init on 2026-06-12** (engine ASK gate; web/Three.js chosen over Godot/Unity/Unreal) and verified against the code 2026-06-13.

- **Language/build:** TypeScript (ES2022, `strict`), bundled by Vite; types checked by `tsc --noEmit`. Tests via Vitest.
- **Three.js style:** raw Three.js (`import * as THREE`), no framework layer (no react-three-fiber/A-Frame). Custom lightweight loop, not an off-the-shelf ECS.
- **Game loop:** `core/Engine` owns the `WebGLRenderer`/`Scene`/`PerspectiveCamera` and an `Updatable[]` list, driven at a fixed timestep (`config.timestep`, 1/60 s).
- **State:** a finite state machine (`core/GameState`) in `main.ts` (menu → playing → mapOpen/paused/caught → gameOver/won). Gameplay data flows through plain objects and `on*` callbacks rather than a global store.
- **Assets:** fully procedural — geometry built in code, textures as runtime `CanvasTexture`, audio as WebAudio synthesis. No external asset files, no loaders.

See [[01_Knowledge/Code_Map|Code Map]] for the subsystem split and module boundaries.

## Key Components

- **core** — Engine/loop, Input, Collision, GameState machine, seeded `Rng`, central `config`.
- **player** — first-person `PlayerController`, `Flashlight` (the deterrent + battery), `Interaction` raycasting.
- **world** — ASCII house grid (`houseLayout`/`layoutTypes`) parsed into a `House`, turned into geometry by `HouseBuilder` + `Props`; `ExitDoor`s.
- **systems** — survival loop: `Battery`/`Charging`/`ChargingStation`, `HidingSpot`, `Objectives` (key/door placement), `SecretPassage`.
- **enemies** — `EnemyBase` + the four stuffies (`Charles`/"Little Timmy", `Poo`/"Pou", `NewYama`/"New Yama", `Fuggie`) and the `Jumpscare`.
- **ai** — `Director` (orchestrates threat/migration), per-enemy `EnemyBrain`, `NavGraph` (pathing over the house), `Perception` (vision/hearing vs the flashlight).
- **ui** — `HUD`, `MapOverlay`, `Menus`.
- **audio** — `AudioEngine`, WebAudio synthesis (ambient bed, positional one-shots, tension layers, jumpscare sting).

## Technology Stack

- **Rendering/engine:** Three.js `^0.165` / WebGL (`@types/three` `^0.165`). PBR `MeshStandardMaterial`, soft shadow mapping, ACES tone mapping, `FogExp2` per floor.
- **Language:** TypeScript `^5.4`, ES2022 target, `strict`.
- **Build/dev:** Vite `^5.2` (dev server port 3100 strict; production build → `docs/`, base `/stuffy-frights/`).
- **Testing:** Vitest `^1.6`, headless, co-located `*.test.ts`.
- **Audio:** Web Audio API (synthesis only, no audio files).
- **Persistence/network:** none — fully client-side.

**Source:** `package.json`, `tsconfig.json`, `vite.config.ts`, source scan (read 2026-06-13).
