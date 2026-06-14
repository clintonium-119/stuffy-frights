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

let fuzzNormal: THREE.Texture | null = null;

/** A shared tiling fuzz/fiber normal map (procedural). Headless-safe. */
function fuzzNormalMap(): THREE.Texture {
  if (fuzzNormal) return fuzzNormal;
  if (typeof document === 'undefined') {
    fuzzNormal = new THREE.Texture();
    return fuzzNormal;
  }
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8080ff'; // flat tangent-space normal
  ctx.fillRect(0, 0, size, size);
  // Thousands of tiny fibre flecks perturbing the X/Y of the normal.
  for (let i = 0; i < 9000; i++) {
    const r = (128 + (Math.random() * 2 - 1) * 75) | 0;
    const g = (128 + (Math.random() * 2 - 1) * 75) | 0;
    ctx.fillStyle = `rgb(${r},${g},255)`;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1.6);
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.colorSpace = THREE.NoColorSpace;
  fuzzNormal = t;
  return t;
}

export interface PlushOpts {
  /** Per-enemy coloured fabric albedo (e.g. EnemyBase.fabricTexture / furTexture output). */
  map?: THREE.Texture | null;
  /** Albedo tint when no map is given. */
  color?: number;
  /** Sheen tint — the soft retroreflective fuzz halo (usually a lighter fabric tone). */
  sheenColor?: number;
  /** Sheen roughness 0..1. Default 0.65. */
  sheenRoughness?: number;
  /** Base roughness. Default 0.92 (matte plush). */
  roughness?: number;
  /** Fuzz/fur normal strength. Default 0.35. */
  fuzz?: number;
  /**
   * Per-enemy fur normal map (e.g. furTexture().normal). When omitted, the
   * shared procedural fuzz normal is used — preserving the original look.
   */
  normalMap?: THREE.Texture | null;
}

/**
 * A fuzzy plush-fabric material: MeshPhysicalMaterial with a sheen layer (the
 * tell-tale soft fabric halo) plus a shared procedural fibre normal map. Used
 * for the stuffies' bodies; each enemy passes its own albedo + sheen tint.
 */
export function plushMaterial(opts: PlushOpts = {}): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    map: opts.map ?? null,
    color: new THREE.Color(opts.color ?? 0xffffff),
    roughness: opts.roughness ?? 0.92,
    metalness: 0,
    sheen: 1,
    sheenColor: new THREE.Color(opts.sheenColor ?? 0xffffff),
    sheenRoughness: opts.sheenRoughness ?? 0.65,
    normalMap: opts.normalMap ?? fuzzNormalMap(),
  });
  const f = opts.fuzz ?? 0.35;
  mat.normalScale.set(f, f);
  return mat;
}

/** Test/teardown helper: drop cached materials. */
export function clearMaterialCache(): void {
  cache.clear();
}
