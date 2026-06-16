import { type GameConfig } from '../core/config';

/**
 * Registry of the global `config.ai` tuning knobs exposed by the dev overlay's
 * AI section, grouped for the panel. Pure data — no DOM. Every `path` is a
 * numeric key of `config.ai`; ranges bracket the shipped defaults. All of these
 * are GLOBAL (they apply to every enemy), unlike the per-enemy multipliers in
 * the enemies viewer.
 */
export type AiKnobPath = keyof GameConfig['ai'];

export interface AiKnob {
  label: string;
  path: AiKnobPath;
  min: number;
  max: number;
  step: number;
}

export interface AiKnobGroup {
  title: string;
  knobs: AiKnob[];
}

export const AI_KNOB_GROUPS: AiKnobGroup[] = [
  {
    title: 'perception',
    knobs: [
      { label: 'vision (light on)', path: 'visionLightOn', min: 0, max: 30, step: 0.5 },
      { label: 'vision (light off)', path: 'visionLightOff', min: 0, max: 20, step: 0.5 },
      { label: 'crouch vision ×', path: 'visionCrouchFactor', min: 0, max: 1, step: 0.05 },
      { label: 'cover vision ×', path: 'coverVisionFactor', min: 0, max: 1, step: 0.05 },
      { label: 'cover radius', path: 'coverBonusRadius', min: 0, max: 6, step: 0.1 },
      { label: 'cone (deg)', path: 'coneDegrees', min: 0, max: 360, step: 5 },
      { label: 'proximity sense', path: 'proximitySense', min: 0, max: 6, step: 0.1 },
      { label: 'hear crouch', path: 'hearCrouch', min: 0, max: 12, step: 0.5 },
      { label: 'hear walk', path: 'hearWalk', min: 0, max: 20, step: 0.5 },
      { label: 'hear sprint', path: 'hearSprint', min: 0, max: 25, step: 0.5 },
      { label: 'hear charging hum', path: 'hearChargingHum', min: 0, max: 20, step: 0.5 },
    ],
  },
  {
    title: 'speeds',
    knobs: [
      { label: 'patrol speed', path: 'patrolSpeed', min: 0, max: 6, step: 0.1 },
      { label: 'investigate speed', path: 'investigateSpeed', min: 0, max: 8, step: 0.1 },
      { label: 'chase speed', path: 'chaseSpeed', min: 0, max: 8, step: 0.1 },
    ],
  },
  {
    title: 'awareness',
    knobs: [
      { label: 'suspicious thresh', path: 'awarenessSuspicious', min: 0, max: 1, step: 0.02 },
      { label: 'alert thresh', path: 'awarenessAlert', min: 0, max: 1, step: 0.02 },
      { label: 'rise delay', path: 'awarenessRiseDelay', min: 0, max: 1, step: 0.01 },
      { label: 'rise rate', path: 'awarenessRiseRate', min: 0, max: 20, step: 0.5 },
      { label: 'decay rate', path: 'awarenessDecayRate', min: 0, max: 10, step: 0.1 },
      { label: 'alert ratchet', path: 'awarenessAlertRatchet', min: 0, max: 5, step: 0.1 },
      { label: 'sight dark ×', path: 'sightStimDarkFactor', min: 0, max: 1, step: 0.05 },
      { label: 'hearing cap', path: 'hearingStimCap', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'gaze / attention',
    knobs: [
      { label: 'gaze linger', path: 'gazeLingerSeconds', min: 0, max: 3, step: 0.1 },
      { label: 'head-scan arc', path: 'headScanArc', min: 0, max: 1.5, step: 0.05 },
      { label: 'head-scan rate', path: 'headScanRate', min: 0, max: 5, step: 0.1 },
      { label: 'head-scan intensity', path: 'headScanIntensity', min: 0, max: 1, step: 0.05 },
      { label: 'glance intensity', path: 'glanceIntensity', min: 0, max: 1, step: 0.05 },
      { label: 'double-take gaze', path: 'doubleTakeGazeTime', min: 0, max: 2, step: 0.1 },
    ],
  },
  {
    title: 'hearing (pathed)',
    knobs: [
      { label: 'door cost', path: 'soundDoorCost', min: 0, max: 10, step: 0.5 },
      { label: 'recompute ticks', path: 'soundRecomputeTicks', min: 1, max: 30, step: 1 },
    ],
  },
  {
    title: 'patrol',
    knobs: [
      { label: 'recency weight', path: 'patrolRecency', min: 0, max: 3, step: 0.1 },
      { label: 'curiosity weight', path: 'patrolCuriosity', min: 0, max: 3, step: 0.1 },
      { label: 'jitter weight', path: 'patrolJitter', min: 0, max: 2, step: 0.05 },
      { label: 'recency full (s)', path: 'patrolRecencyFull', min: 1, max: 60, step: 1 },
      { label: 'distance ref (m)', path: 'patrolDistanceRef', min: 1, max: 30, step: 1 },
      { label: 'top-N', path: 'patrolTopN', min: 1, max: 12, step: 1 },
      { label: 'pause chance', path: 'patrolPauseChance', min: 0, max: 1, step: 0.05 },
      { label: 'pause min (s)', path: 'patrolPauseMin', min: 0, max: 5, step: 0.1 },
      { label: 'pause max (s)', path: 'patrolPauseMax', min: 0, max: 8, step: 0.1 },
      { label: 'rescore (s)', path: 'patrolRescoreSeconds', min: 0.1, max: 5, step: 0.1 },
      { label: 'overtake margin', path: 'patrolOvertakeMargin', min: 0, max: 2, step: 0.05 },
    ],
  },
  {
    title: 'pursuit',
    knobs: [
      { label: 'LKP lead (s)', path: 'lkpLeadSeconds', min: 0, max: 3, step: 0.1 },
      { label: 'intercept lead (s)', path: 'interceptLead', min: 0, max: 3, step: 0.1 },
      { label: 'intercept min speed', path: 'interceptMinSpeed', min: 0, max: 6, step: 0.1 },
      { label: 'search radius', path: 'searchRadius', min: 0, max: 20, step: 0.5 },
      { label: 'search growth', path: 'searchRadiusGrowth', min: 0, max: 15, step: 0.5 },
      { label: 'peek hold (s)', path: 'peekHoldSeconds', min: 0, max: 3, step: 0.1 },
      { label: 'lunge range', path: 'lungeRange', min: 0, max: 6, step: 0.1 },
      { label: 'lunge speed', path: 'lungeSpeed', min: 0, max: 12, step: 0.1 },
      { label: 'lunge duration', path: 'lungeDuration', min: 0, max: 3, step: 0.1 },
      { label: 'lunge cooldown', path: 'lungeCooldown', min: 0, max: 8, step: 0.1 },
      { label: 'cross-floor pursuit', path: 'crossFloorPursuit', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'pacing',
    knobs: [
      { label: 'memory (s)', path: 'memorySeconds', min: 0, max: 10, step: 0.1 },
      { label: 'investigate linger', path: 'investigateLinger', min: 0, max: 8, step: 0.1 },
      { label: 'lose interest (s)', path: 'loseInterestSeconds', min: 0, max: 8, step: 0.1 },
      { label: 'search prob (light)', path: 'searchProbLightOn', min: 0, max: 1, step: 0.05 },
      { label: 'search prob (dark)', path: 'searchProbLightOff', min: 0, max: 1, step: 0.05 },
      { label: 'grace period (s)', path: 'gracePeriod', min: 0, max: 60, step: 1 },
      { label: 'migration interval', path: 'migrationInterval', min: 10, max: 300, step: 5 },
      { label: 'anti-camp radius', path: 'antiCampRadius', min: 0, max: 10, step: 0.5 },
      { label: 'anti-camp (s)', path: 'antiCampSeconds', min: 0, max: 30, step: 1 },
      { label: 'key-taken speed ×', path: 'keyTakenSpeedFactor', min: 1, max: 2, step: 0.01 },
      { label: 'near-miss mercy', path: 'nearMissMercy', min: 0, max: 20, step: 0.5 },
      { label: 'safe spawn dist', path: 'safeSpawnDistance', min: 0, max: 20, step: 0.5 },
    ],
  },
];

/** Flattened view of every registered knob (for iteration / validation). */
export function allAiKnobs(): AiKnob[] {
  return AI_KNOB_GROUPS.flatMap((g) => g.knobs);
}
