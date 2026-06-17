import { CellPos, House, isWalkable } from './layoutTypes';
import { edgeBetween, blocksMovement } from './edges';
import { buildMansion } from './mansion/index';
import { validateMansion } from './authoring/validate';

/**
 * The live house. The hand-authored gothic mansion (`mansion/`) is the single
 * source of truth: geometry building, the nav graph, the map overlay, and
 * objective placement all consume the `House` it assembles. Grid characters and
 * the legacy 2 m ASCII source are gone — walls live on cell edges and rooms are
 * authored declaratively (see `authoring/build.ts`).
 */

export interface Neighbor {
  pos: CellPos;
  /** True when the edge is a crawl passage (vent) or chute drop. */
  viaPassage: boolean;
  /** True for chute edges (one-way; reverse traversal impossible). */
  viaChute: boolean;
}

/**
 * Adjacency used by both the reachability tests and the nav graph.
 * Same-floor 4-neighbors over walkable cells, stair-run edges between
 * floors, and one-way chute edges. Vent cells are ordinary walkable cells
 * (their edges are marked viaPassage so AI queries can exclude them).
 */
export function neighbors(house: House, pos: CellPos): Neighbor[] {
  const out: Neighbor[] = [];
  const grid = house.grids[pos.floor];
  const deltas = [
    { dx: 1, dz: 0 },
    { dx: -1, dz: 0 },
    { dx: 0, dz: 1 },
    { dx: 0, dz: -1 },
  ];
  for (const { dx, dz } of deltas) {
    const x = pos.x + dx;
    const z = pos.z + dz;
    if (x < 0 || z < 0 || x >= house.width || z >= house.depth) continue;
    const kind = grid[z][x];
    if (!isWalkable(kind)) continue;
    // Edge-aware adjacency: two cells connect only when the shared edge passes
    // (a `none` or open `door` edge). A `wall` edge or an undiscovered `secret`
    // edge blocks — so thin authored walls separate rooms without a wall cell.
    if (blocksMovement(edgeBetween(house, pos.floor, pos, { x, z }))) continue;
    const viaPassage = kind === 'vent' || grid[pos.z][pos.x] === 'vent';
    out.push({ pos: { floor: pos.floor, x, z }, viaPassage, viaChute: false });
  }

  // Stair runs connect the low-end cell on the lower floor with the
  // high-end cell on the upper floor (the run itself is the edge).
  for (const stair of house.stairs) {
    const low = stair.cells[0];
    const high = stair.cells[stair.cells.length - 1];
    if (pos.floor === stair.lower && pos.x === low.x && pos.z === low.z) {
      out.push({
        pos: { floor: stair.upper, x: high.x, z: high.z },
        viaPassage: false,
        viaChute: false,
      });
    }
    if (pos.floor === stair.upper && pos.x === high.x && pos.z === high.z) {
      out.push({
        pos: { floor: stair.lower, x: low.x, z: low.z },
        viaPassage: false,
        viaChute: false,
      });
    }
    // Intermediate stair cells also connect within the run on both floors.
    for (let i = 0; i < stair.cells.length - 1; i++) {
      for (const fl of [stair.lower, stair.upper]) {
        const a = stair.cells[i];
        const b = stair.cells[i + 1];
        if (pos.floor === fl && pos.x === a.x && pos.z === a.z) {
          out.push({ pos: { floor: fl, x: b.x, z: b.z }, viaPassage: false, viaChute: false });
        }
        if (pos.floor === fl && pos.x === b.x && pos.z === b.z) {
          out.push({ pos: { floor: fl, x: a.x, z: a.z }, viaPassage: false, viaChute: false });
        }
      }
    }
  }

  for (const chute of house.chutes) {
    if (pos.floor === chute.from.floor && pos.x === chute.from.x && pos.z === chute.from.z) {
      out.push({ pos: { ...chute.to }, viaPassage: true, viaChute: true });
    }
  }

  // Never step onto an over-the-void stair cell — only the run entrance/landing
  // are walkable, joined by the run edge. This is what stops an enemy crossing a
  // stairwell opening horizontally instead of taking the stairs.
  return out.filter(
    (n) => !house.navBlockedStairCells.has(`${n.pos.floor}:${n.pos.x},${n.pos.z}`)
  );
}

export const house: House = buildMansion();

// Fail fast in dev if the authored mansion ever drifts out of spec (connectivity,
// enclosure, vertical alignment). Stripped from production builds.
if (import.meta.hot) {
  const errors = validateMansion(house);
  if (errors.length) {
    console.error('[mansion] validation failed:', errors);
  }
}
