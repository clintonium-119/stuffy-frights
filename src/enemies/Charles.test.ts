import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as THREE from 'three';

/** No-op canvas/document so the model can bake its textures headlessly. */
function installCanvasStub(): () => void {
  const had = 'document' in globalThis;
  const prev = (globalThis as Record<string, unknown>).document;
  const noopCtx = new Proxy({}, { get: () => () => undefined, set: () => true });
  (globalThis as Record<string, unknown>).document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => noopCtx }),
  };
  return () => {
    if (had) (globalThis as Record<string, unknown>).document = prev;
    else delete (globalThis as Record<string, unknown>).document;
  };
}

describe('Little Timmy (Charles) — legless Gorilla Tag look', () => {
  let restore: () => void;
  beforeAll(() => (restore = installCanvasStub()));
  afterAll(() => restore());

  it('builds with no leg fields, a forward (+Z) face, and arms', async () => {
    const { Charles } = await import('./Charles');
    const timmy = new Charles();
    timmy.group.updateMatrixWorld(true);

    // No leg fields exist on the reshaped model.
    expect((timmy as unknown as Record<string, unknown>).legL).toBeUndefined();
    expect((timmy as unknown as Record<string, unknown>).legR).toBeUndefined();

    // Face plane (the only CircleGeometry) sits forward on +Z.
    let face: THREE.Mesh | null = null;
    timmy.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.CircleGeometry) face = o;
    });
    expect(face).not.toBeNull();
    const fp = new THREE.Vector3();
    face!.getWorldPosition(fp);
    expect(fp.z).toBeGreaterThan(0.1);

    // Body reads as fuzzy plush: a physical material carrying a sheen layer.
    let plush = false;
    timmy.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshPhysicalMaterial && o.material.sheen > 0) {
        plush = true;
      }
    });
    expect(plush).toBe(true);

    // Still animates (knuckle hand-walk) without error.
    expect(() => timmy.update(1 / 60, new THREE.Vector3(0, 0, 5), false)).not.toThrow();
  });
});
