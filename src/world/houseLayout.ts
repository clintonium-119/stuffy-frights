import {
  CellKind,
  CellPos,
  EnemyId,
  FloorIndex,
  HidingKind,
  House,
  isWalkable,
} from './layoutTypes';

/**
 * The house. 4 floors, 15×15 cells, hand-authored. Rooms are banded by
 * wall lines at columns 5/9 and rows 4/8 with deliberate loops so chases
 * have escape routes. See layoutTypes.ts for the character legend.
 */

const BASEMENT = [
  '###############',
  '#..H.#...#..C.#',
  '#....v...+....#',
  '#....#...#....#',
  '##+####+####+##',
  '#....#...#....#',
  '#.E..#SSS+...K#',
  '#....#...#V...#',
  '##+#########+##',
  '#....#H..#....#',
  '#.##.+...+.##.#',
  '#....#...#....#',
  '#.C..#...#..H.#',
  '#..K.#...#....#',
  '###############',
];

const MAIN = [
  '###############',
  '#H...#.B.#....#',
  '#....+...+..K.#',
  '#....#...#.E..#',
  '##+####+####+##',
  '#C...v...#...D#',
  '#....#SSS+....#',
  '#....#...#V...#',
  '##+####+####+##',
  '#...H#...#H...#',
  '#....#...#....#',
  '#S...+.P.+....#',
  '#S.K.#...#....#',
  '#S...#.A.#...C#',
  '###############',
];

const UPSTAIRS = [
  '###############',
  '#H...#...#...H#',
  '#....+...+..K.#',
  '#..E.#...#....#',
  '##v####.####v##',
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
  '#.....##......#',
  '#..#......#...#',
  '#..#..E...#.H.#',
  '#.............#',
  '#....##..#....#',
  '#.C...........#',
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
  '1:4,9': 'wardrobe', // living room wardrobe
  '1:10,9': 'cabinet', // study cabinet
  '2:1,1': 'wardrobe', // kid bedroom wardrobe
  '2:13,1': 'wardrobe', // master wardrobe
  '2:13,6': 'wardrobe', // bedroom2 closet
  '2:2,10': 'underBed', // bedroom3 under-bed
  '2:12,10': 'boxFort', // playroom toy chest
  '3:12,5': 'boxFort', // attic box fort
  '3:1,13': 'boxFort', // attic corner boxes
};

/** Enemy per spawn cell, keyed by "floor:x,z". */
const ENEMY_AT: Record<string, EnemyId> = {
  '0:2,6': 'poo',
  '1:11,3': 'newYama',
  '2:3,3': 'fuggie',
  '3:6,5': 'charles',
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
    width,
    depth,
    playerSpawn: { floor: 1, x: 0, z: 0 },
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
      { floor: 0, cells: [{ x: 5, z: 2 }] },
      { floor: 1, cells: [{ x: 5, z: 5 }] },
      { floor: 2, cells: [{ x: 2, z: 4 }] },
      { floor: 2, cells: [{ x: 12, z: 4 }] },
    ],
    chutes: [
      { from: { floor: 1, x: 10, z: 7 }, to: { floor: 0, x: 10, z: 7 } },
      { from: { floor: 3, x: 3, z: 2 }, to: { floor: 2, x: 3, z: 2 } },
    ],
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
            house.playerSpawn = pos;
            sawSpawn = true;
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

  // Stair/vent cells must match the grids.
  for (const stair of house.stairs) {
    for (const fl of [stair.lower, stair.upper]) {
      for (const c of stair.cells) {
        if (house.grids[fl][c.z][c.x] !== 'stair') {
          throw new Error(`stair cell ${fl}:${c.x},${c.z} is not 'S' in the grid`);
        }
      }
    }
  }
  for (const vent of house.vents) {
    for (const c of vent.cells) {
      if (house.grids[vent.floor][c.z][c.x] !== 'vent') {
        throw new Error(`vent cell ${vent.floor}:${c.x},${c.z} is not 'v' in the grid`);
      }
    }
  }

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

  return out;
}

export const house = parseLayout();
