import * as THREE from 'three';
import {
  CellPos,
  House,
  Stair,
  cellToWorld,
  floorY,
  isWalkable,
  worldToCell,
} from '../world/layoutTypes';
import { neighbors } from '../world/houseLayout';

export interface NavNodeId {
  floor: number;
  x: number;
  z: number;
}

export interface PathOptions {
  /** Include vent + chute edges (only when following a seen player). */
  allowPassages?: boolean;
}

const key = (f: number, x: number, z: number) => `${f}:${x},${z}`;

interface Edge {
  to: string;
  cost: number;
  passage: boolean;
}

/**
 * Enemy navigation graph built from the layout's shared adjacency:
 * walkable cells minus solid-prop cells, stair-run edges between floors,
 * vent bores and one-way chutes flagged as passage edges (excluded from
 * pathfinding unless explicitly allowed). Chute mouth cells are excluded
 * from ordinary adjacency so patrols never wander over an open hatch.
 */
export class NavGraph {
  private adjacency = new Map<string, Edge[]>();
  private cells = new Map<string, NavNodeId>();
  private stairs: Stair[] = [];

  constructor(house: House, solidCells: Set<string>) {
    const chuteMouths = new Set(house.chutes.map((c) => key(c.from.floor, c.from.x, c.from.z)));
    this.stairs = house.stairs;
    const blockedStairs = house.navBlockedStairCells;

    for (let f = 0; f < house.grids.length; f++) {
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          if (!isWalkable(house.grids[f][z][x])) continue;
          const id = key(f, x, z);
          if (solidCells.has(id)) continue;
          // Over-the-void stair cells (everything but a run's entrance/landing)
          // are not nav nodes — enemies change floors only via the run edge.
          if (blockedStairs.has(id)) continue;
          this.cells.set(id, { floor: f, x, z });
          const edges: Edge[] = [];
          for (const n of neighbors(house, { floor: f as CellPos['floor'], x, z })) {
            const nid = key(n.pos.floor, n.pos.x, n.pos.z);
            if (solidCells.has(nid) || blockedStairs.has(nid)) continue;
            // Ordinary movement never crosses an open chute mouth.
            const intoMouth = chuteMouths.has(nid) && !n.viaChute;
            const fromMouth = chuteMouths.has(id) && !n.viaChute;
            const passage = n.viaPassage || n.viaChute || intoMouth || fromMouth;
            const crossFloor = n.pos.floor !== f;
            const cost = n.viaChute ? 2 : crossFloor ? 4 : passage ? 2.5 : 1;
            edges.push({ to: nid, cost, passage });
          }
          this.adjacency.set(id, edges);
        }
      }
    }
  }

  nearestNode(worldPos: THREE.Vector3): NavNodeId | null {
    const floor = Math.max(0, Math.min(3, Math.round(worldPos.y / 3.5)));
    const { x, z } = worldToCell(worldPos.x, worldPos.z);
    const direct = this.cells.get(key(floor, x, z));
    if (direct) return direct;
    // Spiral out to the nearest registered cell on this floor.
    for (let r = 1; r <= 3; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const hit = this.cells.get(key(floor, x + dx, z + dz));
          if (hit) return hit;
        }
      }
    }
    return null;
  }

  /** A* between cells. Returns the cell path including both endpoints. */
  findPath(from: NavNodeId, to: NavNodeId, opts: PathOptions = {}): NavNodeId[] | null {
    const startId = key(from.floor, from.x, from.z);
    const goalId = key(to.floor, to.x, to.z);
    if (!this.adjacency.has(startId) || !this.adjacency.has(goalId)) return null;

    const open = new Map<string, number>([[startId, 0]]);
    const gScore = new Map<string, number>([[startId, 0]]);
    const cameFrom = new Map<string, string>();
    const closed = new Set<string>();
    const h = (id: string) => {
      const n = this.cells.get(id)!;
      return Math.abs(n.x - to.x) + Math.abs(n.z - to.z) + Math.abs(n.floor - to.floor) * 10;
    };

    while (open.size) {
      let current = '';
      let best = Infinity;
      for (const [id, f] of open) {
        if (f < best) {
          best = f;
          current = id;
        }
      }
      if (current === goalId) {
        const path: NavNodeId[] = [];
        let cur: string | undefined = current;
        while (cur) {
          path.unshift(this.cells.get(cur)!);
          cur = cameFrom.get(cur);
        }
        return path;
      }
      open.delete(current);
      closed.add(current);

      for (const edge of this.adjacency.get(current) ?? []) {
        if (closed.has(edge.to)) continue;
        if (edge.passage && !opts.allowPassages) continue;
        const tentative = (gScore.get(current) ?? Infinity) + edge.cost;
        if (tentative < (gScore.get(edge.to) ?? Infinity)) {
          cameFrom.set(edge.to, current);
          gScore.set(edge.to, tentative);
          open.set(edge.to, tentative + h(edge.to));
        }
      }
    }
    return null;
  }

  /** Cell path → world waypoints (cell centers at floor height), with
   * collinear same-floor cells skipped for natural movement. */
  toWaypoints(path: NavNodeId[]): THREE.Vector3[] {
    const out: THREE.Vector3[] = [];
    const push = (cx: number, cz: number, y: number) => {
      const { x, z } = cellToWorld(cx, cz);
      out.push(new THREE.Vector3(x, y, z));
    };
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      const prev = path[i - 1];
      const next = path[i + 1];
      if (
        prev &&
        next &&
        prev.floor === n.floor &&
        next.floor === n.floor &&
        Math.sign(next.x - n.x) === Math.sign(n.x - prev.x) &&
        Math.sign(next.z - n.z) === Math.sign(n.z - prev.z)
      ) {
        continue; // collinear — skip
      }
      push(n.x, n.z, floorY(n.floor));
      // A stair run edge connects only the entrance↔landing; lay the steps in
      // between at interpolated heights so the enemy rides the staircase flush
      // instead of cutting straight to the far floor (and clipping the treads).
      if (next) {
        const stair = this.stairForEdge(n, next);
        if (stair) {
          const lastIdx = stair.cells.length - 1;
          const yLow = floorY(stair.lower);
          const yHigh = floorY(stair.upper);
          const ascending = n.floor === stair.lower;
          for (let s = 1; s < lastIdx; s++) {
            const idx = ascending ? s : lastIdx - s; // run-cell index in travel order
            const c = stair.cells[idx];
            push(c.x, c.z, yLow + (yHigh - yLow) * (idx / lastIdx));
          }
        }
      }
    }
    return out;
  }

  /** The stair run whose entrance/landing are exactly this node pair, else null. */
  private stairForEdge(a: NavNodeId, b: NavNodeId): Stair | null {
    for (const s of this.stairs) {
      const lo = s.cells[0];
      const hi = s.cells[s.cells.length - 1];
      const entrance = (n: NavNodeId) => n.floor === s.lower && n.x === lo.x && n.z === lo.z;
      const landing = (n: NavNodeId) => n.floor === s.upper && n.x === hi.x && n.z === hi.z;
      if ((entrance(a) && landing(b)) || (landing(a) && entrance(b))) return s;
    }
    return null;
  }

  randomNodeOnFloor(floor: number, rng: { next(): number }): NavNodeId | null {
    const onFloor = [...this.cells.values()].filter((c) => c.floor === floor);
    if (onFloor.length === 0) return null;
    return onFloor[Math.floor(rng.next() * onFloor.length)];
  }

  /**
   * The walkable node on `floor` farthest (world distance) from `from`, skipping
   * any cell whose "x,z" key is in `exclude` (e.g. the player's room). Used to
   * relocate a spawn well away from the player.
   */
  farthestNodeOnFloor(floor: number, from: THREE.Vector3, exclude?: Set<string>): NavNodeId | null {
    let best: NavNodeId | null = null;
    let bestD = -1;
    for (const c of this.cells.values()) {
      if (c.floor !== floor) continue;
      if (exclude && exclude.has(`${c.x},${c.z}`)) continue;
      const w = cellToWorld(c.x, c.z);
      const dx = w.x - from.x;
      const dz = w.z - from.z;
      const d = dx * dx + dz * dz;
      if (d > bestD) {
        bestD = d;
        best = c;
      }
    }
    return best;
  }
}

/** Drives an enemy along waypoints; repaths are the brain's job. */
export class PathFollower {
  private waypoints: THREE.Vector3[] = [];
  private index = 0;

  setPath(waypoints: THREE.Vector3[]): void {
    this.waypoints = waypoints;
    this.index = 0;
  }

  clear(): void {
    this.waypoints = [];
    this.index = 0;
  }

  get done(): boolean {
    return this.index >= this.waypoints.length;
  }

  /** Feed the enemy its current waypoint; advance on arrival. */
  drive(enemy: { position: THREE.Vector3; setMoveTarget(t: THREE.Vector3 | null, s?: number): void }, speed: number): void {
    if (this.done) {
      enemy.setMoveTarget(null);
      return;
    }
    const wp = this.waypoints[this.index];
    const flat = wp.clone();
    const d2 =
      (enemy.position.x - wp.x) * (enemy.position.x - wp.x) +
      (enemy.position.z - wp.z) * (enemy.position.z - wp.z);
    const dy = Math.abs(enemy.position.y - wp.y);
    if (d2 < 0.36 && dy < 0.6) {
      this.index++;
      this.drive(enemy, speed);
      return;
    }
    enemy.setMoveTarget(flat, speed);
  }
}
