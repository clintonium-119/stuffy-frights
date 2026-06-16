/**
 * Declarative builders for hand-authoring the mansion on the 0.5 m edge model
 * (walls-as-edges: the authored house has no wall cells — every wall, door, and
 * secret lives on a cell boundary). A `MansionBuilder` accumulates floors, rooms,
 * openings, and vertical connectors, then `build()` assembles a `House` (edges,
 * room ids, and the nav-blocked stair set derived the same way `parseLayout`
 * does). Dev/authoring only — kept out of the runtime path. See `validate.ts` for
 * the connectivity / enclosure / alignment checks that gate authored data.
 *
 * Edge addressing mirrors `edges.ts`:
 *   edgesV[z][x] = boundary between (x,z) and (x+1,z)
 *   edgesH[z][x] = boundary between (x,z) and (x,z+1)
 */
import {
  CellKind,
  CellPos,
  Chute,
  EdgeState,
  FloorIndex,
  House,
  Stair,
  Vent,
  WindowDef,
} from '../layoutTypes';
import { computeRoomIds } from '../edges';

export interface Cell {
  x: number;
  z: number;
}

/** Inclusive axis-aligned cell rectangle [x0..x1] × [z0..z1]. */
export interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

interface FloorData {
  grid: CellKind[][]; // [z][x]
  edgesV: EdgeState[][]; // [z][x]
  edgesH: EdgeState[][]; // [z][x]
}

const cellKey = (f: number, x: number, z: number): string => `${f}:${x},${z}`;

function eachRectCell(r: Rect, fn: (x: number, z: number) => void): void {
  for (let z = Math.min(r.z0, r.z1); z <= Math.max(r.z0, r.z1); z++) {
    for (let x = Math.min(r.x0, r.x1); x <= Math.max(r.x0, r.x1); x++) fn(x, z);
  }
}

