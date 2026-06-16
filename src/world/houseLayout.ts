import {
  CELL_SIZE,
  CellKind,
  CellPos,
  EnemyId,
  FloorIndex,
  HidingKind,
  House,
  isWalkable,
} from './layoutTypes';
import { legacyGridToEdges, computeRoomIds } from './edges';

/**
 * The legacy ASCII grids were authored at a 2 m pitch (one cell ≈ a 2 m tile).
 * The engine now runs on a finer pitch (`CELL_SIZE`, 0.5 m), so each authored
 * cell is upscaled into an `UPSCALE`×`UPSCALE` block of engine cells, preserving
 * the house's physical size and every world coordinate. Walls stay as
 * (now-block-thick) non-walkable cells; `legacyGridToEdges` turns the
 * floor/wall block boundaries into wall edges. A genuinely thin-walled mansion
 * is authored directly at the engine pitch later — this only keeps the legacy
 * house playable through the transition. When the pitch equals the authoring
 * pitch the factor is 1 (no upscale).
 */
const LEGACY_CELL_SIZE = 2;
/** Engine cells per authored cell along each axis (4 at a 0.5 m pitch). */
export const UPSCALE = Math.max(1, Math.round(LEGACY_CELL_SIZE / CELL_SIZE));

const blockCenter = (n: number, f: number): number => n * f + (f >> 1);

function scaleCell<T extends { x: number; z: number }>(c: T, f: number): T {
  return { ...c, x: blockCenter(c.x, f), z: blockCenter(c.z, f) };
}

/**
 * Expand an axis-aligned run of adjacent cells onto the finer grid: each authored
 * cell maps to its block center, and the cells between consecutive centers are
 * filled so the run stays a connected path at the new pitch (a 3-cell stair at
 * 2 m becomes a longer connected run of 0.5 m cells over the same span).
 */
function scaleRun(cells: { x: number; z: number }[], f: number): { x: number; z: number }[] {
  if (cells.length === 0) return [];
  const centers = cells.map((c) => ({ x: blockCenter(c.x, f), z: blockCenter(c.z, f) }));
  const out = [{ ...centers[0] }];
  for (let i = 1; i < centers.length; i++) {
    const a = centers[i - 1];
    const b = centers[i];
    const dx = Math.sign(b.x - a.x);
    const dz = Math.sign(b.z - a.z);
    let cur = { ...a };
    while (cur.x !== b.x || cur.z !== b.z) {
      cur = { x: cur.x + dx, z: cur.z + dz };
      out.push(cur);
    }
  }
  return out;
}

/**
 * Reinterpret the authored house at the engine pitch: every cell becomes an
 * `f`×`f` block of the same kind and all cell-coordinate tables are rescaled, so
 * world positions are unchanged. Mutates `h`. Edges, room ids and the
 * nav-blocked stair set are derived afterwards from the upscaled grids.
 */
function upscaleHouse(h: House, f: number): void {
  h.grids = h.grids.map((grid) => {
    const ng: CellKind[][] = [];
    for (let z = 0; z < h.depth * f; z++) {
      const src = grid[Math.floor(z / f)];
      const row: CellKind[] = [];
      for (let x = 0; x < h.width * f; x++) row.push(src[Math.floor(x / f)]);
      ng.push(row);
    }
    return ng;
  });
  h.width *= f;
  h.depth *= f;
  h.playerSpawn = scaleCell(h.playerSpawn, f);
  h.playerSpawns = h.playerSpawns.map((p) => scaleCell(p, f));
  h.enemySpawns = h.enemySpawns.map((e) => ({ ...e, pos: scaleCell(e.pos, f) }));
  h.hidingSpots = h.hidingSpots.map((s) => ({ ...s, pos: scaleCell(s.pos, f) }));
  h.chargingStations = h.chargingStations.map((c) => scaleCell(c, f));
  h.keyCandidates = h.keyCandidates.map((c) => scaleCell(c, f));
  h.exits = h.exits.map((e) => ({ ...e, pos: scaleCell(e.pos, f) }));
  h.stairs = h.stairs.map((s) => ({ ...s, cells: scaleRun(s.cells, f) }));
  h.vents = h.vents.map((v) => ({ ...v, cells: scaleRun(v.cells, f) }));
  h.chutes = h.chutes.map((c) => ({ from: scaleCell(c.from, f), to: scaleCell(c.to, f) }));
}

/**
 * The house. 4 floors, 15×15 cells, hand-authored. Rooms are banded by
 * wall lines at columns 5/9 and rows 4/8 with deliberate loops so chases
 * have escape routes. See layoutTypes.ts for the character legend.
 */

