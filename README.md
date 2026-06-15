# Stuffy Frights 🧸🔦

*A first-person survival horror game where the stuffed animals are awake — and they want a hug you won't survive.*

Made with love for my son.

## The game

You're locked in a dark, creaky old house with four very large, very wrong stuffed animals.
Somewhere in the house is a **ring of old keys**. Three doors lead outside —
but the keys only fit **one** of them, and it's different every time.

Your flashlight is your shield: the stuffies hesitate in the light. But the battery
drains fast, and recharging means plugging in at a wall station — light off,
standing still, watching the darkness while the meter slowly climbs…

### The residents

| | Name | Habits |
|---|---|---|
| 🦍 | **Little Timmy** | A mint-green gorilla in a rainbow party hat. Walks on his hands. Haunts the attic. You'll hear the knuckles. |
| 👽 | **Pou** | A small tan… something, with eyes on stalks. Bounces. Lives in the basement. Small enough to follow you anywhere. |
| 🦙 | **New Yama** | A llama the size of a pony. Patrols the main floor. Fills doorways. |
| 🧶 | **Fuggie** | Teal, fuzzy, far too many human teeth. Shambles around upstairs. Sometimes he giggles. |

Get close and you'll see their faces change.

### Tips from the survivors

- **Darkness is your friend too.** They can barely see you with your light off.
- **Hide** in wardrobes, cabinets, under beds — but if one *saw* you hide, it WILL look there.
  Slip in with your light off and they'll usually miss you.
- **Crouch** (`C`) to move silently. **Sprinting is loud.**
- Pry open **vents** to crawl through walls. Drop down **floor hatches** to escape a chase.
  They stay secret — they're never on the map.
- The **map** (`M`) shows the floor you're on, hiding spots, and charging stations.
  The game does not pause while you read it. They're still coming.

## Controls

| Key | Action |
|---|---|
| Mouse | Look |
| `W A S D` | Move |
| `Shift` | Sprint (loud) |
| `C` | Crouch / crawl |
| `F` | Flashlight |
| `E` | Interact — hide, charge, grab keys, try doors |
| `M` / `Tab` | Map (game keeps running!) |
| `Esc` | Pause |

## Running it

```bash
npm install
npm run dev      # play at http://localhost:3100
```

Production build:

```bash
npm run build    # outputs dist/ — a fully static site, host it anywhere
npm run preview
```

Tests (the house layout, AI rules, battery economy, objectives — 110 of them):

```bash
npm test
```

## How it's made

TypeScript + [Three.js](https://threejs.org), no other runtime dependencies.
Every model, texture, and sound is generated procedurally in code — the four
stuffies are built from primitives and canvas-painted faces, modeled on four
real (and much friendlier) stuffed animals. Audio is synthesized WebAudio.
The house is a hand-authored 4-floor ASCII-art layout: every wall in
`src/world/houseLayout.ts` is a `#` you can read.

*No stuffed animals were harmed in the making of this game. The same cannot be guaranteed for you.*
