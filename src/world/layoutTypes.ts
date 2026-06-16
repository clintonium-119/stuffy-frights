/**
 * House layout data model. The ASCII grids in houseLayout.ts are the single
 * source of truth: geometry building, the nav graph, the map overlay, and
 * objective placement all consume the parsed House.
 *
 * Grid characters:
 *   '#' wall          '.' floor          ' ' void (outside)
 *   '+' doorway       'S' stair cell     'v' vent bore (crawl tunnel in a wall)
 *   'P' player spawn  'E' enemy spawn    'C' charging station
 *   'K' key candidate 'H' hiding spot    'V' chute opening (one-way drop)
 *   'A' exit A        'B' exit B         'D' exit C
 * All marker characters are walkable floor cells.
 */
import { config } from '../core/config';

export const CELL_SIZE = config.world.cellSize; // meters (horizontal grid pitch)
export const FLOOR_SPACING = config.world.floorSpacing; // meters between floor slabs
export const WALL_HEIGHT = 3.0; // meters

/**
 * A floor index is an arbitrary non-negative integer — the house carries as many
 * floors as its data defines (no fixed cap). `FLOOR_NAMES` supplies labels for
 * the known legacy floors; an authored house may extend the list.
 */
export type FloorIndex = number;
export const FLOOR_NAMES = ['Basement', 'Main Floor', 'Upstairs', 'Attic'] as const;

export type CellKind = 'wall' | 'floor' | 'void' | 'door' | 'stair' | 'vent';

/** Wall/door/secret state carried on the boundary between two cells. See `edges.ts`. */
export type EdgeState = 'none' | 'wall' | 'door' | 'secret';

export interface CellPos {
  floor: FloorIndex;
  x: number; // column
  z: number; // row
}

export type HidingKind = 'wardrobe' | 'underBed' | 'cabinet' | 'boxFort' | 'closet';

export type ExitId = 'A' | 'B' | 'C';

export type EnemyId = 'littleTimmy' | 'pou' | 'newYama' | 'fuggie';

export interface Stair {
  /** Cells of the run, low end first, on both floors at the same coords. */
  lower: FloorIndex;
  upper: FloorIndex;
  cells: { x: number; z: number }[];
}

export interface Vent {
  /** Bored wall cells forming a crawl tunnel (same floor, bidirectional). */
  floor: FloorIndex;
  cells: { x: number; z: number }[];
}

export interface Chute {
  /** One-way drop: enter at `from`, land at `to` on the floor below. */
  from: CellPos;
  to: CellPos;
}

export interface HidingSpotDef {
  pos: CellPos;
  kind: HidingKind;
}

export interface EnemySpawnDef {
  pos: CellPos;
  enemy: EnemyId;
}

export interface ExitDef {
  pos: CellPos;
  id: ExitId;
}

export interface House {
  /** grids[floor][z][x] */
  grids: CellKind[][][];
  /**
   * Walls-as-edges (additive; see `edges.ts`). edgesV[floor][z][x] is the
   * boundary between (x,z) and (x+1,z); edgesH[floor][z][x] between (x,z) and
   * (x,z+1). For the legacy ASCII house these are synthesized from `grids`;
   * the authored mansion supplies them directly.
   */
  edgesV: EdgeState[][][];
  edgesH: EdgeState[][][];
  /**
   * Per-cell room label: `roomId[floor][z][x]`, unique across the whole house
   * (`-1` for non-walkable cells). A room is the set of walkable cells connected
   * through `none` edges — wall/door/secret edges bound it, so a doorway
   * separates two rooms. Computed once at parse; see `computeRoomIds` in
   * `edges.ts`.
   */
  roomId: number[][][];
  width: number;
  depth: number;
  /** First spawn (back-compat); the full set lives in playerSpawns. */
  playerSpawn: CellPos;
  /** All candidate player spawns (main floor); a run picks one by seed. */
  playerSpawns: CellPos[];
  enemySpawns: EnemySpawnDef[];
  hidingSpots: HidingSpotDef[];
  chargingStations: CellPos[];
  keyCandidates: CellPos[];
  exits: ExitDef[];
  stairs: Stair[];
  vents: Vent[];
  chutes: Chute[];
  /**
   * `"floor:x,z"` keys for stair cells that are NOT valid nav nodes: every stair
   * cell except the run's entrance (low-end on the lower floor) and landing
   * (high-end on the upper floor). The in-between cells sit over the open
   * stairwell on the upper floor / partway up on the lower floor, so enemies must
   * not path onto them — they only change floors by the run's entrance↔landing edge.
   */
  navBlockedStairCells: Set<string>;
}

export function floorY(floor: number): number {
  return floor * FLOOR_SPACING;
}

export function cellToWorld(x: number, z: number): { x: number; z: number } {
  return { x: (x + 0.5) * CELL_SIZE, z: (z + 0.5) * CELL_SIZE };
}

export function worldToCell(x: number, z: number): { x: number; z: number } {
  return { x: Math.floor(x / CELL_SIZE), z: Math.floor(z / CELL_SIZE) };
}

/** Walkable for the player: floor-like cells (vents are crawl-only but walkable). */
export function isWalkable(kind: CellKind): boolean {
  return kind === 'floor' || kind === 'door' || kind === 'stair' || kind === 'vent';
}
