import * as THREE from 'three';
import { config } from '../core/config';
import { EyeConfig } from './eyeConfig';

/** Emissive-mask resolution; the glow map can be coarser than the albedo. */
const MASK_SIZE = 1024;
/** Soft-edge gain so the gate falloff saturates to full white before its rim. */
const EDGE_GAIN = 1.6;

/**
 * Rasterize the mesh's UV layout into a per-texel 3D rest-position map: posMap
 * holds the interpolated mesh-local position under each texel (x,y,z packed), and
 * `has` marks texels that any triangle actually covers. This lets the flood gate
 * its spread by 3D distance, so a stamp can't leak across the body through dark
 * texels that merely sit in an adjacent UV island. Mirrors the texel↔v mapping
 * used by the mask (flipY-aware). Returns null if the geometry lacks position/uv.
 */
function buildPositionMap(
  geometry: THREE.BufferGeometry,
  S: number,
  flip: boolean
): { posMap: Float32Array; has: Uint8Array } | null {
  const pos = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  if (!pos || !uv) return null;
  const index = geometry.getIndex();
  const triCount = index ? index.count : pos.count;
  const vi = (k: number): number => (index ? index.getX(k) : k);
  const posMap = new Float32Array(S * S * 3);
  const has = new Uint8Array(S * S);
  // Edge-function rasterizer with barycentric position interpolation.
  for (let t = 0; t < triCount; t += 3) {
    const a = vi(t);
    const b = vi(t + 1);
    const c = vi(t + 2);
    const toX = (u: number): number => u * S;
    const toY = (vv: number): number => (flip ? 1 - vv : vv) * S;
    const ax = toX(uv.getX(a)), ay = toY(uv.getY(a));
    const bx = toX(uv.getX(b)), by = toY(uv.getY(b));
    const cx = toX(uv.getX(c)), cy = toY(uv.getY(c));
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(S - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(S - 1, Math.ceil(Math.max(ay, by, cy)));
    const area = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
    if (area === 0) continue;
    const apx = pos.getX(a), apy = pos.getY(a), apz = pos.getZ(a);
    const bpx = pos.getX(b), bpy = pos.getY(b), bpz = pos.getZ(b);
    const cpx = pos.getX(c), cpy = pos.getY(c), cpz = pos.getZ(c);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5, py = y + 0.5;
        const w0 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) / area;
        const w1 = ((cx - px) * (ay - py) - (ax - px) * (cy - py)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const ki = y * S + x;
        posMap[ki * 3] = w0 * apx + w1 * bpx + w2 * cpx;
        posMap[ki * 3 + 1] = w0 * apy + w1 * bpy + w2 * cpy;
        posMap[ki * 3 + 2] = w0 * apz + w1 * bpz + w2 * cpz;
        has[ki] = 1;
      }
    }
  }
  return { posMap, has };
}

/**
 * Build an emissive mask (white where the body should glow) from a body's albedo
 * + the painted glow stamps. Each stamp is a UV-space click point + radius; the
 * mask lights the connected region of DARK texels reachable from that click,
 * bounded by the radius — a flood fill, not a flat disc. This matters because
 * the baked Meshy atlases are heavily fragmented: a single radius-0.08 disc in
 * UV space overlaps tiny islands from all over the body, so a flat disc bled the
 * glow onto unrelated surfaces (arm-back, neck) that merely sit near the eye in
 * UV. Flooding only the connected dark blob you clicked confines the glow to
 * that one feature — and because the mask rides the body material, it deforms
 * and tracks with the mesh, while lighter areas (fur, catch-lights) stay unlit.
 * Returns null if the albedo image isn't readable, or if there are no stamps.
 * Browser-only (canvas readback).
 */
