import * as THREE from 'three';

/**
 * Builds a `THREE.SkinnedMesh` from an AI-mesh + a per-creature skeleton spec.
 * Bones are placed by normalized-bbox pivots; each vertex is weighted to bones
 * by their region functions (+ a base weight to the root so everything stays
 * attached), top-4 linear-blend skinning. The existing articulation then drives
 * the returned bones (head gaze, per-leg stair placement, etc.).
 */
export interface BoneSpec {
  name: string;
  /** Bone pivot in normalized bbox coords [0..1]. */
  pivot: [number, number, number];
  /** Region weight for a vertex at normalized bbox coords (0 = none). */
  weight: (nx: number, ny: number, nz: number) => number;
  /** Optional rest rotation applied after bind (e.g. neutralize a splayed pose). */
  rest?: [number, number, number];
}
export interface RigSpec {
  /** bones[0] is the root/body. */
  bones: BoneSpec[];
  /** Base weight pinning every vertex to the root so nothing detaches. */
  rootBase?: number;
}
export interface RigResult {
  skinned: THREE.SkinnedMesh;
  bones: Record<string, THREE.Bone>;
}

const smooth = (e0: number, e1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function rigMesh(mesh: THREE.Mesh, spec: RigSpec): RigResult {
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
  const nB = spec.bones.length;
  const rootBase = spec.rootBase ?? 0.25;
  const si = new Uint16Array(pos.count * 4);
  const sw = new Float32Array(pos.count * 4);
  const w = new Float32Array(nB);

  for (let i = 0; i < pos.count; i++) {
    const nx = (pos.getX(i) - min.x) / sx;
    const ny = (pos.getY(i) - min.y) / sy;
    const nz = (pos.getZ(i) - min.z) / sz;
    let total = 0;
    for (let b = 0; b < nB; b++) {
      const ww = b === 0 ? rootBase : Math.max(0, spec.bones[b].weight(nx, ny, nz));
      w[b] = ww;
      total += ww;
    }
    if (total <= 0) {
      w[0] = 1;
    }
    const order = [...Array(nB).keys()].sort((a, b) => w[b] - w[a]).slice(0, 4);
    let s = 0;
    for (const k of order) s += w[k];
    if (s <= 0) {
      s = 1;
      order[0] = 0;
      w[0] = 1;
    }
    for (let j = 0; j < 4; j++) {
      const k = order[j] ?? 0;
      si[i * 4 + j] = k;
      sw[i * 4 + j] = j < order.length ? w[k] / s : 0;
    }
  }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));

  const wp = (p: [number, number, number]) =>
    new THREE.Vector3(min.x + p[0] * sx, min.y + p[1] * sy, min.z + p[2] * sz);
  const bones: THREE.Bone[] = [];
  const byName: Record<string, THREE.Bone> = {};
  const root = new THREE.Bone();
  root.position.copy(wp(spec.bones[0].pivot));
  bones.push(root);
  byName[spec.bones[0].name] = root;
  for (let b = 1; b < nB; b++) {
    const bs = spec.bones[b];
    const bone = new THREE.Bone();
    bone.position.copy(wp(bs.pivot)).sub(root.position); // local to root
    root.add(bone);
    bones.push(bone);
    byName[bs.name] = bone;
  }

  const skinned = new THREE.SkinnedMesh(g, mesh.material as THREE.Material);
  skinned.add(root);
  skinned.bind(new THREE.Skeleton(bones));
  // Apply rest rotations (pose neutralization) after bind.
  for (let b = 0; b < nB; b++) {
    const r = spec.bones[b].rest;
    if (r) bones[b].rotation.set(r[0], r[1], r[2]);
  }
  return { skinned, bones: byName };
}

export { smooth };
