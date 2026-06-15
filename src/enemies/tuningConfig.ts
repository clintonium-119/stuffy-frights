/**
 * Per-enemy tuning: the look + motion knobs that used to be hardcoded in the
 * articulation driver, surfaced as data so they can be dialed in live in the dev
 * viewer and saved back here. Keyed by enemy id (`poo`, `fuggie`, `charles`,
 * `newYama`). Defaults reproduce the prior hardcoded constants exactly, so an
 * un-tuned enemy is byte-for-byte unchanged.
 *
 * The ENEMY_TUNING declaration is a write-to-source region: the viewer's "save"
 * regenerates everything between the markers, so edit in the viewer, not inline.
 */

/** Walk / look animation parameters for one enemy. */
export interface EnemyAnimTuning {
  /** Fore/aft cadence of the leg + arm swing (gaitT multiplier). */
  swingRate: number;
  /** Leg-bone swing amplitude (radians). */
  legSwing: number;
  /** Arm-bone swing amplitude (radians, gorilla-style haul). */
  armSwing: number;
  /** Head gaze clamp half-cones (radians). */
  headYaw: number;
  headPitch: number;
  /** Body-bob cadence (gaitT multiplier) + height (fraction of body height). */
  bobRate: number;
  bob: number;
  /** Hop squash-stretch amount (0 for non-hop gaits). */
  squash: number;
  /** Shuffle side-rock amount in radians (0 for other gaits). */
  rock: number;
}

/** All tunables for one enemy (extended with scale + gameplay later). */
export interface EnemyTuning {
  anim: EnemyAnimTuning;
}

/** Fallback used when an enemy has no entry (e.g. test doubles). */
export const DEFAULT_ANIM: EnemyAnimTuning = {
  swingRate: 2.6,
  legSwing: 0.45,
  armSwing: 0.5,
  headYaw: 0.7,
  headPitch: 0.7,
  bobRate: 2.6,
  bob: 0.03,
  squash: 0,
  rock: 0,
};

// <apo:gen enemyTuning>
export const ENEMY_TUNING: Record<string, EnemyTuning> = {
  poo: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 3.2, bob: 0.18, squash: 0.28, rock: 0 } },
  fuggie: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 3.6, bob: 0.05, squash: 0, rock: 0.07 } },
  charles: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 2.6, bob: 0.03, squash: 0, rock: 0 } },
  newYama: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 2.6, bob: 0.03, squash: 0, rock: 0 } },
};
// </apo:gen>
