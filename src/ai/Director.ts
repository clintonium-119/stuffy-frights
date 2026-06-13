import * as THREE from 'three';
import { config } from '../core/config';
import { Rng } from '../core/rng';
import { House, cellToWorld, floorY, isWalkable, worldToCell } from '../world/layoutTypes';
import { EnemyBase } from '../enemies/EnemyBase';
import { Charles } from '../enemies/Charles';
import { Poo } from '../enemies/Poo';
import { NewYama } from '../enemies/NewYama';
import { Fuggie } from '../enemies/Fuggie';
import { EnemyBrain, BrainContext } from './EnemyBrain';
import { NavGraph } from './NavGraph';

export interface Resident {
  enemy: EnemyBase;
  brain: EnemyBrain;
}

/**
 * Spawns the four stuffies at their layout markers (Poo basement,
 * New Yama main, Fuggie upstairs, Charles attic) and manages fairness +
 * pacing: a passive grace window at run start, rare floor migrations so
 * the house never feels fully mapped-safe, an anti-camp rule that pushes
 * loiterers away from exits and the key, intensity ramp after key pickup,
 * and a mercy window after a near-miss escape.
 */
export class Director {
  readonly residents: Resident[] = [];
  private graceLeft = config.ai.gracePeriod;
  private migrationTimers: number[] = [];
  private campTimers: number[] = [];
  private mercyLeft = 0;
  private keyTaken = false;
  /** Fired when a resident adopts a new home floor (audio telegraph hook). */
  onMigrate: ((resident: Resident, fromFloor: number, toFloor: number) => void) | null = null;
  /** Anti-camp focus points: the 3 exits, plus the key once placed. */
  private focusPoints: THREE.Vector3[] = [];

  constructor(
    private readonly house: House,
    private nav: NavGraph,
    private rng: Rng,
    ctx: Omit<BrainContext, 'nav' | 'house' | 'rng'>,
    scene: THREE.Scene,
    private readonly markerWorld: (pos: { floor: number; x: number; z: number }) => THREE.Vector3,
    /** Test hook: swap real characters for stubs (canvas-free). */
    factory?: (id: string) => EnemyBase
  ) {
    const builders: Record<string, () => EnemyBase> = factory
      ? {
          charles: () => factory('charles'),
          poo: () => factory('poo'),
          newYama: () => factory('newYama'),
          fuggie: () => factory('fuggie'),
        }
      : {
          charles: () => new Charles(),
          poo: () => new Poo(),
          newYama: () => new NewYama(),
          fuggie: () => new Fuggie(),
        };
    const fullCtx: BrainContext = { house, nav, rng, ...ctx };

    for (const spawn of house.enemySpawns) {
      const enemy = builders[spawn.enemy]();
      const wp = markerWorld(spawn.pos);
      enemy.position.copy(wp);
      enemy.floorIndex = spawn.pos.floor;
      scene.add(enemy.group);
      const brain = new EnemyBrain(enemy, fullCtx, spawn.pos.floor);
      brain.passive = true; // grace
      this.residents.push({ enemy, brain });
      this.migrationTimers.push(config.ai.migrationInterval * (0.6 + rng.next() * 0.8));
      this.campTimers.push(0);
    }

    for (const exit of house.exits) this.focusPoints.push(markerWorld(exit.pos));
  }

  /**
   * Run-start fairness: no enemy in the player's room, none walking toward them.
   * Any same-floor enemy in the player's room — or within safeSpawnDistance — is
   * relocated to the farthest node off that floor's player-room; then every
   * same-floor enemy is faced away and given a far patrol target so it heads off
   * rather than toward the player. Call once after the player spawn is known.
   */
  seedSafeSpawns(
    playerPos: THREE.Vector3,
    playerCell: { x: number; z: number },
    playerFloor: number
  ): void {
    const room = this.floodRoom(playerFloor, playerCell);
    for (const r of this.residents) {
      if (r.enemy.floorIndex !== playerFloor) continue;
      const cell = worldToCell(r.enemy.position.x, r.enemy.position.z);
      const inRoom = room.has(`${cell.x},${cell.z}`);
      const tooClose = r.enemy.position.distanceTo(playerPos) < config.ai.safeSpawnDistance;
      if (inRoom || tooClose) {
        const far = this.nav.farthestNodeOnFloor(playerFloor, playerPos, room);
        if (far) {
          const w = cellToWorld(far.x, far.z);
          r.enemy.position.set(w.x, floorY(far.floor), w.z);
          r.enemy.floorIndex = far.floor;
        }
      }
      // Face away from the player so it isn't staring you down at the outset.
      const away = r.enemy.position.clone().sub(playerPos);
      away.y = 0;
      if (away.lengthSq() > 1e-4) {
        r.enemy.group.rotation.y = Math.atan2(-away.x, -away.z) + Math.PI;
      }
      // Seed the first patrol toward a far-from-player node (heads away, not in).
      const dest = this.nav.farthestNodeOnFloor(playerFloor, playerPos, room);
      if (dest) {
        const w = cellToWorld(dest.x, dest.z);
        r.brain.forcedDestination = new THREE.Vector3(w.x, floorY(dest.floor), w.z);
      }
    }
  }

