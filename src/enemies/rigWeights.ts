/**
 * Pure region-box skin-weight math for the AI-mesh rig. A bone owns a 3D
 * weight-region box in normalized bbox coords [0..1]; a vertex inside the box is
 * fully that bone's, easing smoothly to 0 over a falloff band just outside each
 * face. The root (bones[0], no box) holds the remainder so every vertex stays
 * attached. No three.js / DOM here so it's unit-testable.
 */
export interface BoneBox {
  /** Normalized-bbox min corner [x,y,z] in [0,1]. */
  min: [number, number, number];
  /** Normalized-bbox max corner [x,y,z] in [0,1]. */
  max: [number, number, number];
}
export interface BoneConfig {
  name: string;
  /** Bone pivot in normalized bbox coords [0..1]. */
  pivot: [number, number, number];
  /** Weight region in normalized bbox coords; omit for the root. */
  box?: BoneBox;
  /** Falloff band width (normalized) outside the box edges. Default 0.08. */
  falloff?: number;
}
/** bones[0] is the root/body (boxless — holds the remainder weight). */
export type RigConfig = BoneConfig[];

export const DEFAULT_FALLOFF = 0.08;

const smooth = (e0: number, e1: number, x: number): number => {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Per-axis membership: 1 within [lo,hi], smooth falloff to 0 over `f` outside. */
function axisWeight(v: number, lo: number, hi: number, f: number): number {
  if (v >= lo && v <= hi) return 1;
  if (v < lo) return smooth(lo - f, lo, v);
  return 1 - smooth(hi, hi + f, v);
}

/** Weight (0..1) of a normalized point for a box: product of the three axes. */
export function boxWeight(
  nx: number,
  ny: number,
  nz: number,
  box: BoneBox,
  falloff: number = DEFAULT_FALLOFF
): number {
  return (
    axisWeight(nx, box.min[0], box.max[0], falloff) *
    axisWeight(ny, box.min[1], box.max[1], falloff) *
    axisWeight(nz, box.min[2], box.max[2], falloff)
  );
}

/**
 * Weight row over the bones for a vertex at normalized coords. Non-root bones
 * get their box weight; the root (index 0) holds the remainder so the row sums
 * to 1. If non-root weights exceed 1 (overlapping boxes) they're normalized and
 * the root drops to 0.
 */
export function vertexBoneWeights(
  nx: number,
  ny: number,
  nz: number,
  bones: RigConfig
): Float32Array {
  const n = bones.length;
  const w = new Float32Array(n);
  let nonRoot = 0;
  for (let b = 1; b < n; b++) {
    const box = bones[b].box;
    const ww = box ? boxWeight(nx, ny, nz, box, bones[b].falloff ?? DEFAULT_FALLOFF) : 0;
    w[b] = ww;
    nonRoot += ww;
  }
  if (nonRoot > 1) {
    for (let b = 1; b < n; b++) w[b] /= nonRoot;
    w[0] = 0;
  } else {
    w[0] = 1 - nonRoot;
  }
  return w;
}

export { smooth };
