/**
 * Central dev/cheat flags for the in-game tuning overlay. Mutable singleton:
 * the overlay panel writes these, and gameplay reads each at a single
 * DEV-guarded site (so they fold away in production). Pure data — no DOM, no
 * THREE, no config; nothing runs at module load.
 */
export interface DevFlags {
  /** Player can never be caught. */
  invincible: boolean;
  /** Enemies never see the player (line-of-sight short-circuits). */
  invisible: boolean;
  /** Enemies never hear the player (movement noise forced to 0). */
  inaudible: boolean;
  /** Draw enemy markers on the map overlay. */
  revealEnemies: boolean;
  /** Pending floor-warp request: a floor index to teleport to, consumed and
   *  cleared by the main loop; null when there is nothing to warp. */
  warpFloor: number | null;
}

function defaults(): DevFlags {
  return {
    invincible: false,
    invisible: false,
    inaudible: false,
    revealEnemies: false,
    warpFloor: null,
  };
}

/** The shared instance the overlay mutates and gameplay reads. */
export const devFlags: DevFlags = defaults();

/** Restore every flag to its default, preserving the same object reference. */
export function resetDevFlags(): void {
  Object.assign(devFlags, defaults());
}
