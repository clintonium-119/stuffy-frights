import { RigConfig, BoneBox } from '../enemies/rigWeights';

/**
 * Pure helpers for the dev rig edit mode: mapping between normalized-bbox coords
 * [0..1] and world space (to place gizmos), clamping edited boxes, and
 * serializing an edited rig back to a `rigConfig` literal to paste. No three.js /
 * DOM so it's unit-testable.
 */
export type Vec3 = [number, number, number];

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** Normalized [0..1] bbox coord → world position. */
export function worldFromNorm(n: Vec3, min: Vec3, size: Vec3): Vec3 {
  return [min[0] + n[0] * size[0], min[1] + n[1] * size[1], min[2] + n[2] * size[2]];
}

/** World position → normalized [0..1] bbox coord (size 0 → 0). */
export function normFromWorld(w: Vec3, min: Vec3, size: Vec3): Vec3 {
  return [
    size[0] ? (w[0] - min[0]) / size[0] : 0,
    size[1] ? (w[1] - min[1]) / size[1] : 0,
    size[2] ? (w[2] - min[2]) / size[2] : 0,
  ];
}

/** Clamp a box to [0,1] per axis and keep min < max by at least `gap`. */
export function clampBox(box: BoneBox, gap = 0.02): BoneBox {
  const min: Vec3 = [0, 0, 0];
  const max: Vec3 = [0, 0, 0];
  for (let a = 0; a < 3; a++) {
    let lo = clamp01(box.min[a]);
    let hi = clamp01(box.max[a]);
    if (hi - lo < gap) {
      const mid = (lo + hi) / 2;
      lo = clamp01(mid - gap / 2);
      hi = clamp01(mid + gap / 2);
      if (hi - lo < gap) hi = clamp01(lo + gap); // hit the [0,1] edge
    }
    min[a] = lo;
    max[a] = hi;
  }
  return { min, max };
}

const n3 = (v: readonly number[]): string => `[${v.map((x) => +x.toFixed(3)).join(', ')}]`;

/** Serialize one model's edited bones to a `rigConfig`-pasteable TS literal. */
export function serializeRig(model: string, bones: RigConfig): string {
  const lines = bones.map((b) => {
    const parts = [`name: '${b.name}'`, `pivot: ${n3(b.pivot)}`];
    if (b.box) parts.push(`box: { min: ${n3(b.box.min)}, max: ${n3(b.box.max)} }`);
    if (b.falloff !== undefined) parts.push(`falloff: ${+b.falloff.toFixed(3)}`);
    return `    { ${parts.join(', ')} },`;
  });
  return `  ${model}: [\n${lines.join('\n')}\n  ],`;
}
