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
    stamina: {
      /** Seconds of continuous sprint from full to empty. */
      drainSeconds: number;
      /** Seconds of not-sprinting to refill from empty to full. */
      regenSeconds: number;
      /** Delay before stamina starts regenerating after sprinting stops, s. */
      regenDelay: number;
      /** After exhaustion, sprint re-enables only once stamina recovers past this fraction. */
      recoverThreshold: number;
    };
  };

  battery: {
    drainSeconds: number;
    chargeRatio: number;
    startCharge: number;
  };

  /** Mobile touch controls (only active on phones — see Platform.isMobile). */
  touch: {
    /** Radians of view rotation per pixel of look-zone drag. */
    lookSensitivity: number;
    /** Joystick travel (px) from origin to full deflection. */
    joystickRadius: number;
    /** Fraction of the radius treated as a centered dead-zone. */
    joystickDeadZone: number;
  };

  /** VR controller input (only active in an XR session). */
  vr: {
    /** Trigger/button pressed-value threshold (0..1). */
    triggerThreshold: number;
    /** Stick magnitude below which movement is ignored (drift dead-zone). */
    stickDeadZone: number;
  };

  ai: {
    /** Sight range (m) when the player's flashlight is ON — the beam betrays you. */
    visionLightOn: number;
    /** Sight range (m) in darkness — the player's friend. */
    visionLightOff: number;
    /** Detection range multiplier while the player crouches. */
    visionCrouchFactor: number;
    /** Extra vision-range multiplier when the player is crouched AND within
     *  coverBonusRadius (m) of a prop/cover cell — stacks on visionCrouchFactor. */
    coverVisionFactor: number;
    coverBonusRadius: number;
    /** Full vision cone width in degrees. */
    coneDegrees: number;
    /** Inside this range (m) detection is omnidirectional. */
    proximitySense: number;
    /** Hearing radii (m) by noise level. */
    hearCrouch: number;
    hearWalk: number;
    hearSprint: number;
    hearChargingHum: number;
    /** Speeds (m/s). Chase MUST stay below player sprint. */
    patrolSpeed: number;
    investigateSpeed: number;
    chaseSpeed: number;
    /** Seconds of lost sight before the chase degrades to investigate. */
    memorySeconds: number;
    /** Seconds spent looking around at an investigation point. */
    investigateLinger: number;
    /** Seconds idling after losing interest before resuming patrol. */
    loseInterestSeconds: number;
    /** Discovery probabilities for an unwitnessed hide (light state at entry). */
    searchProbLightOn: number;
    searchProbLightOff: number;
    /** Seconds enemies stay passive at run start. */
    gracePeriod: number;
    /** Mean seconds between optional floor migrations. */
    migrationInterval: number;
    /** Anti-camp: displaced after lingering this close to exits/key this long. */
    antiCampRadius: number;
    antiCampSeconds: number;
    /** Speed multiplier applied once the key is taken. */
    keyTakenSpeedFactor: number;
    /** Calm seconds granted after the player escapes a chase. */
    nearMissMercy: number;
    /** Decisive final pounce: within lungeRange (m) of a seen player the chaser
     *  bursts at lungeSpeed (above sprint) for lungeDuration (s), then must wait
     *  lungeCooldown (s) before pouncing again. */
    lungeRange: number;
    lungeSpeed: number;
    lungeDuration: number;
    lungeCooldown: number;
    /** At run start, a same-floor enemy this close to the player (m) — or in the
     *  player's room — is relocated away and aimed away. */
    safeSpawnDistance: number;
    /** Probability (0..1) a chaser commits to following the player across a
     *  stair boundary to another floor instead of giving up at the threshold.
     *  Rolled once each time the fleeing player leaves the chaser's floor. */
    crossFloorPursuit: number;
  };

  enemy: {
    /** Within this distance (m) the face turns menacing. */
    threatRadius: number;
    /** Seconds a mood is held before it may flip back (anti-flicker). */
    expressionHold: number;
    /** Contact distance (m) that triggers the catch. */
    contactRadius: number;
    /** Jumpscare beats, seconds. */
    jumpscareTurn: number;
    jumpscareLunge: number;
    /** Red wash before the cut to black (suggests blood, no gore). */
    jumpscareRedFade: number;
    jumpscareBlackout: number;
  };

  passage: {
    /** Seconds for a pried vent grille to fold up to the ceiling. */
    ventFoldSeconds: number;
  };

  weather: {
    /** Steady rain strength 0..1 (drives glass rain + rain audio). */
    rainIntensity: number;
    /** Mean seconds between lightning strikes, and the +/- jitter around it. */
    strikeIntervalMean: number;
    strikeIntervalJitter: number;
    /** Peak per-window flash-light intensity at a strike (short range; lights
     *  the area by each window, not the whole house). */
    flashIntensity: number;
    /** Seconds for a flash to decay from full back to dark. */
    flashDecaySeconds: number;
  };

  audio: {
    /** Rain bed gain at a window (close) vs far from any window. */
    rainMaxGain: number;
    rainMinGain: number;
    /** Distance (m) over which rain fades from max (at glass) to min. */
    rainWindowFalloff: number;
    /** Music bed base gain + the extra it swells by as the enemy closes. */
    musicBaseGain: number;
    musicSwellMax: number;
    /** Enemy distance (m) at/under which the swell ramps in. */
    musicSwellRange: number;
    /** Thunder after a lightning flash: delay range (s) + peak gain. */
    thunderDelayMin: number;
    thunderDelayMax: number;
    thunderGain: number;
  };

  visibility: {
    /** Hex color + intensity of the global gloom (never zero — "not pitch black"). */
    ambientColor: number;
    ambientIntensity: number;
    hemisphereIntensity: number;
    /** Per-floor ambient/hemisphere intensity (basement darkest). */
    ambientIntensityByFloor: [number, number, number, number];
    hemisphereIntensityByFloor: [number, number, number, number];
    /** FogExp2 density per floor index (basement, main, upstairs, attic). */
    fogDensityByFloor: [number, number, number, number];
    fogColor: number;
    toneExposure: number;
    /** scene.environment (HDRI/IBL) contribution. Kept LOW so the unlit scene
     *  stays dark — IBL adds material realism, not visibility. */
    environmentIntensity: number;
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
    stamina: {
      drainSeconds: 6, // ~6 s of all-out sprint
      regenSeconds: 9, // a bit slower to recover than to burn
      regenDelay: 0.8,
      recoverThreshold: 0.3, // must recover to 30% before sprinting again
    },
  },

  visibility: {
    ambientColor: 0x2a3045,
    ambientIntensity: 0.55,
    hemisphereIntensity: 0.22,
    // Deep darkness: the flashlight is the only real light. Ambient/hemisphere
    // are cut to a near-black floor — just enough to read silhouettes; the
    // charging-station LEDs and faint windows are the navigation beacons.
    // Basement darkest; attic a touch dim; main/upstairs a hair more.
    ambientIntensityByFloor: [0.035, 0.06, 0.06, 0.045],
    hemisphereIntensityByFloor: [0.015, 0.025, 0.025, 0.02],
    fogDensityByFloor: [0.16, 0.11, 0.12, 0.15],
    fogColor: 0x05060a,
    toneExposure: 1.0,
    environmentIntensity: 0.05, // subtle reflectance only — must not lift the gloom
  },

  battery: {
    /** Seconds of continuous flashlight use from full to empty. Playtest-tunable. */
    drainSeconds: 90,
    /**
     * Recharging takes this many times longer than draining — near-parity so a
     * full charge (~108 s) is nearly as costly as a full drain. Must stay ≥ 1
     * (charging never out-paces draining). Playtest-tunable.
     */
    chargeRatio: 1.2,
    /** Run-start charge fraction. */
    startCharge: 1.0,
  },

  touch: {
    // Radians of view rotation per pixel of look-drag. Tuned high so a short
    // thumb-swipe turns you most of the way around (mobile FPS feel).
    lookSensitivity: 0.012,
    joystickRadius: 70,
    joystickDeadZone: 0.15,
  },

  vr: {
    triggerThreshold: 0.5,
    stickDeadZone: 0.15,
  },

  ai: {
    visionLightOn: 14,
    visionLightOff: 5,
    visionCrouchFactor: 0.7,
    coverVisionFactor: 0.6, // crouched against cover: a further 40% range cut
    coverBonusRadius: 2.5,
    coneDegrees: 150,
    proximitySense: 1.8,
    hearCrouch: 2.5,
    hearWalk: 6,
    hearSprint: 13,
    hearChargingHum: 9,
    patrolSpeed: 1.6,
    investigateSpeed: 2.7,
    chaseSpeed: 4.5,
    memorySeconds: 2.5, // short: breaking line of sight is a real escape
    investigateLinger: 2,
    loseInterestSeconds: 1.5,
    searchProbLightOn: 0.75,
    searchProbLightOff: 0.25,
    gracePeriod: 20,
    migrationInterval: 100,
    antiCampRadius: 4,
    antiCampSeconds: 12,
    keyTakenSpeedFactor: 1.12,
    nearMissMercy: 6,
    // Decisive pounce: a short burst above sprint speed so a cornered or
    // close player gets caught, then a cooldown so it isn't a constant sprint.
    lungeRange: 2.4,
    lungeSpeed: 6.6,
    lungeDuration: 0.5,
    lungeCooldown: 2.2,
    safeSpawnDistance: 8,
    crossFloorPursuit: 0.55, // anchor (≈ Medium/Hard midpoint); presets scale per level
  },

  enemy: {
    threatRadius: 5,
    expressionHold: 0.6,
    contactRadius: 1.0,
    jumpscareTurn: 0.12,
    jumpscareLunge: 0.55, // snappier rush so the face slams into frame
    jumpscareRedFade: 0.4,
    jumpscareBlackout: 0.5,
  },

  passage: {
    ventFoldSeconds: 0.6,
  },

  weather: {
    rainIntensity: 0.7,
    strikeIntervalMean: 17, // a strike every ~8-26 s
    strikeIntervalJitter: 9,
    flashIntensity: 12.0, // peak per-window flash-light spill (short range, falls off fast)
    flashDecaySeconds: 0.45,
  },

  audio: {
    rainMaxGain: 0.18, // right by a window (kept soft)
    rainMinGain: 0.04, // deep inside / windowless
    rainWindowFalloff: 9,
    musicBaseGain: 0.5,
    musicSwellMax: 0.5, // bed up to ~1.0 when an enemy is right on you
    musicSwellRange: 14,
    thunderDelayMin: 0.4, // crack feels connected to the flash
    thunderDelayMax: 2.4,
    thunderGain: 0.7,
  },

  flashlight: {
    color: 0xffe3b0,
    intensity: 60,
    range: 26,
    angle: 0.52,
    penumbra: 0.9, // soft cone edge — the circle of light fades gently at its rim
    swayLag: 9,
    lowThreshold: 0.18,
  },
};
