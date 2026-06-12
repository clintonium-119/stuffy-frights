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
};
