import { describe, it, expect } from 'vitest';
import { legacyGridToEdges, computeRoomIds } from './edges';
import { neighbors } from './houseLayout';
import type { CellKind, EdgeState, House } from './layoutTypes';

// Pure-logic regression: the edge model + the ported consumers (nav adjacency,
// room flooding) preserve behaviour on a hand-specified fixture. Two
// representations of the SAME logical layout — two rooms joined only by a
// doorway — are exercised: the legacy ASCII (walls/doors as cells, fed through
// the adapter) and a directly-authored thin-edge grid. Both must agree on the
// invariant that a doorway joins rooms for MOVEMENT but separates them for
// ENCLOSURE.

const KIND: Record<string, CellKind> = { '#': 'wall', '.': 'floor', '+': 'door' };

/** Minimal single-floor House sufficient for `neighbors` + `computeRoomIds`. */
function makeHouse(grids: CellKind[][][], edgesV: EdgeState[][][], edgesH: EdgeState[][][]): House {
  const depth = grids[0].length;
  const width = grids[0][0].length;
  return {
    grids,
    edgesV,
    edgesH,
    roomId: computeRoomIds({ edgesV, edgesH }, grids, width, depth),
    width,
    depth,
    playerSpawn: { floor: 0, x: 0, z: 0 },
    playerSpawns: [],
    enemySpawns: [],
    hidingSpots: [],
    chargingStations: [],
    keyCandidates: [],
    exits: [],
    stairs: [],
    vents: [],
    chutes: [],
    windows: [],
    navBlockedStairCells: new Set<string>(),
  };
}

function fromAscii(rows: string[]): House {
  const grids: CellKind[][][] = [rows.map((r) => [...r].map((ch) => KIND[ch]))];
  const depth = rows.length;
  const width = rows[0].length;
  const { edgesV, edgesH } = legacyGridToEdges(grids, width, depth);
  return makeHouse(grids, edgesV, edgesH);
}

/** Set of cells mutually reachable from `start` over ordinary (non-passage) movement. */
function reachable(house: House, start: { x: number; z: number }): Set<string> {
  const seen = new Set<string>([`${start.x},${start.z}`]);
  const q = [{ x: start.x, z: start.z }];
  while (q.length) {
    const c = q.shift()!;
    for (const n of neighbors(house, { floor: 0, x: c.x, z: c.z })) {
      if (n.viaPassage || n.viaChute) continue;
      const k = `${n.pos.x},${n.pos.z}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ x: n.pos.x, z: n.pos.z });
      }
    }
  }
  return seen;
}

/** roomId → cell keys, dropping non-walkable (-1) cells. */
function roomPartition(house: House): number[] {
  const groups = new Map<number, number>();
  for (let z = 0; z < house.depth; z++) {
    for (let x = 0; x < house.width; x++) {
      const id = house.roomId[0][z][x];
      if (id < 0) continue;
      groups.set(id, (groups.get(id) ?? 0) + 1);
    }
  }
  return [...groups.values()].sort((a, b) => a - b);
}

function walkableCount(house: House): number {
  let n = 0;
  for (let z = 0; z < house.depth; z++)
    for (let x = 0; x < house.width; x++) if (house.roomId[0][z][x] >= 0) n++;
  return n;
}

describe('legacy adapter equivalence', () => {
  // Two rooms (left x∈{1,2}, right x∈{4,5}) walled apart, joined only by a door
  // at (3,2). Walls + door are cells (the legacy encoding).
  const legacy = fromAscii([
    '#######',
    '#..#..#',
    '#..+..#',
    '#..#..#',
    '#######',
  ]);

  it('adapted ASCII: every walkable cell is mutually reachable through the doorway', () => {
    const reach = reachable(legacy, { x: 1, z: 1 }); // a left-room cell
    expect(reach.size).toBe(walkableCount(legacy)); // one connected component
    expect(reach.has('5,3')).toBe(true); // farthest right-room cell included
    expect(reach.has('3,2')).toBe(true); // crosses the door cell
  });

  it('adapted ASCII: room partition is two rooms (+ the doorway), bounded by edges', () => {
    // Left 6 cells, right 6 cells, and the door cell as its own 1-cell region.
    expect(roomPartition(legacy)).toEqual([1, 6, 6]);
    // The two room cells either side of the doorway are NOT the same room.
    expect(legacy.roomId[0][2][2]).not.toBe(legacy.roomId[0][2][4]);
  });

  // The same layout authored directly with thin wall/door edges (no wall/door
  // cells): a 4×2 all-floor grid split between columns 1 and 2 — a wall edge on
  // the top row, a door edge on the bottom row.
  const authored = (() => {
    const grids: CellKind[][][] = [
      [
        ['floor', 'floor', 'floor', 'floor'],
        ['floor', 'floor', 'floor', 'floor'],
      ],
    ];
    const blank = (): EdgeState[][] => [
      ['none', 'none', 'none', 'none'],
      ['none', 'none', 'none', 'none'],
    ];
    const edgesV = [blank()];
    edgesV[0][0][1] = 'wall'; // top row: solid between x=1 and x=2
    edgesV[0][1][1] = 'door'; // bottom row: a doorway between x=1 and x=2
    const edgesH = [blank()];
    return makeHouse(grids, edgesV, edgesH);
  })();

  it('authored thin-edge grid: same enclosure invariant as the adapted house', () => {
    const reach = reachable(authored, { x: 0, z: 0 }); // a left-room cell
    // Movement: the doorway joins both rooms into one reachable component.
    expect(reach.size).toBe(walkableCount(authored));
    expect(reach.has('3,1')).toBe(true);
    // Enclosure: two distinct rooms (left 4 cells, right 4 cells).
    expect(roomPartition(authored)).toEqual([4, 4]);
  });

  it('the shared invariant holds in both representations: doors join movement, split rooms', () => {
    for (const h of [legacy, authored]) {
      const start = { x: h === legacy ? 1 : 0, z: h === legacy ? 1 : 0 };
      // exactly one movement component...
      expect(reachable(h, start).size).toBe(walkableCount(h));
      // ...but more than one enclosed room.
      expect(roomPartition(h).length).toBeGreaterThan(1);
    }
  });
});
