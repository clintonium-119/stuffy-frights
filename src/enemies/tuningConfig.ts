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

/**
 * Per-enemy gameplay multipliers, applied on top of the shared config.ai /
 * config.enemy baselines (so "5% faster" rides every difficulty preset).
 * All default to 1.0 → an un-tuned enemy behaves exactly as the global config.
 */
export interface EnemyGameplayTuning {
  /** Multiplies every AI movement speed (patrol/investigate/chase/lunge). */
  speedMult: number;
  /** Multiplies the sight range. */
  visionMult: number;
  /** Multiplies how far this enemy hears player noise. */
  hearingMult: number;
  /** Multiplies the menacing-face threat radius. */
  threatMult: number;
  /** Multiplies the body size (1.0 = the authored height). */
  scaleMult: number;
}

/** All tunables for one enemy. */
export interface EnemyTuning {
  anim: EnemyAnimTuning;
  /** Authored body height in world units (feet on the ground). */
  height: number;
  gameplay: EnemyGameplayTuning;
}

/** Neutral gameplay multipliers (no-op). */
export const DEFAULT_GAMEPLAY: EnemyGameplayTuning = {
  speedMult: 1,
  visionMult: 1,
  hearingMult: 1,
  threatMult: 1,
  scaleMult: 1,
};

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
  poo: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 3, bob: 0.18, squash: 0.28, rock: 0 }, height: 0.914, gameplay: { speedMult: 1, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1 } },
  fuggie: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 3.6, bob: 0.05, squash: 0, rock: 0.07 }, height: 1.544, gameplay: { speedMult: 1, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1 } },
  charles: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 2.6, bob: 0.03, squash: 0, rock: 0 }, height: 1.64, gameplay: { speedMult: 1, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1 } },
  newYama: { anim: { swingRate: 2.6, legSwing: 0.45, armSwing: 0.5, headYaw: 0.7, headPitch: 0.7, bobRate: 2.6, bob: 0.03, squash: 0, rock: 0 }, height: 1.945, gameplay: { speedMult: 1, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1 } },
};
// </apo:gen>
