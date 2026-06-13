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
updated: '2026-06-13'
reviewed_on: '2026-06-13'
related_notes: []
tags: [apovault, knowledge, standards]
---

# Coding Standards

Re-mined 2026-06-13 against the now-populated codebase (35 source + 17 test files). The empty-baseline placeholders are replaced below with observed rules.

## Lint / format (vault-wide)

No linter or formatter config exists — no `.eslintrc*`, `biome.json`, `.prettierrc*`, or `.editorconfig` (read 2026-06-13). Code style is enforced only by the TypeScript compiler. **Observed style:** 2-space indent, single quotes, semicolons, trailing-comma-friendly. If a linter is added later, record the choice with a DEC note.

`tsconfig.json` (read 2026-06-13) is the de-facto style gate: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `target/module ES2022/ESNext`, `moduleResolution: bundler`, `noEmit` (Vite does the bundling, `tsc` only type-checks).

## Naming Conventions (Observed) — vault-wide

**Scanned 2026-06-13, 52 `.ts` files.**

- **Files:** PascalCase for class-per-file modules (`Engine.ts`, `PlayerController.ts`, `HouseBuilder.ts`, …) — 30 files. camelCase for pure-data / utility / config modules (`config.ts`, `rng.ts`, `houseLayout.ts`, `layoutTypes.ts`, `main.ts`).
  - Documented exceptions: `rng.ts` exports a class (`Rng`) but is named as a utility; `Props.ts` exports functions/types but keeps PascalCase. Both intentional.
- **Tests:** co-located `*.test.ts` next to the module under test (17 files). No `__tests__/` directories.
- **Symbols:** PascalCase types/classes/interfaces; camelCase functions/vars; `SCREAMING_SNAKE` for module-level layout constants (`CELL_SIZE`, `FLOOR_SPACING`).
- **UI-primitive suffixes** (`*Dialog`, `*Modal`, `*Card`, etc.): **0 each** — not a web-app UI; the `ui/` subsystem names by role (`HUD`, `MapOverlay`, `Menus`), not primitive.

## API-Usage Patterns (Observed) — vault-wide

**Scanned 2026-06-13.** All findings are dominant/clean — no mixed newer-vs-older area, so no modernity ASK fired.

| Area | Convention | Evidence |
|---|---|---|
| Module exports | **Named exports only** — zero `export default` | 33 `export class`, 19 `export function`, 8 `export const`, 0 defaults |
| Type contracts | `interface` for data/collaborator shapes, `type` for unions/aliases | 33 `interface`, 13 `type`; 0 `enum` (string-literal unions instead) |
| Three.js import | Namespace import `import * as THREE from 'three'` everywhere | all rendering files |
| Three.js geometry | Modern `BufferGeometry`-based primitives only; no legacy `Geometry` | `BoxGeometry`, `CapsuleGeometry`, `LatheGeometry`, … |
| Class encapsulation | `private` fields default; `readonly` for immutable data; constructor-param modifiers | 136 `private`, 25 `readonly`, 0 `public` (implicit) |
| Type safety | No `any` in the codebase | grep → 0 |
| Dependency wiring | Constructor injection of collaborators; no service-locator/global lookup | universal |
| Randomness | Seeded `Rng` (mulberry32) injected into systems; `Math.random()` only for the initial seed | `core/rng.ts`, AI/objectives |

## Theme Tokens (Observed) (vault-wide)

The game's analog of a design-token module is **`src/core/config.ts`** — a single `GameConfig` interface plus an exported `config` constant. It holds every tunable number (no magic numbers in logic): `timestep`, `player.*` (speeds, eye height, stamina), `battery.*`, `ai.*` (vision/hearing ranges, speeds, grace/migration timings, anti-camp radii), `enemy.*` (threat/contact/catch distances, jumpscare timing), `visibility.*` (per-floor fog, light intensities, tone exposure), `flashlight.*` (color/intensity/range/angle/sway). Imported and read by 20+ modules. Treat it as the central tuning surface: gameplay-feel changes go here, not inline.

## Build / run commands (vault-wide)

From `package.json` (read 2026-06-13):

- `npm run dev` — Vite dev server at `http://localhost:3000` (`strictPort: true`; matches the verify-config dev URL).
- `npm run build` — `tsc --noEmit && vite build`; output to `docs/` (GitHub Pages publish dir), base path `/stuffy-frights/`.
- `npm run preview` — serve the production build.
- `npm test` — `vitest run --passWithNoTests`.

## File organization (observed) — vault-wide

Source lives under `src/`, split by subsystem directory (`core`, `player`, `world`, `systems`, `enemies`, `ai`, `ui`, `audio`) with `main.ts` as the wiring entry point. One primary export per file; tests co-located. See [[01_Knowledge/Code_Map|Code Map]] for the full layout and boundaries.

## Test conventions (observed) (vault-wide)

- **Framework:** Vitest. `describe/it/expect` imported from `'vitest'`; run headless via `vitest run`.
- **Convention:** co-located `*.test.ts` (17 files).
- **Rendering avoidance:** tests never touch WebGL. AI/collision/nav/objectives tests are math-only over plain data; enemy/brain tests use lightweight stub bodies (`{ position, group.rotation.y, setMoveTarget() }`) instead of real Three.js meshes.
- **Coverage gaps (by design):** `Props.ts` builders, `AudioEngine` synthesis, and `Menus` DOM logic have no unit tests (cost of mocking WebAudio/DOM outweighs value); they're verified in-browser instead.
