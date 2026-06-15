import { describe, it, expect } from 'vitest';
import { floorVisibilityTargets, effectiveVisibility } from './floorVisibility';
import { config } from '../core/config';

const V = config.visibility;

describe('floorVisibilityTargets', () => {
  it('returns the indexed values for each floor', () => {
    for (let fi = 0; fi < 4; fi++) {
      const t = floorVisibilityTargets(V, fi);
      expect(t.ambient).toBe(V.ambientIntensityByFloor[fi]);
      expect(t.hemisphere).toBe(V.hemisphereIntensityByFloor[fi]);
      expect(t.fogDensity).toBe(V.fogDensityByFloor[fi]);
    }
  });

  it('clamps an out-of-range floor index without NaN/throw', () => {
    expect(floorVisibilityTargets(V, -2).ambient).toBe(V.ambientIntensityByFloor[0]);
    expect(floorVisibilityTargets(V, 99).ambient).toBe(V.ambientIntensityByFloor[3]);
    expect(Number.isFinite(floorVisibilityTargets(V, NaN).ambient)).toBe(true);
  });
});

describe('effectiveVisibility', () => {
  it('overlays only the two override arrays, preserving baseline-only fields', () => {
    const override = {
      ambientIntensityByFloor: [0.1, 0.2, 0.3, 0.4] as [number, number, number, number],
      hemisphereIntensityByFloor: [0.01, 0.02, 0.03, 0.04] as [number, number, number, number],
    };
    const eff = effectiveVisibility(V, override);
    expect(eff.ambientIntensityByFloor).toEqual(override.ambientIntensityByFloor);
    expect(eff.hemisphereIntensityByFloor).toEqual(override.hemisphereIntensityByFloor);
    // baseline-only fields untouched
    expect(eff.fogDensityByFloor).toBe(V.fogDensityByFloor);
    expect(eff.fogColor).toBe(V.fogColor);
    expect(eff.toneExposure).toBe(V.toneExposure);
    expect(eff.environmentIntensity).toBe(V.environmentIntensity);
  });

  it('returns the baseline unchanged when there is no override (Medium path)', () => {
    expect(effectiveVisibility(V, undefined)).toBe(V);
  });

  it('overlays a partial override (only ambient)', () => {
    const eff = effectiveVisibility(V, { ambientIntensityByFloor: [9, 9, 9, 9] as [number, number, number, number] });
    expect(eff.ambientIntensityByFloor).toEqual([9, 9, 9, 9]);
    expect(eff.hemisphereIntensityByFloor).toBe(V.hemisphereIntensityByFloor);
  });
});
