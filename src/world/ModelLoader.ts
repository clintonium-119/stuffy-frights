import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Cached GLB loader for the AI-generated enemy bodies. Browser-only (GLTFLoader
 * needs fetch/decode); gameplay code calls it behind a flag, never in headless
 * tests. Returns a fresh clone per call so each enemy gets its own instance.
 */
const cache = new Map<string, Promise<THREE.Group>>();
const loader = new GLTFLoader();

export function loadGLB(url: string): Promise<THREE.Group> {
  let p = cache.get(url);
  if (!p) {
    p = new Promise<THREE.Group>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (err) => reject(err)
      );
    });
    cache.set(url, p);
  }
  return p.then((scene) => scene.clone(true));
}

export function modelUrl(model: string): string {
  const base = (import.meta.env?.BASE_URL ?? '/') as string;
  return `${base}models/${model}.glb`;
}
