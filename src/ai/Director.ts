import * as THREE from 'three';
import { config } from '../core/config';
import { Rng } from '../core/rng';
import { House, cellToWorld, floorY } from '../world/layoutTypes';
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
  /** Anti-camp focus points: the 3 exits, plus the key once placed. */
  private focusPoints: THREE.Vector3[] = [];

  constructor(
    house: House,
    private nav: NavGraph,
    private rng: Rng,
    ctx: Omit<BrainContext, 'nav' | 'house' | 'rng'>,
    scene: THREE.Scene,
    markerWorld: (pos: { floor: number; x: number; z: number }) => THREE.Vector3,
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
            r.brain.homeFloor = next;
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
