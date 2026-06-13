import * as THREE from 'three';

/**
 * Central owner of the bundled CC0 PBR textures (Poly Haven — see
 * public/textures/CREDITS.md) and the MeshStandardMaterials built from them.
 *
 * Every architecture/prop surface pulls its material from here so textures load
 * once and materials are shared (cached by role + tiling + tint). Texture
 * creation goes through an injectable factory so the module is testable without
 * a WebGL context (tests supply a factory returning bare THREE.Texture objects).
 */

export type MaterialRole =
  | 'woodfloor'
  | 'plaster'
  | 'ceiling'
  | 'concretefloor'
  | 'concretewall'
  | 'woodprop'
  | 'fabric'
  | 'carpet'
  | 'metal'
  | 'tile';

/** Roles whose texture set includes an ambient-occlusion map (needs uv2). */
const ROLES_WITH_AO = new Set<MaterialRole>([
  'woodfloor',
  'plaster',
  'concretefloor',
  'concretewall',
]);

export const ALL_ROLES: readonly MaterialRole[] = [
  'woodfloor',
  'plaster',
  'ceiling',
  'concretefloor',
  'concretewall',
  'woodprop',
  'fabric',
  'carpet',
  'metal',
  'tile',
];

type TextureFactory = (url: string) => THREE.Texture;

const defaultFactory: TextureFactory = (url) => {
  // Headless (tests / SSR): no document to decode an image — hand back a bare
  // texture so material construction stays side-effect-free off the browser.
  if (typeof document === 'undefined') return new THREE.Texture();
  return new THREE.TextureLoader().load(url);
};
let createTexture: TextureFactory = defaultFactory;
let maxAnisotropy = 4;

/** Wire renderer capabilities (anisotropy). Call once at boot. */
export function initMaterials(renderer: THREE.WebGLRenderer): void {
  maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
}

/** Test seam: swap the texture factory (e.g. to bare THREE.Texture in unit tests). */
export function setTextureFactory(fn: TextureFactory | null): void {
  createTexture = fn ?? defaultFactory;
}

const base = (import.meta.env?.BASE_URL ?? '/') as string;

function makeTexture(role: MaterialRole, map: string, srgb: boolean, repeat: [number, number]): THREE.Texture {
  const t = createTexture(`${base}textures/${role}/${map}.jpg`);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = maxAnisotropy;
  return t;
}

export interface PbrOpts {
  /** Texture tiling (UV repeat) in X and Y. Default [1, 1]. */
  repeat?: [number, number];
  /** Roughness multiplier (combined with the roughness map). Default 1. */
  roughness?: number;
  /** Metalness (no metalness map shipped). Default 0. */
  metalness?: number;
  /** Optional albedo tint. Default white (no tint). */
  color?: number;
  /** Normal-map strength. Default 1. */
  normalScale?: number;
}

const cache = new Map<string, THREE.MeshStandardMaterial>();

/**
 * Build (or fetch from cache) a shared PBR material for a surface role.
 * Wires albedo (sRGB) + normal + roughness, and an AO map for roles that ship
 * one. Cached by role + tiling + tint so repeated surfaces share one material.
 */
export function pbrMaterial(role: MaterialRole, opts: PbrOpts = {}): THREE.MeshStandardMaterial {
  const repeat = opts.repeat ?? [1, 1];
  const roughness = opts.roughness ?? 1;
  const metalness = opts.metalness ?? 0;
  const color = opts.color ?? 0xffffff;
  const normalScale = opts.normalScale ?? 1;
  const key = `${role}|${repeat[0]}x${repeat[1]}|r${roughness}|m${metalness}|c${color}|n${normalScale}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const mat = new THREE.MeshStandardMaterial({
    map: makeTexture(role, 'albedo', true, repeat),
    normalMap: makeTexture(role, 'normal', false, repeat),
    roughnessMap: makeTexture(role, 'rough', false, repeat),
    roughness,
    metalness,
    color: new THREE.Color(color),
  });
  mat.normalScale.set(normalScale, normalScale);
  if (ROLES_WITH_AO.has(role)) {
    mat.aoMap = makeTexture(role, 'ao', false, repeat);
    // Tiling AO shares the primary (tiled) UV channel rather than a separate set.
    mat.aoMap.channel = 0;
  }
  cache.set(key, mat);
  return mat;
}

/** Does this role's material use an AO map (so its geometry needs a uv2 set)? */
export function roleUsesAo(role: MaterialRole): boolean {
  return ROLES_WITH_AO.has(role);
}

/** Test/teardown helper: drop cached materials. */
export function clearMaterialCache(): void {
  cache.clear();
}