  /**
   * Reset every enemy to its home spawn + a fresh patrol brain, restore the
   * grace window and pacing timers, and re-apply the run-start fair placement
   * around the (new) player spawn. For an in-place "play again" (no reload).
   * The caller re-adds the key focus point via setKeyLocation afterward.
   */
  restart(playerPos: THREE.Vector3, playerCell: { x: number; z: number }, playerFloor: number): void {
    this.graceLeft = config.ai.gracePeriod;
    this.mercyLeft = 0;
    this.keyTaken = false;
    this.migrationTimers = [];
    this.campTimers = [];
    this.house.enemySpawns.forEach((spawn, i) => {
      const r = this.residents[i];
      if (!r) return;
      const wp = this.markerWorld(spawn.pos);
      r.enemy.position.copy(wp);
      r.enemy.floorIndex = spawn.pos.floor;
      r.brain.reset();
      r.brain.passive = true; // grace
      this.migrationTimers.push(config.ai.migrationInterval * (0.6 + this.rng.next() * 0.8));
      this.campTimers.push(0);
    });
    this.focusPoints = [];
    for (const exit of this.house.exits) this.focusPoints.push(this.markerWorld(exit.pos));
    this.seedSafeSpawns(playerPos, playerCell, playerFloor);
  }

  /** Cells reachable from `start` without crossing a door — the player's room. */
  private floodRoom(floor: number, start: { x: number; z: number }): Set<string> {
    const grid = this.house.grids[floor];
    const seen = new Set<string>();
    if (!grid || !isWalkable(grid[start.z]?.[start.x])) return seen;
    seen.add(`${start.x},${start.z}`);
    const queue: { x: number; z: number }[] = [{ x: start.x, z: start.z }];
    while (queue.length) {
      const c = queue.shift()!;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = c.x + dx;
        const nz = c.z + dz;
        const kind = grid[nz]?.[nx];
        if (kind === undefined || kind === 'door' || !isWalkable(kind)) continue;
        const k = `${nx},${nz}`;
        if (seen.has(k)) continue;
        seen.add(k);
        queue.push({ x: nx, z: nz });
      }
    }
    return seen;
  }

  /** Objectives tells us where the key landed (anti-camp protects it). */
  setKeyLocation(pos: THREE.Vector3): void {
    this.focusPoints.push(pos.clone());
  }

  notifyKeyTaken(): void {
    if (this.keyTaken) return;
    this.keyTaken = true;
    for (const r of this.residents) r.brain.speedFactor = config.ai.keyTakenSpeedFactor;
  }

  /** Brief calm after the player breaks a chase (kid mercy pacing). */
  notifyNearMiss(): void {
    this.mercyLeft = config.ai.nearMissMercy;
  }

  update(dt: number, playerFloor: number): void {
    if (this.graceLeft > 0) {
      this.graceLeft -= dt;
      if (this.graceLeft <= 0) {
        for (const r of this.residents) r.brain.passive = false;
      }
    }
    if (this.mercyLeft > 0) {
      this.mercyLeft -= dt;
      const calm = this.mercyLeft > 0;
      for (const r of this.residents) {
        if (this.graceLeft <= 0) r.brain.passive = calm;
      }
    }

    this.residents.forEach((r, i) => {
      // Track floor for perception.
      r.enemy.floorIndex = Math.max(0, Math.min(3, Math.round(r.enemy.position.y / 3.5)));

      // Migration: occasionally adopt an adjacent floor as the new home —
      // but never the player's current floor while passive, and never
      // during a hunt.
      this.migrationTimers[i] -= dt;
      if (this.migrationTimers[i] <= 0) {
        this.migrationTimers[i] =
          config.ai.migrationInterval * (0.7 + this.rng.next() * 0.6);
        if (r.brain.state === 'patrol') {
          const delta = this.rng.chance(0.5) ? 1 : -1;
          const next = Math.max(0, Math.min(3, r.brain.homeFloor + delta));
          if (next !== r.brain.homeFloor && !(r.brain.passive && next === playerFloor)) {
            const from = r.brain.homeFloor;
            r.brain.homeFloor = next;
            this.onMigrate?.(r, from, next);
          }
        }
      }

      // Anti-camp: lingering near an exit or the key while not hunting
      // gets the enemy displaced to a far node on its home floor.
      const nearFocus = this.focusPoints.some(
        (f) => r.enemy.position.distanceTo(f) < config.ai.antiCampRadius
      );
      if (nearFocus && r.brain.state === 'patrol') {
        this.campTimers[i] += dt;
        if (this.campTimers[i] > config.ai.antiCampSeconds) {
          this.campTimers[i] = 0;
          // Send it to a random far node.
          for (let tries = 0; tries < 6; tries++) {
            const node = this.nav.randomNodeOnFloor(r.brain.homeFloor, this.rng);
            if (!node) break;
            const w = cellToWorld(node.x, node.z);
            const dest = new THREE.Vector3(w.x, floorY(node.floor), w.z);
            if (!this.focusPoints.some((f) => dest.distanceTo(f) < config.ai.antiCampRadius * 2)) {
              r.brain.forcedDestination = dest;
              break;
            }
          }
        }
      } else {
        this.campTimers[i] = Math.max(0, this.campTimers[i] - dt);
      }
    });
  }
}
