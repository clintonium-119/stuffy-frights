import * as THREE from 'three';
import { loadGLB, modelUrl } from '../world/ModelLoader';
import { ENEMY_MODEL } from './projectionConfig';
import { rigMesh } from './Skinning';
import { RIG_SPECS } from './rigSpecs';

/**
 * Builds a textured AI-mesh body for an enemy from a Meshy-generated GLB: keeps
 * the GLB's own baked PBR material, orients the mesh so its face leads the
 * enemy's forward (+Z), rigs it so the articulation (gaze / legs / stairs) can
 * drive it, and sizes it to a target height with feet on the ground. The baked
 * face can't change expression, so the menacing mood flushes the body red.
 * Browser-only (loads a GLB); call behind a flag, never in headless tests.
 */
export interface MeshBody {
  group: THREE.Group;
  setMenacing(on: boolean): void;
  /** Rig bones the articulation drives (head + legs), keyed by name. */
  bones: Record<string, THREE.Bone>;
}

// Yaw (radians) to face each Meshy mesh forward (+Z, the enemy's lead
// direction). As exported they already face +Z, so this is 0; baked into a
// per-instance geometry clone so the rig's +Z-front weights line up. Tune per
// model if one comes in rotated.
const FACE_YAW: Record<string, number> = {
  pou: 0,
  fuggler: 0,
  gorilla: 0,
  llama: 0,
};

export async function buildMeshBody(enemyId: string, targetHeight: number): Promise<MeshBody | null> {
  const model = ENEMY_MODEL[enemyId];
  if (!model) return null;
  const scene = await loadGLB(modelUrl(model));
  const yaw = FACE_YAW[model] ?? 0;

  // Per-instance geometry/material clones — loadGLB shares them across clones,
  // so mutating in place would compound the rotation / leak the menacing tint.
  const mats: THREE.MeshStandardMaterial[] = [];
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const g = (o.geometry as THREE.BufferGeometry).clone();
    if (!g.attributes.normal) g.computeVertexNormals();
    if (yaw) g.rotateY(yaw);
    o.geometry = g;
    const mat = (o.material as THREE.MeshStandardMaterial).clone();
    mat.metalness = 0; // plush, not plastic
    o.material = mat;
    o.castShadow = true;
    mats.push(mat);
  });

  // Rig the main mesh (skeleton + skin weights) so the articulation can drive
  // it. Meshy exports a single mesh, so this rigs the whole body.
  let bones: Record<string, THREE.Bone> = {};
  const spec = RIG_SPECS[model];
  if (spec) {
    let mainMesh: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh && !mainMesh) mainMesh = o;
    });
    if (mainMesh) {
      const parent = (mainMesh as THREE.Mesh).parent!;
      const res = rigMesh(mainMesh, spec);
      parent.add(res.skinned);
      parent.remove(mainMesh);
      bones = res.bones;
    }
  }

  // Size to target height; feet at y=0, centred on X/Z.
  const group = new THREE.Group();
  group.add(scene);
  const box = new THREE.Box3().setFromObject(scene);
  const h = box.max.y - box.min.y || 1;
  const s = targetHeight / h;
  group.scale.setScalar(s);
  const c = box.getCenter(new THREE.Vector3());
  scene.position.set(-c.x, -box.min.y, -c.z);

  // The baked texture can't swap to a mean face, so flush the body red instead.
  const setMenacing = (on: boolean) => {
    for (const m of mats) {
      m.emissive.setHex(on ? 0x8a1410 : 0x000000);
      m.emissiveIntensity = on ? 0.7 : 0;
    }
  };
  return { group, setMenacing, bones };
}
