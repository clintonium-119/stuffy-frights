import { GameConfig } from '../core/config';

/**
 * Pure per-floor visibility selection, shared by the game (main.ts) and the dev
 * floors editor's preview so they can't drift. No three/DOM — unit-testable.
 */
type Visibility = GameConfig['visibility'];

/** A difficulty's partial per-floor visibility override (from DIFFICULTY_PRESETS). */
export type VisibilityOverride = Partial<
  Pick<Visibility, 'ambientIntensityByFloor' | 'hemisphereIntensityByFloor'>
>;

/** The visibility values that apply on a given floor. */
export interface FloorVisibility {
  ambient: number;
  hemisphere: number;
  fogDensity: number;
}

function clampFloor(length: number, floorIndex: number): number {
  const fi = Math.trunc(floorIndex);
  if (!Number.isFinite(fi) || fi < 0) return 0;
  return Math.min(length - 1, fi);
}

/** Ambient / hemisphere / fog-density for `floorIndex` (clamped to range). */
export function floorVisibilityTargets(v: Visibility, floorIndex: number): FloorVisibility {
  const fi = clampFloor(v.ambientIntensityByFloor.length, floorIndex);
  return {
    ambient: v.ambientIntensityByFloor[fi],
    hemisphere: v.hemisphereIntensityByFloor[fi],
    fogDensity: v.fogDensityByFloor[fi],
  };
}

/**
 * Overlay a difficulty's per-floor override (the two intensity arrays) onto the
 * baseline; all other visibility fields stay from baseline. No override (e.g.
 * Medium) → the baseline unchanged.
 */
export function effectiveVisibility(baseline: Visibility, override?: VisibilityOverride): Visibility {
  if (!override) return baseline;
  return {
    ...baseline,
    ...(override.ambientIntensityByFloor
      ? { ambientIntensityByFloor: override.ambientIntensityByFloor }
      : {}),
    ...(override.hemisphereIntensityByFloor
      ? { hemisphereIntensityByFloor: override.hemisphereIntensityByFloor }
      : {}),
  };
}
