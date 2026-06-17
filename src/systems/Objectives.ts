import { Rng } from '../core/rng';
import { CellPos, ExitId, House } from '../world/layoutTypes';

export interface ObjectiveSetup {
  playerSpawn: CellPos;
  keyLocation: CellPos;
  correctExit: ExitId;
}

const MAIN_FLOOR = 2;
/** Relative weight of a main-floor key candidate vs an off-main one. */
const MAIN_FLOOR_KEY_WEIGHT = 0.12;

const cellKey = (c: { floor: number; x: number; z: number }) => `${c.floor}:${c.x},${c.z}`;

/**
 * Flood the room containing `start`: connected 'floor' cells on its floor,
 * not crossing walls, doors, stairs, or vents (those bound a room). Returns
 * "floor:x,z" ids.
 */
function floodRoom(house: House, start: CellPos): Set<string> {
  const grid = house.grids[start.floor];
  const seen = new Set<string>([cellKey(start)]);
  const queue: { x: number; z: number }[] = [{ x: start.x, z: start.z }];
  const open = (x: number, z: number) => grid[z]?.[x] === 'floor';
  while (queue.length) {
    const c = queue.shift()!;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = c.x + dx;
      const z = c.z + dz;
      if (!open(x, z)) continue;
      const id = cellKey({ floor: start.floor, x, z });
      if (seen.has(id)) continue;
      seen.add(id);
      queue.push({ x, z });
    }
  }
  return seen;
}

/**
 * Cells the key may not occupy given the spawn: the spawn room, every room
 * one doorway away from it, and any cell adjacent to a staircase (any floor).
 */
export function keyExclusion(house: House, spawn: CellPos): Set<string> {
  const excl = new Set<string>();

  // Spawn room + rooms one door-hop away (all on the spawn's floor).
  const spawnRoom = floodRoom(house, spawn);
  for (const id of spawnRoom) excl.add(id);
  const grid = house.grids[spawn.floor];
  for (const id of spawnRoom) {
    const [, coords] = id.split(':');
    const [sx, sz] = coords.split(',').map(Number);
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      // A door adjacent to the spawn room → flood the room on its far side.
      if (grid[sz + dz]?.[sx + dx] !== 'door') continue;
      const fx = sx + dx * 2;
      const fz = sz + dz * 2;
      if (grid[fz]?.[fx] !== 'floor') continue;
      for (const c of floodRoom(house, { floor: spawn.floor, x: fx, z: fz })) excl.add(c);
    }
  }

  // Stair-adjacent cells on every floor.
  for (const s of house.stairs) {
    for (const fl of [s.lower, s.upper]) {
      for (const c of s.cells) {
        for (const [dx, dz] of [
          [0, 0],
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          excl.add(cellKey({ floor: fl, x: c.x + dx, z: c.z + dz }));
        }
      }
    }
  }
  return excl;
}

/** Weighted seeded pick: off-main candidates dominate; main-floor is rare. */
function pickKey(house: House, rng: Rng, spawn: CellPos): CellPos {
  const excl = keyExclusion(house, spawn);
  const allowed = house.keyCandidates.filter((c) => !excl.has(cellKey(c)));
  // Never violate exclusions: if filtering left nothing, fall back to any
  // off-main candidate, then to any candidate at all.
  const pool = allowed.length
    ? allowed
    : house.keyCandidates.filter((c) => c.floor !== MAIN_FLOOR);
  const finalPool = pool.length ? pool : house.keyCandidates;

  const weights = finalPool.map((c) => (c.floor === MAIN_FLOOR ? MAIN_FLOOR_KEY_WEIGHT : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng.next() * total;
  for (let i = 0; i < finalPool.length; i++) {
    r -= weights[i];
    if (r <= 0) return finalPool[i];
  }
  return finalPool[finalPool.length - 1];
}

/** Pure, seeded objective roll — same seed, same run. */
export function rollObjectives(house: House, seed: number): ObjectiveSetup {
  const rng = new Rng(seed);
  const spawnCandidates = house.playerSpawns.length ? house.playerSpawns : [house.playerSpawn];
  const playerSpawn = rng.pick(spawnCandidates);
  const keyLocation = pickKey(house, rng, playerSpawn);
  const correctExit = rng.pick(house.exits.map((e) => e.id));
  return { playerSpawn, keyLocation, correctExit };
}

export type ExitResult = 'locked' | 'wrongKey' | 'open';

/**
 * The run objective: find the randomly hidden key ring, then find WHICH
 * of the three front-door exits it opens. Wrong exits reject the key;
 * nothing visually betrays the right one before trying.
 */
export class Objectives {
  setup: ObjectiveSetup;
  hasKey = false;
  escaped = false;
  /** Exits the player has tried (win-screen recap + map could use it). */
  readonly triedExits = new Set<ExitId>();
  onKeyTaken: (() => void) | null = null;
  onWin: (() => void) | null = null;
  /** Feedback line for the HUD toaster. */
  onMessage: ((text: string) => void) | null = null;

  constructor(
    private readonly house: House,
    seed: number
  ) {
    this.setup = rollObjectives(house, seed);
  }

  /** Re-randomize the run (the keys move) and clear progress for a fresh start. */
  reroll(seed: number): void {
    this.setup = rollObjectives(this.house, seed);
    this.hasKey = false;
    this.escaped = false;
    this.triedExits.clear();
  }

  takeKey(): void {
    if (this.hasKey) return;
    this.hasKey = true;
    this.onMessage?.('A ring of old keys. One of the doors out front should take these…');
    this.onKeyTaken?.();
  }

  tryExit(id: ExitId): ExitResult {
    this.triedExits.add(id);
    if (!this.hasKey) {
      this.onMessage?.("Locked tight. There's a keyhole…");
      return 'locked';
    }
    if (id !== this.setup.correctExit) {
      this.onMessage?.("The key doesn't fit this lock. There must be another door…");
      return 'wrongKey';
    }
    this.escaped = true;
    this.onWin?.();
    return 'open';
  }
}