const ORTHO: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export class MansionBuilder {
  readonly stairs: Stair[] = [];
  readonly vents: Vent[] = [];
  readonly chutes: Chute[] = [];
  readonly windows: WindowDef[] = [];
  private readonly floors: FloorData[] = [];

  constructor(
    readonly width: number,
    readonly depth: number,
    floorCount: number
  ) {
    for (let f = 0; f < floorCount; f++) {
      const grid: CellKind[][] = [];
      const edgesV: EdgeState[][] = [];
      const edgesH: EdgeState[][] = [];
      for (let z = 0; z < depth; z++) {
        grid.push(new Array<CellKind>(width).fill('void'));
        edgesV.push(new Array<EdgeState>(width).fill('none'));
        edgesH.push(new Array<EdgeState>(width).fill('none'));
      }
      this.floors.push({ grid, edgesV, edgesH });
    }
  }

  private floor(f: FloorIndex): FloorData {
    const fl = this.floors[f];
    if (!fl) throw new Error(`floor ${f} out of range (0..${this.floors.length - 1})`);
    return fl;
  }

  private inBounds(x: number, z: number): boolean {
    return x >= 0 && z >= 0 && x < this.width && z < this.depth;
  }

  /** Set the boundary state between two orthogonally-adjacent cells. */
  private setEdge(f: FloorIndex, a: Cell, b: Cell, state: EdgeState): void {
    const dx = Math.abs(a.x - b.x);
    const dz = Math.abs(a.z - b.z);
    if (dx + dz !== 1) {
      throw new Error(`edge endpoints ${a.x},${a.z} and ${b.x},${b.z} are not adjacent`);
    }
    const fl = this.floor(f);
    if (a.z === b.z) fl.edgesV[a.z][Math.min(a.x, b.x)] = state;
    else fl.edgesH[Math.min(a.z, b.z)][a.x] = state;
  }

  /**
   * Stamp a room: one rect, or several rects forming a single L-/T-shaped room
   * (their union). Every cell becomes `floor`; boundaries inside the union are
   * opened (`none`) and the outer perimeter is walled. Boundaries to the envelope
   * edge are implicit walls (skipped). Re-stamp openings afterwards with
   * `door`/`secret`/`open`. Rooms are authored as rectangles (or unions); there
   * is no free-polygon primitive — the design's footprints are rectilinear.
   *
   * Cells already stamped `stair`/`vent` (the vertical columns the schematic says
   * to lay down first) keep their kind — a stair landing inside a hall stays a
   * stair, just opened to the surrounding floor.
   */
  room(f: FloorIndex, area: Rect | Rect[]): this {
    const rects = Array.isArray(area) ? area : [area];
    const fl = this.floor(f);
    const inRoom = new Set<string>();
    for (const r of rects) {
      eachRectCell(r, (x, z) => {
        if (!this.inBounds(x, z)) throw new Error(`room cell ${x},${z} out of bounds`);
        const cur = fl.grid[z][x];
        if (cur !== 'stair' && cur !== 'vent') fl.grid[z][x] = 'floor';
        inRoom.add(`${x},${z}`);
      });
    }
    for (const r of rects) {
      eachRectCell(r, (x, z) => {
        for (const [dx, dz] of ORTHO) {
          const nx = x + dx;
          const nz = z + dz;
          if (!this.inBounds(nx, nz)) continue; // envelope edge: implicit wall
          const interior = inRoom.has(`${nx},${nz}`);
          this.setEdge(f, { x, z }, { x: nx, z: nz }, interior ? 'none' : 'wall');
        }
      });
    }
    return this;
  }

  /** A corridor is a long thin room — same stamp, named for authoring intent. */
  corridor(f: FloorIndex, rect: Rect): this {
    return this.room(f, rect);
  }

  /** A passable doorway on the boundary between two adjacent cells. */
  door(f: FloorIndex, a: Cell, b: Cell): this {
    this.setEdge(f, a, b, 'door');
    return this;
  }

  /** A secret door: blocks until discovered, then passes (a jib edge). */
  secret(f: FloorIndex, a: Cell, b: Cell): this {
    this.setEdge(f, a, b, 'secret');
    return this;
  }

  /** An open archway (no wall) between two adjacent cells. */
  open(f: FloorIndex, a: Cell, b: Cell): this {
    this.setEdge(f, a, b, 'none');
    return this;
  }

  /** Force a wall on the boundary between two adjacent cells. */
  wall(f: FloorIndex, a: Cell, b: Cell): this {
    this.setEdge(f, a, b, 'wall');
    return this;
  }

  /**
   * A stair run connecting `lower`↔`upper`. The same cell column is stamped
   * `stair` on both floors (the run punches the upper slab); `build()` marks the
   * over-the-void cells nav-blocked so only the entrance/landing are pathable.
   */
  stair(run: { lower: FloorIndex; upper: FloorIndex; cells: Cell[] }): this {
    if (run.lower === run.upper) throw new Error('stair lower and upper floor are equal');
    if (run.cells.length === 0) throw new Error('stair has no cells');
    for (const fl of [run.lower, run.upper]) {
      const data = this.floor(fl);
      for (const c of run.cells) {
        if (!this.inBounds(c.x, c.z)) throw new Error(`stair cell ${c.x},${c.z} out of bounds`);
        data.grid[c.z][c.x] = 'stair';
      }
    }
    this.stairs.push({ lower: run.lower, upper: run.upper, cells: run.cells.map((c) => ({ ...c })) });
    return this;
  }

  /**
   * A crawl vent: a 1-cell-wide bore between rooms. Cells become `vent` (low
   * clearance, marked `viaPassage` for the AI) and consecutive cells along the
   * run are opened to each other; open the mouth edges into each room with
   * `open()`.
   */
  vent(floor: FloorIndex, cells: Cell[]): this {
    if (cells.length === 0) throw new Error('vent has no cells');
    const data = this.floor(floor);
    for (const c of cells) {
      if (!this.inBounds(c.x, c.z)) throw new Error(`vent cell ${c.x},${c.z} out of bounds`);
      data.grid[c.z][c.x] = 'vent';
    }
    for (let i = 1; i < cells.length; i++) this.setEdge(floor, cells[i - 1], cells[i], 'none');
    this.vents.push({ floor, cells: cells.map((c) => ({ ...c })) });
    return this;
  }

  /** A one-way drop from `from` to `to` on the floor below. */
  chute(from: CellPos, to: CellPos): this {
    this.chutes.push({ from: { ...from }, to: { ...to } });
    return this;
  }

  /** A window on an exterior wall edge (rendered as an unlit night view). */
  window(win: WindowDef): this {
    this.windows.push({ ...win });
    return this;
  }

  /**
   * Assemble the `House`: grids + edges as authored, room ids flooded over the
   * edges, and the nav-blocked stair set derived as `parseLayout` does (every
   * stair cell except the run's entrance and landing). Marker tables (spawns,
   * hiding spots, exits, …) are left empty — they are populated in a later phase.
   */
  build(): House {
    const grids = this.floors.map((fl) => fl.grid);
    const edgesV = this.floors.map((fl) => fl.edgesV);
    const edgesH = this.floors.map((fl) => fl.edgesH);
    const roomId = computeRoomIds({ edgesV, edgesH }, grids, this.width, this.depth);

    const navBlockedStairCells = new Set<string>();
    for (const stair of this.stairs) {
      const lastIdx = stair.cells.length - 1;
      for (const fl of [stair.lower, stair.upper]) {
        stair.cells.forEach((c, i) => {
          const isEntrance = i === 0 && fl === stair.lower;
          const isLanding = i === lastIdx && fl === stair.upper;
          if (!isEntrance && !isLanding) navBlockedStairCells.add(cellKey(fl, c.x, c.z));
        });
      }
    }

    return {
      grids,
      edgesV,
      edgesH,
      roomId,
      width: this.width,
      depth: this.depth,
      windows: this.windows.map((w) => ({ ...w })),
      playerSpawn: { floor: 0, x: 0, z: 0 },
      playerSpawns: [],
      enemySpawns: [],
      hidingSpots: [],
      chargingStations: [],
      keyCandidates: [],
      exits: [],
      stairs: this.stairs.map((s) => ({ ...s, cells: s.cells.map((c) => ({ ...c })) })),
      vents: this.vents.map((v) => ({ ...v, cells: v.cells.map((c) => ({ ...c })) })),
      chutes: this.chutes.map((c) => ({ from: { ...c.from }, to: { ...c.to } })),
      navBlockedStairCells,
    };
  }
}
