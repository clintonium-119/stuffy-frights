import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as THREE from 'three';
import {
  ALL_ROLES,
  clearMaterialCache,
  pbrMaterial,
  roleUsesAo,
  setTextureFactory,
} from './materialLibrary';

// Bare textures (no WebGL / image decode) so the library is testable headlessly.
setTextureFactory(() => new THREE.Texture());

beforeEach(() => clearMaterialCache());
afterAll(() => setTextureFactory(null));

describe('materialLibrary', () => {
  it('exposes all ten surface roles', () => {
    expect(ALL_ROLES).toHaveLength(10);
  });

  it('builds a PBR material with albedo/normal/roughness wired', () => {
    const m = pbrMaterial('woodfloor', { repeat: [4, 4] });
    expect(m).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(m.map).toBeTruthy();
    expect(m.normalMap).toBeTruthy();
    expect(m.roughnessMap).toBeTruthy();
  });

  it('tags albedo as sRGB but data maps as linear (no color transform)', () => {
    const m = pbrMaterial('plaster', { repeat: [2, 2] });
    expect(m.map!.colorSpace).toBe(THREE.SRGBColorSpace);
    expect(m.normalMap!.colorSpace).toBe(THREE.NoColorSpace);
    expect(m.roughnessMap!.colorSpace).toBe(THREE.NoColorSpace);
  });

  it('applies tiling + repeat wrapping to the textures', () => {
    const m = pbrMaterial('concretefloor', { repeat: [8, 8] });
    expect(m.map!.wrapS).toBe(THREE.RepeatWrapping);
    expect(m.map!.wrapT).toBe(THREE.RepeatWrapping);
    expect(m.map!.repeat.x).toBe(8);
    expect(m.map!.repeat.y).toBe(8);
  });

  it('wires an AO map only for roles that ship one', () => {
    expect(roleUsesAo('woodfloor')).toBe(true);
    expect(roleUsesAo('metal')).toBe(false);
    expect(pbrMaterial('woodfloor', { repeat: [4, 4] }).aoMap).toBeTruthy();
    expect(pbrMaterial('metal', { repeat: [1, 1] }).aoMap).toBeNull();
  });

  it('shares one cached material per role+tiling and distinct ones otherwise', () => {
    const a = pbrMaterial('woodfloor', { repeat: [4, 4] });
    const b = pbrMaterial('woodfloor', { repeat: [4, 4] });
    const c = pbrMaterial('woodfloor', { repeat: [8, 8] });
    expect(a).toBe(b); // same args → same instance
    expect(a).not.toBe(c); // different tiling → different material
  });
});