export function buildEyeGlowMask(
  albedo: THREE.Texture | null,
  eyes: EyeConfig,
  geometry?: THREE.BufferGeometry | null
): THREE.CanvasTexture | null {
  const img = albedo?.image as CanvasImageSource | undefined;
  const stamps = eyes.stamps ?? [];
  if (!img || stamps.length === 0 || typeof document === 'undefined') return null;

  const dark = config.enemyGlow.eyeDarkThreshold;
  const S = MASK_SIZE;

  const src = document.createElement('canvas');
  src.width = S;
  src.height = S;
  const sctx = src.getContext('2d');
  if (!sctx) return null;
  sctx.drawImage(img, 0, 0, S, S);
  const sd = sctx.getImageData(0, 0, S, S).data;

  // Mask v matches the albedo's flip: for flipY=false a canvas row maps to
  // v = py/S directly; for flipY=true it's mirrored.
  const flip = !!albedo!.flipY;
  const luminance = (px: number, py: number): number => {
    const i = (py * S + px) * 4;
    return (0.299 * sd[i] + 0.587 * sd[i + 1] + 0.114 * sd[i + 2]) / 255;
  };
  const isDark = (px: number, py: number): boolean =>
    px >= 0 && py >= 0 && px < S && py < S && luminance(px, py) < dark;
  // UV (u in [0,1], v already flip-adjusted) → mask texel coords.
  const seedTexel = (u: number, v: number): [number, number] => {
    const vRaw = flip ? 1 - v : v;
    return [Math.round(u * S - 0.5), Math.round(vRaw * S - 0.5)];
  };

  // Per-texel glow gate (0..1), OR-combined across stamps via max.
  const gate = new Float32Array(S * S);
  // Which stamp last enqueued a texel, so each stamp floods independently but
  // overlapping stamps can still re-light shared texels.
  const visited = new Int32Array(S * S).fill(-1);
  // Small search window (~1.5% of the map) to snap a slightly-off click onto the
  // nearest dark texel, so a near-miss still seeds the feature.
  const snap = Math.max(2, Math.round(0.015 * S));
  const stack: number[] = [];

  // 3D flood bound: only needed if some stamp carries a 3D anchor + the caller
  // supplied geometry. Built once and shared across stamps.
  const needs3D = !!geometry && stamps.some((s) => s.p && s.pr);
  const pmap = needs3D ? buildPositionMap(geometry!, S, flip) : null;

  for (let si = 0; si < stamps.length; si++) {
    const s = stamps[si];
    // When the stamp is 3D-anchored and we have a position map, reject any texel
    // whose mesh-local 3D position strays beyond `pr` of the anchor — this stops
    // the flood at the body part you clicked even where dark texels stay
    // connected into a distant UV island.
    const anchor = s.p && s.pr && pmap ? s.p : null;
    const pr2 = s.pr ? s.pr * s.pr : 0;
    const within3D = (ki: number): boolean => {
      if (!anchor || !pmap) return true;
      if (!pmap.has[ki]) return false;
      const dx = pmap.posMap[ki * 3] - anchor[0];
      const dy = pmap.posMap[ki * 3 + 1] - anchor[1];
      const dz = pmap.posMap[ki * 3 + 2] - anchor[2];
      return dx * dx + dy * dy + dz * dz <= pr2;
    };
    let [sx, sy] = seedTexel(s.u, s.v);
    sx = Math.max(0, Math.min(S - 1, sx));
    sy = Math.max(0, Math.min(S - 1, sy));
    if (!isDark(sx, sy)) {
      let best = -1;
      for (let dy = -snap; dy <= snap; dy++) {
        for (let dx = -snap; dx <= snap; dx++) {
          const x = sx + dx;
          const y = sy + dy;
          if (isDark(x, y)) {
            const d = dx * dx + dy * dy;
            if (best < 0 || d < best) {
              best = d;
              sx = x;
              sy = y;
            }
          }
        }
      }
      if (best < 0) continue; // nothing dark under this stamp — skip it
    }
    if (!within3D(sy * S + sx)) continue; // seed itself is outside the 3D bound
    stack.length = 0;
    stack.push(sy * S + sx);
    visited[sy * S + sx] = si;
    while (stack.length) {
      const idx = stack.pop()!;
      const x = idx % S;
      const y = (idx - x) / S;
      const u = (x + 0.5) / S;
      const vRaw = (y + 0.5) / S;
      const v = flip ? 1 - vRaw : vRaw;
      const dist = Math.hypot(u - s.u, v - s.v);
      if (dist > s.r) continue; // bound the flood to the brush radius
      const g = Math.min(1, (1 - dist / s.r) * EDGE_GAIN);
      if (g > gate[idx]) gate[idx] = g;
      const nb = [idx + 1, idx - 1, idx + S, idx - S];
      const atRight = x === S - 1;
      const atLeft = x === 0;
      for (let n = 0; n < 4; n++) {
        if (n === 0 && atRight) continue;
        if (n === 1 && atLeft) continue;
        const ni = nb[n];
        if (ni < 0 || ni >= S * S || visited[ni] === si) continue;
        const nx = ni % S;
        const ny = (ni - nx) / S;
        if (!isDark(nx, ny)) continue; // only flood through dark texels
        if (!within3D(ni)) continue; // and stay inside the 3D bound
        visited[ni] = si;
        stack.push(ni);
      }
    }
  }

  const out = document.createElement('canvas');
  out.width = S;
  out.height = S;
  const octx = out.getContext('2d');
  if (!octx) return null;
  const oimg = octx.createImageData(S, S);
  const od = oimg.data;
  for (let i = 0; i < S * S; i++) {
    const val = Math.round(255 * gate[i]);
    od[i * 4] = val;
    od[i * 4 + 1] = val;
    od[i * 4 + 2] = val;
    od[i * 4 + 3] = 255;
  }
  octx.putImageData(oimg, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.flipY = albedo!.flipY;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Apply the glow emissive map to a body material; the glow stays OFF (zero
 * intensity) until `setMenacing` raises it. Returns true if a mask was built.
 */
export function applyEyeGlow(
  material: THREE.MeshStandardMaterial,
  eyes: EyeConfig,
  geometry?: THREE.BufferGeometry | null
): boolean {
  const mask = buildEyeGlowMask(material.map, eyes, geometry);
  if (!mask) return false;
  material.emissiveMap?.dispose();
  material.emissiveMap = mask;
  material.emissive.setHex(config.enemyGlow.eyeColor);
  material.emissiveIntensity = 0;
  material.needsUpdate = true;
  return true;
}
