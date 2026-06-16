import { isWalkable, type CellKind, type EdgeState } from './layoutTypes';

/**
 * Wall/door/secret state carried on the boundaries *between* cells (walls-as-
 * edges), the model the authored mansion will use. Introduced additively: the
 * legacy ASCII house still keeps its `CellKind` grid; `legacyGridToEdges`
 * synthesizes equivalent edges so edge-aware consumers (nav, sound, room flood,
 * rendering) can migrate one at a time without breaking the current house.
 *
 *   edgesV[floor][z][x] = boundary between (x,z) and (x+1,z)   ("vertical" wall)
 *   edgesH[floor][z][x] = boundary between (x,z) and (x,z+1)   ("horizontal" wall)
 *
 * The last column of edgesV (x = width-1) and last row of edgesH (z = depth-1)
 * have no neighbour and are `'none'`.
 */
export interface EdgeGrids {
  edgesV: EdgeState[][][];
  edgesH: EdgeState[][][];
}

interface Cell {
  x: number;
  z: number;
}

const NEIGHBORS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/** Movement is blocked by a wall, or by a secret edge until it is discovered. */
export function blocksMovement(e: EdgeState, secretDiscovered = false): boolean {
  if (e === 'secret') return !secretDiscovered;
  return e === 'wall';
}

/** Line of sight is blocked by walls and undiscovered secret doors (not open ones). */
export function blocksSight(e: EdgeState, secretDiscovered = false): boolean {
  if (e === 'secret') return !secretDiscovered;
  return e === 'wall';
}

/**
 * Sound crossing an edge: walls and closed secret doors block it; a door
 * attenuates (a crossing cost) but passes; `none` is free.
 */
export function soundCrossing(e: EdgeState): { blocked: boolean; door: boolean } {
  if (e === 'wall' || e === 'secret') return { blocked: true, door: false };
  return { blocked: false, door: e === 'door' };
}

/** The edge state between two orthogonally-adjacent cells on `floor`. */
export function edgeBetween(edges: EdgeGrids, floor: number, a: Cell, b: Cell): EdgeState {
  if (a.z === b.z) {
    return edges.edgesV[floor]?.[a.z]?.[Math.min(a.x, b.x)] ?? 'none';
  }
  return edges.edgesH[floor]?.[Math.min(a.z, b.z)]?.[a.x] ?? 'none';
}

function edgeFromCells(a: CellKind, b: CellKind): EdgeState {
  if (a === 'door' || b === 'door') return 'door';
  if (a === 'wall' || b === 'wall' || a === 'void' || b === 'void') return 'wall';
  return 'none';
}

/**
 * Derive an `EdgeGrids` from the legacy `CellKind` grids: a boundary is a `door`
 * if either side is a door cell, a `wall` if either side is a wall/void cell,
 * else `none` (open between two walkable cells). Transitional — removed once the
 * authored mansion supplies edges directly.
 */
export function legacyGridToEdges(grids: CellKind[][][], width: number, depth: number): EdgeGrids {
  const edgesV: EdgeState[][][] = [];
  const edgesH: EdgeState[][][] = [];
  for (const grid of grids) {
    const v: EdgeState[][] = [];
    const h: EdgeState[][] = [];
    for (let z = 0; z < depth; z++) {
      const vrow: EdgeState[] = [];
      const hrow: EdgeState[] = [];
      for (let x = 0; x < width; x++) {
        vrow.push(x < width - 1 ? edgeFromCells(grid[z][x], grid[z][x + 1]) : 'none');
        hrow.push(z < depth - 1 ? edgeFromCells(grid[z][x], grid[z + 1][x]) : 'none');
      }
      v.push(vrow);
      h.push(hrow);
    }
    edgesV.push(v);
    edgesH.push(h);
  }
  return { edgesV, edgesH };
}

/**
 * Label every walkable cell with a room id: a maximal set of walkable cells
 * connected through `none` edges only. Wall/door/secret edges bound a room, so a
 * doorway separates two rooms even though it is passable (the enclosure rule).
 * Non-walkable cells get `-1`. Ids are unique across the whole house, so
 * equal ids on any two cells (any floor) mean the same room. Computed once at
 * parse time — house topology is static within a run.
 *
 *   roomId[floor][z][x]
 */
export function computeRoomIds(
  edges: EdgeGrids,
  grids: CellKind[][][],
  width: number,
  depth: number
): number[][][] {
  const rooms: number[][][] = [];
  let next = 0;
  for (let f = 0; f < grids.length; f++) {
    const grid = grids[f];
    const room: number[][] = [];
    for (let z = 0; z < depth; z++) room.push(new Array<number>(width).fill(-1));
    for (let z = 0; z < depth; z++) {
      for (let x = 0; x < width; x++) {
        if (room[z][x] !== -1 || !isWalkable(grid[z][x])) continue;
        const id = next++;
        room[z][x] = id;
        const queue: Cell[] = [{ x, z }];
        while (queue.length) {
          const c = queue.pop()!;
          for (const [dx, dz] of NEIGHBORS) {
            const nx = c.x + dx;
            const nz = c.z + dz;
            if (nx < 0 || nz < 0 || nx >= width || nz >= depth) continue;
            if (room[nz][nx] !== -1 || !isWalkable(grid[nz][nx])) continue;
            if (edgeBetween(edges, f, c, { x: nx, z: nz }) !== 'none') continue;
            room[nz][nx] = id;
            queue.push({ x: nx, z: nz });
          }
        }
      }
    }
    rooms.push(room);
  }
  return rooms;
}
