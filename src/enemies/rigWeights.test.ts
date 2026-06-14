import { describe, it, expect } from 'vitest';
import { boxWeight, vertexBoneWeights, RigConfig, BoneBox } from './rigWeights';

const box = (min: [number, number, number], max: [number, number, number]): BoneBox => ({ min, max });

describe('boxWeight', () => {
  const b = box([0.3, 0.3, 0.3], [0.7, 0.7, 0.7]);
  it('is 1 inside the box core', () => {
    expect(boxWeight(0.5, 0.5, 0.5, b, 0.1)).toBeCloseTo(1, 6);
  });
  it('is 0 beyond the falloff band', () => {
    expect(boxWeight(0.1, 0.5, 0.5, b, 0.1)).toBeCloseTo(0, 6); // 0.1 < 0.3-0.1
    expect(boxWeight(0.5, 0.5, 0.95, b, 0.1)).toBeCloseTo(0, 6); // 0.95 > 0.7+0.1
  });
  it('eases between core and edge (monotonic falloff)', () => {
    const near = boxWeight(0.27, 0.5, 0.5, b, 0.1); // just outside min
    const far = boxWeight(0.23, 0.5, 0.5, b, 0.1); // further outside
    expect(near).toBeGreaterThan(far);
    expect(near).toBeLessThan(1);
    expect(far).toBeGreaterThanOrEqual(0);
  });
});

describe('vertexBoneWeights', () => {
  const cfg: RigConfig = [
    { name: 'root', pivot: [0.5, 0.5, 0.5] },
    { name: 'head', pivot: [0.5, 0.8, 0.5], box: box([0.2, 0.7, 0.2], [0.8, 1.0, 0.8]), falloff: 0.05 },
    { name: 'armL', pivot: [0.2, 0.5, 0.5], box: box([0.0, 0.4, 0.2], [0.35, 0.6, 0.8]), falloff: 0.05 },
  ];

  it('fully weights a vertex inside one bone box to that bone', () => {
    const w = vertexBoneWeights(0.5, 0.85, 0.5, cfg); // in head box
    expect(w[1]).toBeCloseTo(1, 5); // head
    expect(w[0]).toBeCloseTo(0, 5); // root
    expect(w[2]).toBeCloseTo(0, 5); // armL
  });

  it('weights a vertex outside all boxes fully to the root', () => {
    const w = vertexBoneWeights(0.9, 0.1, 0.9, cfg);
    expect(w[0]).toBeCloseTo(1, 5);
    expect(w[1]).toBeCloseTo(0, 5);
    expect(w[2]).toBeCloseTo(0, 5);
  });

  it('always produces a weight row that sums to 1 (rest pose reproduces the source under LBS)', () => {
    for (let i = 0; i < 50; i++) {
      const nx = (i * 7) % 100 / 100;
      const ny = (i * 13) % 100 / 100;
      const nz = (i * 29) % 100 / 100;
      const w = vertexBoneWeights(nx, ny, nz, cfg);
      const sum = w.reduce((a, x) => a + x, 0);
      expect(sum).toBeCloseTo(1, 5);
    }
  });

  it('normalizes overlapping boxes (non-root never exceeds 1; root drops to 0)', () => {
    const overlap: RigConfig = [
      { name: 'root', pivot: [0.5, 0.5, 0.5] },
      { name: 'a', pivot: [0.5, 0.5, 0.5], box: box([0.0, 0.0, 0.0], [1, 1, 1]) },
      { name: 'b', pivot: [0.5, 0.5, 0.5], box: box([0.0, 0.0, 0.0], [1, 1, 1]) },
    ];
    const w = vertexBoneWeights(0.5, 0.5, 0.5, overlap);
    expect(w[0]).toBeCloseTo(0, 5);
    expect(w[1] + w[2]).toBeCloseTo(1, 5);
  });
});