const BASEMENT = [
  '###############',
  '#..H.#.K.#..C.#',
  '#....v...+....#',
  '#....v...#....#',
  '##+####+####+##',
  '#....#...#....#',
  '#.E..#SSS+...K#',
  '#....#...#V...#',
  '##+#########+##',
  '#....#H..#.K..#',
  '#.##.+...+.##.#',
  '#....#...#....#',
  '#C...#...#..H.#',
  '#..K.#...#....#',
  '###############',
];

const MAIN = [
  '###############',
  '#H...#.B.#....#',
  '#.P..+...+.PK.#',
  '#....#...#.E..#',
  '##+####+####+##',
  '#C...v...#...D#',
  '#....vSSS+....#',
  '#....#...#V...#',
  '##+####+####+##',
  '#...H#.K.#H...#',
  '#....#...#....#',
  '#S...+.P.+....#',
  '#S.K.#...#..P.#',
  '#S...#.A.#...C#',
  '###############',
];

const UPSTAIRS = [
  '###############',
  '#H...#...#...H#',
  '#....+...+..K.#',
  '#..E.#...#.K..#',
  '##v####.###vv##',
  '#....#...#....#',
  '#C...+...+...H#',
  '#....#...#..K.#',
  '##+####.####+##',
  '#....#...#....#',
  '#.H..+...+..H.#',
  '#S...#...#..S.#',
  '#S...#...#..S.#',
  '#S..K#...#..S.#',
  '###############',
];

const ATTIC = [
  '###############',
  '#.............#',
  '#..V......K...#',
  '#.....vv......#',
  '#..#......#...#',
  '#..#..E...#.H.#',
  '#.............#',
  '#....##..#....#',
  '#C....K.......#',
  '#......#......#',
  '#..#...#...#..#',
  '#..#.K.....#S.#',
  '#..........#S.#',
  '#H.........#S.#',
  '###############',
];

const FLOOR_SOURCES = [BASEMENT, MAIN, UPSTAIRS, ATTIC];

/** Hiding-spot kinds keyed by "floor:x,z". */
const HIDING_KINDS: Record<string, HidingKind> = {
  '0:3,1': 'boxFort', // basement workshop crates
  '0:6,9': 'cabinet', // basement under-shelf
  '0:12,12': 'boxFort', // basement storage crates
  '1:1,1': 'cabinet', // kitchen cabinet
  '1:4,9': 'closet', // living-room hallway closet
  '1:10,9': 'closet', // study hallway closet
  '2:1,1': 'wardrobe', // kid bedroom wardrobe
  '2:13,1': 'wardrobe', // master wardrobe
  '2:13,6': 'closet', // bedroom2 hallway closet
  '2:2,10': 'underBed', // bedroom3 under-bed
  '2:12,10': 'boxFort', // playroom toy chest
  '3:12,5': 'boxFort', // attic box fort
  '3:1,13': 'boxFort', // attic corner boxes
};

/** Enemy per spawn cell, keyed by "floor:x,z". */
const ENEMY_AT: Record<string, EnemyId> = {
  '0:2,6': 'pou',
  '1:11,3': 'newYama',
  '2:3,3': 'fuggie',
  '3:6,5': 'littleTimmy',
};

function charToKind(ch: string): CellKind {
  switch (ch) {
    case '#':
      return 'wall';
    case ' ':
      return 'void';
    case '+':
      return 'door';
    case 'S':
      return 'stair';
    case 'v':
      return 'vent';
    default:
      return 'floor'; // '.', and all marker characters
  }
}

