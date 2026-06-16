import * as THREE from 'three';

/** Graduated awareness band derived from the awareness value (later phases). */
export type AwarenessLevel = 'unaware' | 'suspicious' | 'alert';

/**
 * Consolidated per-tick perception + intention state for one enemy — the seam
 * perception writes and the FSM + renderer read. Owned by `EnemyBrain` and
 * exposed read-only; nothing outside the brain mutates it. Fields are filled
 * across the AI layers: sight/last-known here, gaze from the sight gate, and
 * awareness/heard-direction as the perception model grows.
 */
export interface EnemyAttention {
  /** True when the enemy has live line-of-sight to the player this tick. */
  seen: boolean;
  /** Ground position of the last sighting (for navigation), or null if never. */
  lastKnownPos: THREE.Vector3 | null;
  /** Sim time of the last sighting. */
  lastSeenAt: number;
  /** Player velocity estimated across successive sightings, or null. */
  lastSeenVel: THREE.Vector3 | null;
  /** Graduated awareness [0..1] (populated by the awareness model). */
  awareness: number;
  /** Awareness band derived from `awareness`. */
  level: AwarenessLevel;
  /** World point the head should look at, or null to release the gaze. */
  gazeTarget: THREE.Vector3 | null;
  /** Gaze strength [0..1]; 0 releases the head to the idle/attention layer. */
  gazeIntensity: number;
  /** Direction a heard sound arrived from (pathed hearing), or null. */
  heardDir: THREE.Vector3 | null;
}

/** A fresh, unaware attention struct. */
export function createAttention(): EnemyAttention {
  return {
    seen: false,
    lastKnownPos: null,
    lastSeenAt: -Infinity,
    lastSeenVel: null,
    awareness: 0,
    level: 'unaware',
    gazeTarget: null,
    gazeIntensity: 0,
    heardDir: null,
  };
}
