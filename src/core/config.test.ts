import { describe, it, expect } from 'vitest';
import { config } from './config';
import { floorVisibilityTargets } from '../world/floorVisibility';
import { house } from '../world/houseLayout';

describe('config invariants', () => {
  it('resolves a defined per-floor visibility target for every floor (bounds-safe)', () => {
    for (let f = 0; f < house.grids.length; f++) {
      const t = floorVisibilityTargets(config.visibility, f);
      expect(Number.isFinite(t.ambient), `ambient @floor ${f}`).toBe(true);
      expect(Number.isFinite(t.hemisphere), `hemisphere @floor ${f}`).toBe(true);
      expect(Number.isFinite(t.fogDensity), `fogDensity @floor ${f}`).toBe(true);
    }
    // Indices past the array (e.g. a taller authored house) clamp to the last
    // entry rather than returning undefined; negatives clamp to floor 0.
    expect(Number.isFinite(floorVisibilityTargets(config.visibility, 99).ambient)).toBe(true);
    expect(Number.isFinite(floorVisibilityTargets(config.visibility, -3).ambient)).toBe(true);
  });


  it('keeps image-based lighting gated low so darkness is preserved', () => {
    // IBL adds material realism, not visibility — must stay a small fraction.
    expect(config.visibility.environmentIntensity).toBeGreaterThan(0);
    expect(config.visibility.environmentIntensity).toBeLessThanOrEqual(0.15);
  });

  it('the basement is the darkest floor', () => {
    const amb = config.visibility.ambientIntensityByFloor;
    expect(Math.min(...amb)).toBe(amb[0]); // floor 0 = basement
  });

  it('keeps non-flashlight fill at a deep-darkness budget on every floor', () => {
    // The flashlight must be the only real light: ambient/hemisphere stay tiny
    // so the unlit scene is barely navigable (faint silhouettes only).
    for (const a of config.visibility.ambientIntensityByFloor) {
      expect(a).toBeGreaterThan(0); // never pitch black — silhouettes survive
      expect(a).toBeLessThanOrEqual(0.15);
    }
    for (const h of config.visibility.hemisphereIntensityByFloor) {
      expect(h).toBeLessThanOrEqual(0.08);
    }
  });

  it('vent grilles fold open over a brief, positive duration', () => {
    expect(config.passage.ventFoldSeconds).toBeGreaterThan(0);
    expect(config.passage.ventFoldSeconds).toBeLessThanOrEqual(2);
  });
});
