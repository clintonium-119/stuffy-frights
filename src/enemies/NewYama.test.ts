import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as THREE from 'three';

/**
 * The stuffy models bake their fur + face on a 2D canvas at construction, so
 * building one headlessly needs a no-op canvas/document. This stub lets the
 * geometry be asserted without a real DOM or GPU.
 */
function installCanvasStub(): () => void {
  const had = 'document' in globalThis;
  const prev = (globalThis as Record<string, unknown>).document;
  const noopCtx = new Proxy(
    {},
    {
      get: () => () => undefined,
      set: () => true,
    }
  );
  (globalThis as Record<string, unknown>).document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => noopCtx }),
  };
  return () => {
    if (had) (globalThis as Record<string, unknown>).document = prev;
    else delete (globalThis as Record<string, unknown>).document;
  };
}

describe('NewYama orientation', () => {
  let restore: () => void;
  beforeAll(() => {
    restore = installCanvasStub();
  });
  afterAll(() => restore());

  it('faces +Z — the model-forward convention shared by the other stuffies', async () => {
    const { NewYama } = await import('./NewYama');
    const yama = new NewYama();
    yama.group.updateMatrixWorld(true);

    // The returned face plane is what the AI/jumpscare treat as the face.
    // Find it: the only CircleGeometry mesh in the head.
    let face: THREE.Mesh | null = null;
    yama.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.CircleGeometry) face = o;
    });
    expect(face).not.toBeNull();

    const facePos = new THREE.Vector3();
    face!.getWorldPosition(facePos);
    // Face sits ahead of the torso center on +Z, and centered on X.
    expect(facePos.z).toBeGreaterThan(0.3);
    expect(Math.abs(facePos.x)).toBeLessThan(0.05);

    // Fleece reads as fuzzy plush: a physical material with a sheen layer.
    let plush = false;
    yama.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshPhysicalMaterial && o.material.sheen > 0) {
        plush = true;
      }
    });
    expect(plush).toBe(true);
  });
});
