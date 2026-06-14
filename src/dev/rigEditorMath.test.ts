import { describe, it, expect } from 'vitest';
import { worldFromNorm, normFromWorld, clampBox, clamp01, serializeRig, Vec3 } from './rigEditorMath';
import { RigConfig } from '../enemies/rigWeights';

describe('rigEditorMath', () => {
  const min: Vec3 = [-1, 0, -0.5];
  const size: Vec3 = [2, 3, 1];

  it('round-trips normalized ↔ world', () => {
    const n: Vec3 = [0.25, 0.5, 0.8];
    const w = worldFromNorm(n, min, size);
    const back = normFromWorld(w, min, size);
    for (let a = 0; a < 3; a++) expect(back[a]).toBeCloseTo(n[a], 6);
  });

  it('normFromWorld handles zero-size axis without NaN', () => {
    expect(normFromWorld([5, 0, 0], [0, 0, 0], [0, 0, 0])).toEqual([0, 0, 0]);
  });

  it('clamp01 bounds to [0,1]', () => {
    expect(clamp01(-0.3)).toBe(0);
    expect(clamp01(1.4)).toBe(1);
    expect(clamp01(0.5)).toBe(0.5);
  });

  it('clampBox keeps values in [0,1] and min < max', () => {
    const b = clampBox({ min: [-0.2, 0.9, 0.5], max: [0.3, 0.92, 1.4] });
    for (let a = 0; a < 3; a++) {
      expect(b.min[a]).toBeGreaterThanOrEqual(0);
      expect(b.max[a]).toBeLessThanOrEqual(1);
      expect(b.max[a] - b.min[a]).toBeGreaterThanOrEqual(0.02 - 1e-9);
    }
  });

  it('clampBox separates a collapsed (min==max) axis', () => {
    const b = clampBox({ min: [0.5, 0.5, 0.5], max: [0.5, 0.5, 0.5] });
    expect(b.max[0] - b.min[0]).toBeGreaterThanOrEqual(0.02 - 1e-9);
  });

  it('serializeRig emits a parseable bone literal with box + falloff', () => {
    const bones: RigConfig = [
      { name: 'root', pivot: [0.5, 0.5, 0.5] },
      { name: 'head', pivot: [0.5, 0.8, 0.5], box: { min: [0.2, 0.7, 0.2], max: [0.8, 1, 0.8] }, falloff: 0.1 },
    ];
    const out = serializeRig('pou', bones);
    expect(out).toContain("name: 'root'");
    expect(out).toContain("name: 'head'");
    expect(out).toContain('box: { min: [0.2, 0.7, 0.2], max: [0.8, 1, 0.8] }');
    expect(out).toContain('falloff: 0.1');
    // root has no box
    expect(out.split('\n')[1]).not.toContain('box:');
  });
});
