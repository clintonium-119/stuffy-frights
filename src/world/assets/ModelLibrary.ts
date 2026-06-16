import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { normalizationOverride } from './catalog';

/**
 * Browser-only loader for the interior GLB catalog (see `catalog.ts`). Loads
 * each model once, then renders many copies as `InstancedMesh` so a model
 * reused N times costs ~one draw call per sub-mesh. Headless tests only touch
 * the pure helper (`groupPlacementsByModel`); loading/instancing is verified
 * in-browser.
 */

/** A request to place model `id` at world transform `matrix`. */
export interface ModelPlacement {
  id: string;
  matrix: THREE.Matrix4;
}

/** Group placements by model id (pure — preserves per-id order). */
export function groupPlacementsByModel(
  placements: readonly ModelPlacement[],
): Map<string, THREE.Matrix4[]> {
  const groups = new Map<string, THREE.Matrix4[]>();
  for (const p of placements) {
    let list = groups.get(p.id);
    if (!list) {
      list = [];
      groups.set(p.id, list);
    }
    list.push(p.matrix);
  }
  return groups;
}

export class InteriorLibrary {
  private readonly loader = new GLTFLoader();
  private readonly loading = new Map<string, Promise<THREE.Group>>();
  private readonly scenes = new Map<string, THREE.Group>();
  private readonly bboxes = new Map<string, THREE.Box3>();

  constructor(private readonly baseUrl: string = (import.meta.env?.BASE_URL ?? '/') as string) {}

  private url(id: string): string {
    return `${this.baseUrl}models/interior/${id}.glb`;
  }

  /** Load one model's source scene (cached). */
  load(id: string): Promise<THREE.Group> {
    const cached = this.loading.get(id);
    if (cached) return cached;
    const p = new Promise<THREE.Group>((resolve, reject) => {
      this.loader.load(
        this.url(id),
        (gltf) => {
          gltf.scene.updateMatrixWorld(true);
          this.scenes.set(id, gltf.scene);
          this.bboxes.set(id, new THREE.Box3().setFromObject(gltf.scene));
          resolve(gltf.scene);
        },
        undefined,
        (err) => reject(err),
      );
    });
    this.loading.set(id, p);
    return p;
  }

  /** Preload every model referenced by `ids` (deduped). */
  async preload(ids: readonly string[]): Promise<void> {
    await Promise.all([...new Set(ids)].map((id) => this.load(id)));
  }

  /**
   * Build instanced renderables for `placements`. Every referenced model must
   * be preloaded; throws otherwise. Override matrix per model comes from
   * `normalizeFor` (floor-seat / scale — see the registry).
   */
  buildInstanced(placements: readonly ModelPlacement[]): THREE.InstancedMesh[] {
    const out: THREE.InstancedMesh[] = [];
    const tmp = new THREE.Matrix4();
    for (const [id, matrices] of groupPlacementsByModel(placements)) {
      const scene = this.scenes.get(id);
      if (!scene) throw new Error(`InteriorLibrary: model "${id}" not preloaded`);
      const normalize = this.normalizeFor(id);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const inst = new THREE.InstancedMesh(mesh.geometry, mesh.material, matrices.length);
        matrices.forEach((placement, i) => {
          // world = placement * normalize * meshWithinScene
          tmp.multiplyMatrices(normalize, mesh.matrixWorld);
          tmp.premultiply(placement);
          inst.setMatrixAt(i, tmp);
        });
        inst.instanceMatrix.needsUpdate = true;
        inst.computeBoundingSphere();
        inst.castShadow = mesh.castShadow;
        inst.receiveShadow = mesh.receiveShadow;
        out.push(inst);
      });
    }
    return out;
  }

  /**
   * Per-model normalization transform: uniform scale + yaw from the registry
   * override, then floor-seat (lift so the scaled base sits on y = 0, derived
   * from the loaded bounding box). Identity until the model is loaded.
   */
  protected normalizeFor(id: string): THREE.Matrix4 {
    const box = this.bboxes.get(id);
    if (!box) return new THREE.Matrix4();
    const { scale = 1, yawDeg = 0 } = normalizationOverride(id);
    const scaleRot = new THREE.Matrix4()
      .makeRotationY((yawDeg * Math.PI) / 180)
      .scale(new THREE.Vector3(scale, scale, scale));
    const seatY = -box.min.y * scale;
    return new THREE.Matrix4().makeTranslation(0, seatY, 0).multiply(scaleRot);
  }
}
