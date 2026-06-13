/**
 * Difficulty levels. Each level is a display identity (name, tier, description)
 * plus a PARTIAL override of the gameplay-balance config. `applyDifficulty` is
 * called once at boot (before any system reads `config`) and deep-merges the
 * chosen level's overrides into the shared `config` object in place, so every
 * importer sees the merged values without any call-site change.
 *
 * The base `config` is the calibration anchor (~midpoint of Medium and Hard);
 * Medium shifts a little easier than base, Easy is forgiving, Hard/Nightmare
 * bite harder. Numbers here are provisional and finalized by feel in the
 * calibration pass.
 */
import { config, type GameConfig } from './config';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'nightmare';

/** Ladder order (also the ironman progression). */
export const DIFFICULTY_ORDER: DifficultyLevel[] = ['easy', 'medium', 'hard', 'nightmare'];

/** First-launch default when nothing is stored. */
export const DEFAULT_DIFFICULTY: DifficultyLevel = 'medium';

export interface DifficultyMeta {
  key: DifficultyLevel;
  /** On-theme display name. */
  name: string;
  /** Relative tier label (Easy/Medium/Hard/Extreme). */
  tier: string;
  /** Plain-language summary of what was tuned, shown when the level is active. */
  description: string;
}

export const DIFFICULTY_META: Record<DifficultyLevel, DifficultyMeta> = {
  easy: {
    key: 'easy',
    name: 'Tuck-In',
    tier: 'Easy',
    description:
      'The dark is on your side. Enemies are half-blind and slow to notice you, ' +
      'give up quickly, rarely chase between floors, and your flashlight lasts ages ' +
      "— but it's still dark enough that you'll want it on.",
  },
  medium: {
    key: 'medium',
    name: 'Lights Out',
    tier: 'Medium',
    description:
      'A fair fright. Balanced senses, stamina, and battery — the intended way to play.',
  },
  hard: {
    key: 'hard',
    name: 'Night Terror',
    tier: 'Hard',
    description:
      'They hear you coming. Keener senses, faster chases, a longer memory, a shorter ' +
      'grace period at the start, and a flashlight that drains quicker.',
  },
  nightmare: {
    key: 'nightmare',
    name: 'Stuffy FrightMare',
    tier: 'Extreme',
    description:
      'No mercy. Enemies see far, hear the faintest step, outrun your sprint, hunt ' +
      'relentlessly across floors, and the dark is deeper while your light barely lasts.',
  },
};

/** Partial-override type that keeps array-valued knobs (e.g. *ByFloor) whole. */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends ReadonlyArray<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

/**
 * Per-level partial config overrides. Only knobs that differ from base appear.
 * Darkness arrays are base * a subtle multiplier (easy 1.25 / medium 1 /
 * hard 0.85 / nightmare 0.7) — every value stays within the deep-darkness
 * budget (ambient <= 0.15, hemisphere <= 0.08) and the basement stays darkest.
 */
export const DIFFICULTY_PRESETS: Record<DifficultyLevel, DeepPartial<GameConfig>> = {
  easy: {
    ai: {
      visionLightOn: 11,
      visionLightOff: 3.5,
      visionCrouchFactor: 0.5,
      hearWalk: 4.5,
      hearSprint: 10,
      hearCrouch: 1.8,
      chaseSpeed: 4.1,
      memorySeconds: 1.8,
      loseInterestSeconds: 1.0,
      investigateLinger: 1.5,
      gracePeriod: 28,
      migrationInterval: 140,
      crossFloorPursuit: 0.15,
    },
    battery: { drainSeconds: 130 },
    player: { stamina: { drainSeconds: 8, regenSeconds: 7 } },
    visibility: {
      ambientIntensityByFloor: [0.04375, 0.075, 0.075, 0.05625],
      hemisphereIntensityByFloor: [0.01875, 0.03125, 0.03125, 0.025],
    },
  },
  medium: {
    // A touch easier than the base anchor; darkness unchanged (multiplier 1).
    ai: {
      visionLightOff: 4.5,
      hearWalk: 5.5,
      chaseSpeed: 4.4,
      memorySeconds: 2.3,
      gracePeriod: 22,
      migrationInterval: 110,
      crossFloorPursuit: 0.4,
    },
    battery: { drainSeconds: 105 },
    player: { stamina: { drainSeconds: 6.5, regenSeconds: 8.5 } },
  },
  hard: {
    ai: {
      visionLightOn: 15,
      visionLightOff: 6,
      visionCrouchFactor: 0.75,
      hearWalk: 7,
      hearSprint: 14,
      hearCrouch: 2.8,
      chaseSpeed: 4.8,
      memorySeconds: 3.2,
      loseInterestSeconds: 2.2,
      investigateLinger: 2.6,
      gracePeriod: 16,
      migrationInterval: 80,
      crossFloorPursuit: 0.75,
    },
    battery: { drainSeconds: 80 },
    player: { stamina: { drainSeconds: 5, regenSeconds: 10 } },
    visibility: {
      ambientIntensityByFloor: [0.02975, 0.051, 0.051, 0.03825],
      hemisphereIntensityByFloor: [0.01275, 0.02125, 0.02125, 0.017],
    },
  },
  nightmare: {
    ai: {
      visionLightOn: 18,
      visionLightOff: 8,
      visionCrouchFactor: 0.85,
      hearWalk: 9,
      hearSprint: 16,
      hearCrouch: 3.5,
      chaseSpeed: 5.3,
      memorySeconds: 4.5,
      loseInterestSeconds: 3.5,
      investigateLinger: 3.5,
      gracePeriod: 10,
      migrationInterval: 55,
      crossFloorPursuit: 1.0,
    },
    battery: { drainSeconds: 60 },
    player: { stamina: { drainSeconds: 4, regenSeconds: 12 } },
    visibility: {
      ambientIntensityByFloor: [0.0245, 0.042, 0.042, 0.0315],
      hemisphereIntensityByFloor: [0.0105, 0.0175, 0.0175, 0.014],
    },
  },
};

type Mergeable = Record<string, unknown>;

/** Deep-merge `src` into `target` in place: clone arrays, recurse plain objects. */
function deepMerge(target: Mergeable, src: Mergeable): void {
  for (const key of Object.keys(src)) {
    const val = src[key];
    if (Array.isArray(val)) {
      target[key] = val.slice();
    } else if (val !== null && typeof val === 'object') {
      const child = (target[key] ??= {}) as Mergeable;
      deepMerge(child, val as Mergeable);
    } else {
      target[key] = val;
    }
  }
}

/**
 * Apply a difficulty level's overrides into the shared `config` object in place.
 * Call once at boot before any system reads `config`. Idempotent per level.
 */
export function applyDifficulty(level: DifficultyLevel): void {
  deepMerge(config as unknown as Mergeable, DIFFICULTY_PRESETS[level] as Mergeable);
}
