import * as THREE from 'three';
import { RigConfig, vertexBoneWeights, smooth } from './rigWeights';

/**
 * Builds a `THREE.SkinnedMesh` from an AI-mesh + a per-creature rig config.
 * Bones are placed at normalized-bbox pivots; each vertex is weighted to the
 * bones by their weight-region boxes (root holds the remainder), then the
 * weights are welded + Laplacian-smoothed across the topology and reduced to
 * top-4 linear-blend skinning. The bind is faithful: with zero articulation the
 * mesh reproduces the source exactly (no rest rotations are baked). The existing
 * articulation then drives the returned bones (head gaze, per-leg stair
 * placement, arm-walk, etc.).
 */
export interface RigOptions {
  /** Laplacian weight-smoothing iterations over welded topology (default 12). */
  smoothIters?: number;
  /** Smoothing strength per iteration, 0..1 (default 0.5). */
  smoothLambda?: number;
}
export interface RigResult {
  skinned: THREE.SkinnedMesh;
  bones: Record<string, THREE.Bone>;
}

export function rigMesh(mesh: THREE.Mesh, config: RigConfig, opts: RigOptions = {}): RigResult {
  const g = mesh.geometry as THREE.BufferGeometry;
  if (!g.attributes.normal) g.computeVertexNormals();
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  const min = bb.min;
  const size = new THREE.Vector3().subVectors(bb.max, bb.min);
  const sx = size.x || 1;
  const sy = size.y || 1;
  const sz = size.z || 1;
  const pos = g.attributes.position;
  const count = pos.count;
  const nB = config.length;

  // --- 1. raw per-vertex weights from the region boxes (root = remainder) ---
  const W = new Float32Array(count * nB);
  for (let i = 0; i < count; i++) {
    const nx = (pos.getX(i) - min.x) / sx;
    const ny = (pos.getY(i) - min.y) / sy;
    const nz = (pos.getZ(i) - min.z) / sz;
    const row = vertexBoneWeights(nx, ny, nz, config);
    for (let b = 0; b < nB; b++) W[i * nB + b] = row[b];
  }

  // --- 2. weld vertices by position (so smoothing crosses hard-edge splits) ---
  const weld = new Int32Array(count);
  const weldMap = new Map<string, number>();
  let nW = 0;
  const Q = 1e4;
  for (let i = 0; i < count; i++) {
    const key = `${Math.round(pos.getX(i) * Q)},${Math.round(pos.getY(i) * Q)},${Math.round(pos.getZ(i) * Q)}`;
    let id = weldMap.get(key);
    if (id === undefined) {
      id = nW++;
      weldMap.set(key, id);
    }
    weld[i] = id;
  }
  // group weights = mean of member-vertex weights
  const Wg = new Float32Array(nW * nB);
  const gN = new Float32Array(nW);
  for (let i = 0; i < count; i++) {
    const g0 = weld[i];
    gN[g0]++;
    for (let b = 0; b < nB; b++) Wg[g0 * nB + b] += W[i * nB + b];
  }
  for (let gi = 0; gi < nW; gi++) {
    const n = gN[gi] || 1;
    for (let b = 0; b < nB; b++) Wg[gi * nB + b] /= n;
  }
  // weld-group edges from the triangle index (build adjacency for smoothing)
  const index = g.index ? (g.index.array as ArrayLike<number>) : null;
  const edges: number[] = [];
  if (index) {
    for (let t = 0; t < index.length; t += 3) {
      const a = weld[index[t]];
      const b = weld[index[t + 1]];
      const c = weld[index[t + 2]];
      if (a !== b) edges.push(a, b);
      if (b !== c) edges.push(b, c);
      if (c !== a) edges.push(c, a);
    }
  }

  // --- 3. Laplacian smoothing of the weight field over weld topology ---
  // Light touch: the box falloff already blends joints, and heavy smoothing
  // propagates the body's zero-weight down thin limbs (arms/legs), washing out
  // the hand/foot so only the stub near the pivot moves.
  const iters = index ? (opts.smoothIters ?? 3) : 0;
  const lambda = opts.smoothLambda ?? 0.5;
  for (let it = 0; it < iters; it++) {
    const acc = new Float32Array(nW * nB);
    const cnt = new Float32Array(nW);
    for (let e = 0; e < edges.length; e += 2) {
      const a = edges[e];
      const b = edges[e + 1];
      for (let k = 0; k < nB; k++) {
        acc[a * nB + k] += Wg[b * nB + k];
        acc[b * nB + k] += Wg[a * nB + k];
      }
      cnt[a]++;
      cnt[b]++;
    }
    for (let gi = 0; gi < nW; gi++) {
      const c = cnt[gi];
      if (c <= 0) continue;
      let total = 0;
      for (let k = 0; k < nB; k++) {
        const v = Wg[gi * nB + k] + lambda * (acc[gi * nB + k] / c - Wg[gi * nB + k]);
        Wg[gi * nB + k] = v;
        total += v;
      }
      if (total > 0) for (let k = 0; k < nB; k++) Wg[gi * nB + k] /= total;
    }
  }

  // --- 4. top-4 per vertex from the smoothed weld-group weights ---
  // Only fill min(4, nB) slots — with fewer than 4 bones the extra slots must be
  // zero, not a duplicated bone, or the per-vertex weights sum past 1 and the
  // rest pose inflates/distorts (the 2-bone Pou rig hits this).
  const k4 = Math.min(4, nB);
  const si = new Uint16Array(count * 4);
  const sw = new Float32Array(count * 4);
  const order = [...Array(nB).keys()];
  for (let i = 0; i < count; i++) {
    const base = weld[i] * nB;
    order.sort((a, b) => Wg[base + b] - Wg[base + a]);
    let s = 0;
    for (let j = 0; j < k4; j++) s += Wg[base + order[j]] || 0;
    if (s <= 0) s = 1;
    for (let j = 0; j < 4; j++) {
      if (j < k4) {
        const k = order[j];
        si[i * 4 + j] = k;
        sw[i * 4 + j] = (Wg[base + k] || 0) / s;
      } else {
        si[i * 4 + j] = 0;
        sw[i * 4 + j] = 0;
      }
    }
  }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));

  // --- bones at their pivots; flat hierarchy under the root (or honour parent) ---
  const wp = (p: [number, number, number]) =>
    new THREE.Vector3(min.x + p[0] * sx, min.y + p[1] * sy, min.z + p[2] * sz);
  const bones: THREE.Bone[] = [];
  const byName: Record<string, THREE.Bone> = {};
  const root = new THREE.Bone();
  root.position.copy(wp(config[0].pivot));
  bones.push(root);
  byName[config[0].name] = root;
  for (let b = 1; b < nB; b++) {
    const bone = new THREE.Bone();
    bone.position.copy(wp(config[b].pivot)).sub(root.position); // local to root
    root.add(bone);
    bones.push(bone);
    byName[config[b].name] = bone;
  }

  const skinned = new THREE.SkinnedMesh(g, mesh.material as THREE.Material);
  skinned.add(root);
  skinned.bind(new THREE.Skeleton(bones));
  // No rest rotations: zero articulation must reproduce the source mesh exactly.
  return { skinned, bones: byName };
}

export { smooth };