export function parseLayout(): House {
  const depth = FLOOR_SOURCES[0].length;
  const width = FLOOR_SOURCES[0][0].length;

  const house: House = {
    grids: [],
    edgesV: [],
    edgesH: [],
    roomId: [],
    width,
    depth,
    playerSpawn: { floor: 1, x: 0, z: 0 },
    playerSpawns: [],
    enemySpawns: [],
    hidingSpots: [],
    chargingStations: [],
    keyCandidates: [],
    exits: [],
    stairs: [
      { lower: 0, upper: 1, cells: [{ x: 6, z: 6 }, { x: 7, z: 6 }, { x: 8, z: 6 }] },
      { lower: 1, upper: 2, cells: [{ x: 1, z: 11 }, { x: 1, z: 12 }, { x: 1, z: 13 }] },
      { lower: 2, upper: 3, cells: [{ x: 12, z: 11 }, { x: 12, z: 12 }, { x: 12, z: 13 }] },
    ],
    vents: [
      // Multi-cell crawl tunnels bored through the wall lattice between rooms.
      { floor: 0, cells: [{ x: 5, z: 2 }, { x: 5, z: 3 }] },
      { floor: 1, cells: [{ x: 5, z: 5 }, { x: 5, z: 6 }] },
      { floor: 2, cells: [{ x: 2, z: 4 }] },
      { floor: 2, cells: [{ x: 12, z: 4 }, { x: 11, z: 4 }] }, // L-shaped maze bore
      { floor: 3, cells: [{ x: 6, z: 3 }, { x: 7, z: 3 }] }, // attic crawl
    ],
    chutes: [
      { from: { floor: 1, x: 10, z: 7 }, to: { floor: 0, x: 10, z: 7 } },
      { from: { floor: 3, x: 3, z: 2 }, to: { floor: 2, x: 3, z: 2 } },
    ],
    navBlockedStairCells: new Set<string>(),
  };

  let sawSpawn = false;

  FLOOR_SOURCES.forEach((rows, f) => {
    const floor = f as FloorIndex;
    if (rows.length !== depth) {
      throw new Error(`floor ${f}: expected ${depth} rows, got ${rows.length}`);
    }
    const grid: CellKind[][] = [];
    rows.forEach((row, z) => {
      if (row.length !== width) {
        throw new Error(`floor ${f} row ${z}: expected ${width} cols, got ${row.length}`);
      }
      const cells: CellKind[] = [];
      for (let x = 0; x < width; x++) {
        const ch = row[x];
        cells.push(charToKind(ch));
        const pos: CellPos = { floor, x, z };
        switch (ch) {
          case 'P':
            house.playerSpawns.push(pos);
            if (!sawSpawn) {
              house.playerSpawn = pos; // first P = back-compat default
              sawSpawn = true;
            }
            break;
          case 'E': {
            const enemy = ENEMY_AT[`${f}:${x},${z}`];
            if (!enemy) throw new Error(`enemy spawn at ${f}:${x},${z} missing ENEMY_AT entry`);
            house.enemySpawns.push({ pos, enemy });
            break;
          }
          case 'H': {
            const kind = HIDING_KINDS[`${f}:${x},${z}`];
            if (!kind) throw new Error(`hiding spot at ${f}:${x},${z} missing HIDING_KINDS entry`);
            house.hidingSpots.push({ pos, kind });
            break;
          }
          case 'C':
            house.chargingStations.push(pos);
            break;
          case 'K':
            house.keyCandidates.push(pos);
            break;
          case 'A':
            house.exits.push({ pos, id: 'A' });
            break;
          case 'B':
            house.exits.push({ pos, id: 'B' });
            break;
          case 'D':
            house.exits.push({ pos, id: 'C' });
            break;
          case 'V': {
            const chute = house.chutes.find(
              (c) => c.from.floor === floor && c.from.x === x && c.from.z === z
            );
            const landing = house.chutes.find(
              (c) => c.to.floor === floor && c.to.x === x && c.to.z === z
            );
            if (!chute && !landing) {
              throw new Error(`chute cell at ${f}:${x},${z} not in chutes table`);
            }
            break;
          }
        }
      }
      grid.push(cells);
    });
    house.grids.push(grid);
  });

  if (!sawSpawn) throw new Error('no player spawn (P) in layout');

  // Reinterpret the 2 m-authored house at the engine pitch (0.5 m → 4× per axis)
  // so it keeps its physical size and world coordinates. Validation, edges and
  // room ids below run on the upscaled grids.
  if (UPSCALE > 1) upscaleHouse(house, UPSCALE);

  // Stair/vent cells must match the grids. While here, mark every stair cell
  // that is NOT a valid nav node: only the run's entrance (low-end on the lower
  // floor) and landing (high-end on the upper floor) are walkable nav nodes — the
  // rest sit over the stairwell void and must not be pathed onto.
  for (const stair of house.stairs) {
    const lastIdx = stair.cells.length - 1;
    for (const fl of [stair.lower, stair.upper]) {
      stair.cells.forEach((c, i) => {
        if (house.grids[fl][c.z][c.x] !== 'stair') {
          throw new Error(`stair cell ${fl}:${c.x},${c.z} is not 'S' in the grid`);
        }
        const isEntrance = i === 0 && fl === stair.lower;
        const isLanding = i === lastIdx && fl === stair.upper;
        if (!isEntrance && !isLanding) {
          house.navBlockedStairCells.add(`${fl}:${c.x},${c.z}`);
        }
      });
    }
  }
  for (const vent of house.vents) {
    for (const c of vent.cells) {
      if (house.grids[vent.floor][c.z][c.x] !== 'vent') {
        throw new Error(`vent cell ${vent.floor}:${c.x},${c.z} is not 'v' in the grid`);
      }
    }
  }

  // Walls-as-edges (additive): synthesize edges from the legacy grids so
  // edge-aware consumers can migrate incrementally. See edges.ts.
  const edges = legacyGridToEdges(house.grids, house.width, house.depth);
  house.edgesV = edges.edgesV;
  house.edgesH = edges.edgesH;
  // Per-cell room labels flooded over the synthesized edges (a doorway bounds a
  // room). Single source of truth for room membership; see edges.ts.
  house.roomId = computeRoomIds(edges, house.grids, house.width, house.depth);

  return house;
}

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

export const house = parseLayout();
