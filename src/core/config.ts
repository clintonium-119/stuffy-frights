/**
 * Every gameplay-balance number lives here. Systems import constants;
 * the final balance pass edits only this file.
 */
export interface GameConfig {
  /** Fixed simulation timestep in seconds (60 Hz). */
  timestep: number;
  /** Max fixed substeps per rendered frame (spiral-of-death guard). */
  maxSubsteps: number;

  player: {
    walkSpeed: number; // m/s
    sprintSpeed: number; // m/s
    crawlSpeed: number; // m/s
    eyeHeightStanding: number; // m
    eyeHeightCrouched: number; // m
    radius: number; // capsule radius, m
    stepUpHeight: number; // max climbable ledge, m
    lookSensitivity: number; // rad per mouse px
    crouchLerpSpeed: number; // eye-height interpolation speed, 1/s
  };

  battery: {
    drainSeconds: number;
    chargeRatio: number;
    startCharge: number;
  };

  visibility: {
    /** Hex color + intensity of the global gloom (never zero — "not pitch black"). */
    ambientColor: number;
    ambientIntensity: number;
    hemisphereIntensity: number;
    /** FogExp2 density per floor index (basement, main, upstairs, attic). */
    fogDensityByFloor: [number, number, number, number];
    fogColor: number;
    toneExposure: number;
  };

  flashlight: {
    color: number;
    intensity: number;
    /** Spot reach in meters. */
    range: number;
    /** Cone half-angle in radians. */
    angle: number;
    penumbra: number;
    /** How quickly the beam catches up to the view (1/s) — handheld lag. */
    swayLag: number;
    /** Battery fraction below which the dim/flicker warning begins. */
    lowThreshold: number;
  };
}

export const config: GameConfig = {
  timestep: 1 / 60,
  maxSubsteps: 5,

  player: {
    walkSpeed: 3.0,
    sprintSpeed: 5.2,
    crawlSpeed: 1.4,
    eyeHeightStanding: 1.6,
    eyeHeightCrouched: 0.85,
    radius: 0.35,
    stepUpHeight: 0.28,
    lookSensitivity: 0.0023,
    crouchLerpSpeed: 8,
  },

  visibility: {
    ambientColor: 0x2a3045,
    ambientIntensity: 0.55,
    hemisphereIntensity: 0.22,
    fogDensityByFloor: [0.13, 0.09, 0.1, 0.14],
    fogColor: 0x05060a,
    toneExposure: 1.0,
  },

  battery: {
    /** Seconds of continuous flashlight use from full to empty. */
    drainSeconds: 150,
    /** Recharging takes this many times longer than draining. */
    chargeRatio: 3,
    /** Run-start charge fraction. */
    startCharge: 1.0,
  },

  flashlight: {
    color: 0xffe3b0,
    intensity: 60,
    range: 26,
    angle: 0.46,
    penumbra: 0.55,
    swayLag: 9,
    lowThreshold: 0.18,
  },
};
