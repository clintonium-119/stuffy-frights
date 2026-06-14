/**
 * Pure procedural-articulation math, shared by every stuffy and unit-tested
 * headlessly. The body classes own the bone groups; these helpers decide the
 * angles/offsets, so there's no Three.js scene dependency in the logic.
 *
 * Model-forward convention: a stuffy faces +Z at `bodyYaw === 0`, matching the
 * facing used by EnemyBase movement.
 */

export interface GazeInput {
  /** Head world position. */
  headX: number;
  headY: number;
  headZ: number;
  /** Look target (the player) world position. */
  targetX: number;
  targetY: number;
  targetZ: number;
  /** The body's current yaw (group.rotation.y). */
  bodyYaw: number;
  /** Clamp half-cones (radians). */
  maxYaw: number;
  maxPitch: number;
}

export interface GazeResult {
  /** Local head yaw (about Y), relative to the body facing, clamped. */
  yaw: number;
  /** Local head pitch (about X); negative looks down, clamped. */
  pitch: number;
}

export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/**
 * Aim a head's local +Z at a world target. Yaw is taken relative to the body's
 * facing and clamped to a believable cone; pitch tips the head down/up toward
 * the target (so a crouched/low player drives a look-down). Easing toward the
 * result is the caller's job.
 */
export function solveGaze(i: GazeInput): GazeResult {
  const dx = i.targetX - i.headX;
  const dy = i.targetY - i.headY;
  const dz = i.targetZ - i.headZ;
  const horiz = Math.hypot(dx, dz) || 1e-5;
  // Yaw that points +Z toward (dx,dz); make it relative to the body facing.
  const worldYaw = Math.atan2(dx, dz);
  const yaw = clamp(wrapAngle(worldYaw - i.bodyYaw), -i.maxYaw, i.maxYaw);
  // Pitch as a Three.js rotation.x: positive tips the head's +Z downward, so a
  // target BELOW the head (dy < 0) yields positive pitch (look down).
  const pitch = clamp(Math.atan2(-dy, horiz), -i.maxPitch, i.maxPitch);
  return { yaw, pitch };
}

export interface FootInput {
  /** Floor height directly under this foot (world Y). */
  groundUnderFoot: number;
  /** Reference floor height under the body's centre (world Y). */
  groundUnderBody: number;
  /** Max vertical adjust (clamp), so a bad sample can't fling a leg. */
  maxLift: number;
}

/**
 * Vertical offset to add to a leg so its foot meets the surface beneath it,
 * relative to the body's reference ground. Going up stairs the leading legs
 * lift; descending they drop. Clamped.
 */
export function solveFootLift(i: FootInput): number {
  return clamp(i.groundUnderFoot - i.groundUnderBody, -i.maxLift, i.maxLift);
}

/**
 * Body pitch (about X) from front/back foot-lift difference, so the torso tips
 * with the slope on stairs. Positive tips the front up (ascending).
 */
export function bodyPitchFromFeet(frontLift: number, backLift: number, wheelbase: number): number {
  return Math.atan2(frontLift - backLift, Math.max(0.05, wheelbase));
}
