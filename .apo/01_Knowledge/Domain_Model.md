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
updated: '2026-06-12'
reviewed_on: ""
related_notes: []
tags: [apovault, knowledge, architecture]
---

# Domain Model

No schemas, models, or type definitions exist — the repo is empty. **Source:** `find` over repo root, 0 source files (read 2026-06-12). The genre frame (first-person horror, "stuffy" = stuffed-animal theme implied by the project name) comes from user input to `/apo:init` (2026-06-12); the entity list below is a checklist to fill, not established fact.

## Entities

> **(verify)** — core game entities undefined
>
> Expected answers when this section is filled:
> - [ ] Player entity: what state does it carry (position, health/sanity, inventory, flashlight/battery)?
> - [ ] Enemy/"stuffy" entities: one type or several? Where do their behavior definitions live?
> - [ ] Level/scene entity: how are levels defined (GLTF scenes, JSON layouts, procedural)?
> - [ ] Interactables: doors, pickups, triggers — common interface?
> - [ ] Save/progress data: what persists, and where (localStorage, file)?
>
> Look at: `src/entities/`, `src/game/`, or TS interfaces once scaffolded.

## Relationships

> **(verify)** — no relationships defined
>
> Expected answers when this section is filled:
> - [ ] Scene ↔ entity ownership (who spawns/despawns enemies?)
> - [ ] Player ↔ inventory/item cardinality
> - [ ] AI ↔ navigation data (navmesh per level?)
>
> Look at: entity/scene modules once they exist.

## Invariants

> **(verify)** — no invariants established
>
> Expected answers when this section is filled:
> - [ ] Frame-loop invariants (fixed timestep vs variable? physics step order?)
> - [ ] State-mutation rules (who may mutate player state — input system only?)
> - [ ] Audio/visual invariants for horror pacing (e.g., enemy never spawns in player view)?
>
> Look at: game-loop module, design docs, future DEC notes.
