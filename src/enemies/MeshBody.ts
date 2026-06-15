import * as THREE from 'three';
import { loadGLB, modelUrl } from '../world/ModelLoader';
import { rigMesh } from './Skinning';
import { RIG_CONFIG } from './rigConfig';
import { ENEMY_TUNING } from './tuningConfig';
import { EYE_CONFIG } from './eyeConfig';
import { applyEyeGlow } from './eyeGlow';
import { config } from '../core/config';

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
// enemy if one comes in rotated. Keyed by the canonical enemy id (= GLB name).
const FACE_YAW: Record<string, number> = {
  pou: 0,
  fuggie: 0,
  littleTimmy: 0,
  newYama: 0,
};

export async function buildMeshBody(enemyId: string, targetHeight?: number): Promise<MeshBody | null> {
  // The enemy id IS the GLB file name and the rig-config key (no model layer).
  if (!RIG_CONFIG[enemyId]) return null;
  // Authored body height lives in the per-enemy tuning (was ENEMY_HEIGHT here).
  const th = targetHeight ?? ENEMY_TUNING[enemyId]?.height ?? 1.5;
  const scene = await loadGLB(modelUrl(enemyId));
  const yaw = FACE_YAW[enemyId] ?? 0;

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
  const rig = RIG_CONFIG[enemyId];
  if (rig) {
    let mainMesh: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh && !mainMesh) mainMesh = o;
    });
    if (mainMesh) {
      const parent = (mainMesh as THREE.Mesh).parent!;
      const res = rigMesh(mainMesh, rig);
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
  const s = th / h;
  group.scale.setScalar(s);
  const c = box.getCenter(new THREE.Vector3());
  scene.position.set(-c.x, -box.min.y, -c.z);

  // Re-bind the skeleton now that the body sits in its FINAL transform (GLB node
  // + centring offset + group scale). Binding earlier — as rigMesh does, before
  // the mesh is parented/scaled — captures bone inverses without those
  // transforms, so at render they get applied twice and the rest pose distorts
  // (e.g. an eye-pod smears into a horn). Re-binding here recomputes the inverses
  // against the live world matrices, so zero articulation reproduces the source.
  group.updateMatrixWorld(true);
  scene.traverse((o) => {
    const sm = o as THREE.SkinnedMesh;
    if (sm.isSkinnedMesh) sm.bind(sm.skeleton);
  });

  // Glowing features for the menacing mood: the baked face can't change
  // expression, so we make the PAINTED regions of the albedo emit. An emissive
  // mask lights up the dark painted pixels inside the per-enemy glow stamps (see
  // eyeGlow.ts), so the eyes/mouth glow and deform/track with the head — far
  // better than the old "animal lightbulb" whole-body flush. Materials without a
  // readable albedo fall back to a modest body flush so menacing still reads.
  const eyeCfg = EYE_CONFIG[enemyId];
  const glowMats = new Set<THREE.MeshStandardMaterial>();
  if (eyeCfg) {
    for (const m of mats) {
      if (m.map && applyEyeGlow(m, eyeCfg)) glowMats.add(m);
    }
  }

  const setMenacing = (on: boolean) => {
    for (const m of mats) {
      if (glowMats.has(m)) {
        // Eye-glow material: the emissive map confines the glow to the eyes.
        m.emissiveIntensity = on ? config.enemyGlow.eyeIntensity : 0;
      } else {
        m.emissive.setHex(on ? 0x8a1410 : 0x000000);
        m.emissiveIntensity = on ? 0.5 : 0;
      }
    }
  };
  return { group, setMenacing, bones };
}
