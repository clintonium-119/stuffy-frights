import * as THREE from 'three';
import { config } from '../core/config';
import { House, isWalkable, worldToCell } from '../world/layoutTypes';

/** What an enemy needs to know about the player to perceive them. */
export interface PlayerSnapshot {
  position: THREE.Vector3;
  /** World-space eye point for eye-contact gaze; falls back to `position`. */
  eyePosition?: THREE.Vector3;
  /** Dev cheat: when true, enemies can never see the player (sight short-circuits). */
  undetectable?: boolean;
  floor: number;
  lightOn: boolean;
  crouched: boolean;
  /** 0 still, 1 crawl, 2 walk, 3 sprint. */
  noiseLevel: number;
  hidden: boolean;
  /** True when the player is within cover range of a prop (computed where the
   *  prop/solid cells are known). Only matters while crouched. */
  nearCover?: boolean;
}

export interface NoiseEvent {
  position: THREE.Vector3;
  floor: number;
  radius: number;
}

/** Pub/sub bus for one-shot noises (unhide fumble, grate creak, hum…). */
export class NoiseBus {
  private listeners: ((e: NoiseEvent) => void)[] = [];

  emit(e: NoiseEvent): void {
    for (const l of this.listeners) l(e);
  }

  subscribe(l: (e: NoiseEvent) => void): void {
    this.listeners.push(l);
  }
}

/**
 * Grid line-of-sight: DDA walk over wall cells between two points on the
 * same floor. Doors/stairs/vent cells don't block (a bored vent is a low
 * gap — enemies can spot you through it at standing height? No: vents keep
 * wall above 1.1 m, so they DO block sight; only floor/door/stair pass).
 */
export function gridLineOfSight(
  house: House,
  floor: number,
  from: THREE.Vector3,
  to: THREE.Vector3
): boolean {
  const steps = Math.ceil(from.distanceTo(to) / 0.5);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    const cell = worldToCell(x, z);
    const kind = house.grids[floor]?.[cell.z]?.[cell.x];
    if (!kind) return false;
    if (kind === 'wall' || kind === 'vent') return false;
    if (!isWalkable(kind)) return false;
  }
  return true;
}

/**
 * Can this enemy see the player right now? Range scales hard with the
 * flashlight (the beam betrays you) and shrinks for crouching; vision is
 * a forward cone except at brush distance; walls block via grid LOS.
 * A hidden player is never seen — finding them is the search mechanic.
 */
export function canSee(
  house: House,
  enemyPos: THREE.Vector3,
  enemyYaw: number,
  enemyFloor: number,
  player: PlayerSnapshot,
  /** Per-enemy sight-range multiplier (1 = the global baseline). */
  visionFactor = 1
): boolean {
  if (player.undetectable) return false; // dev cheat: invisible to sight
  if (player.hidden) return false;
  if (player.floor !== enemyFloor) return false;

  const dx = player.position.x - enemyPos.x;
  const dz = player.position.z - enemyPos.z;
  const dist = Math.hypot(dx, dz);

  let range = (player.lightOn ? config.ai.visionLightOn : config.ai.visionLightOff) * visionFactor;
  if (player.crouched) {
    range *= config.ai.visionCrouchFactor;
    // Crouched behind cover: a further reduction (lightweight — no prop raycast).
    if (player.nearCover) range *= config.ai.coverVisionFactor;
  }
  if (dist > range) return false;

  if (dist > config.ai.proximitySense) {
    // Forward cone check. Model fronts are +Z at yaw 0 (atan2 convention
    // matches EnemyBase facing).
    const facingX = Math.sin(enemyYaw);
    const facingZ = Math.cos(enemyYaw);
    const dot = (dx / dist) * facingX + (dz / dist) * facingZ;
    const halfCone = ((config.ai.coneDegrees / 2) * Math.PI) / 180;
    if (dot < Math.cos(halfCone)) return false;
  }

  return gridLineOfSight(house, enemyFloor, enemyPos, player.position);
}

/** Continuous movement noise radius from the player's noise level. */
export function movementNoiseRadius(noiseLevel: number): number {
  switch (noiseLevel) {
    case 1:
      return config.ai.hearCrouch;
    case 2:
      return config.ai.hearWalk;
    case 3:
      return config.ai.hearSprint;
    default:
      return 0;
  }
}

/** Per-enemy memory of stimuli. */
export class PerceptionMemory {
  lastSeenPos: THREE.Vector3 | null = null;
  lastSeenAt = -Infinity;
  lastNoisePos: THREE.Vector3 | null = null;
  /** Set when the enemy witnessed the player entering concealment. */
  sawEnterHidingAt: THREE.Vector3 | null = null;
  sawEnterPassageAt: THREE.Vector3 | null = null;

  recordSeen(pos: THREE.Vector3, now: number): void {
    this.lastSeenPos = pos.clone();
    this.lastSeenAt = now;
  }

  forgetWitnessed(): void {
    this.sawEnterHidingAt = null;
    this.sawEnterPassageAt = null;
  }

  /** Wipe all sightings/noise/witness memory for a fresh run. */
  clear(): void {
    this.lastSeenPos = null;
    this.lastSeenAt = -Infinity;
    this.lastNoisePos = null;
    this.sawEnterHidingAt = null;
    this.sawEnterPassageAt = null;
  }
}
