import * as THREE from 'three';
import { loadGLB, modelUrl } from '../world/ModelLoader';
import { projectionMaterial } from './projectionMaterial';
import { PROJECTION, ENEMY_MODEL } from './projectionConfig';

/**
 * Builds a textured AI-mesh body for an enemy: loads the generated GLB, applies
 * the object-space camera-projection material (with a menacing-texture swap),
 * computes normals, and sizes it to a target height with feet on the ground.
 * Browser-only (loads a GLB); call behind a flag, never in headless tests.
 */
export interface MeshBody {
  group: THREE.Group;
  setMenacing(on: boolean): void;
}

export async function buildMeshBody(enemyId: string, targetHeight: number): Promise<MeshBody | null> {
  const model = ENEMY_MODEL[enemyId];
  if (!model) return null;
  const cfg = PROJECTION[model];
  if (!cfg) return null;
  const scene = await loadGLB(modelUrl(model));
  const base = `${(import.meta.env?.BASE_URL ?? '/') as string}models/${model}`;
  const tl = new THREE.TextureLoader();
  const front = tl.load(`${base}_front.png`);
  const back = tl.load(`${base}_back.png`);
  const side = tl.load(`${base}_side.png`);
  const frontMean = tl.load(`${base}_front_mean.png`);
  const sideMean = tl.load(`${base}_side_mean.png`);

  const mats: THREE.MeshStandardMaterial[] = [];
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const g = o.geometry as THREE.BufferGeometry;
    if (!g.attributes.normal) g.computeVertexNormals();
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const min = new THREE.Vector3(bb.min.x, bb.min.y, bb.min.z);
    const size = new THREE.Vector3(bb.max.x - bb.min.x || 1, bb.max.y - bb.min.y || 1, bb.max.z - bb.min.z || 1);
    o.material = projectionMaterial({ front, back, side }, min, size, cfg);
    o.castShadow = true;
    mats.push(o.material as THREE.MeshStandardMaterial);
  });

  // Size to target height; feet at y=0, centred on X/Z.
  const group = new THREE.Group();
  group.add(scene);
  const box = new THREE.Box3().setFromObject(scene);
  const h = box.max.y - box.min.y || 1;
  const s = targetHeight / h;
  group.scale.setScalar(s);
  const c = box.getCenter(new THREE.Vector3());
  scene.position.set(-c.x, -box.min.y, -c.z);

  const setMenacing = (on: boolean) => {
    for (const m of mats) {
      const u = m.userData.proj;
      if (!u) continue;
      u.uFront.value = on ? frontMean : front;
      u.uSide.value = on ? sideMean : side;
    }
  };
  return { group, setMenacing };
}
