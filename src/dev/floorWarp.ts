import { FLOOR_NAMES } from '../world/layoutTypes';
import { NavGraph, NavNodeId } from '../ai/NavGraph';

/** Clamp a (possibly out-of-range / fractional) floor request to a valid index. */
export function clampFloor(floor: number): number {
  return Math.max(0, Math.min(FLOOR_NAMES.length - 1, Math.round(floor)));
}

/**
 * Pick a walkable nav node to warp the player onto for a floor — mirrors the
 * `?floor=N` boot spawn (a random node on the requested, clamped floor). Returns
 * null only if the floor has no nav nodes. The caller converts the node to world
 * space (`world.markerWorld`) and teleports.
 */
export function floorWarpNode(nav: NavGraph, floor: number, rng: { next(): number }): NavNodeId | null {
  return nav.randomNodeOnFloor(clampFloor(floor), rng);
}
