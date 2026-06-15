import * as THREE from 'three';
import { config } from '../core/config';
import { EyeConfig } from './eyeConfig';

/** Emissive-mask resolution; the glow map can be coarser than the albedo. */
const MASK_SIZE = 1024;
/** Soft-edge gain so the gate falloff saturates to full white before its rim. */
const EDGE_GAIN = 1.6;

/**
 * Build an emissive mask (white where the eyes should glow) from a body's
 * albedo + the eye centres: a texel glows when it is a DARK painted pixel AND
 * within `eyeUvRadius` (UV space) of an eye centre. So the whole painted eye
 * lights up — and because the mask rides the body material, it deforms and
 * tracks with the head — while dark fur elsewhere stays dark and the eye's
 * white catch-lights stay unlit (reading as reflections). Returns null if the
 * geometry has no UVs or the albedo image isn't readable (caller falls back to
 * a plain body flush). Browser-only (canvas readback).
 */
export function buildEyeGlowMask(
  geometry: THREE.BufferGeometry,
  albedo: THREE.Texture | null,
  eyes: EyeConfig
): THREE.CanvasTexture | null {
  const img = albedo?.image as CanvasImageSource | undefined;
  const uvAttr = geometry.attributes.uv;
  const posAttr = geometry.attributes.position;
  if (!img || !uvAttr || !posAttr || typeof document === 'undefined') return null;

  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  const sx = bb.max.x - bb.min.x || 1;
  const sy = bb.max.y - bb.min.y || 1;
  const sz = bb.max.z - bb.min.z || 1;

  // Eye centres (normalized model-box coords) → UV via the nearest vertex.
  const eyeUV = [eyes.left, eyes.right].map((n) => {
    const lx = bb.min.x + n[0] * sx;
    const ly = bb.min.y + n[1] * sy;
    const lz = bb.min.z + n[2] * sz;
    let best = Infinity;
    let bi = 0;
    for (let i = 0; i < posAttr.count; i++) {
      const dx = posAttr.getX(i) - lx;
      const dy = posAttr.getY(i) - ly;
      const dz = posAttr.getZ(i) - lz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < best) {
        best = d;
        bi = i;
      }
    }
    return [uvAttr.getX(bi), uvAttr.getY(bi)] as [number, number];
  });

  const uvR = eyes.radius ?? config.enemyGlow.eyeUvRadius;
  const dark = config.enemyGlow.eyeDarkThreshold;
  const S = MASK_SIZE;

  // Gate circles in UV space: the two eye centres (auto) + any hand-painted
  // stamps. A texel glows if it's dark AND inside any circle.
  const circles: Array<[number, number, number]> = [
    [eyeUV[0][0], eyeUV[0][1], uvR],
    [eyeUV[1][0], eyeUV[1][1], uvR],
  ];
  for (const s of eyes.stamps ?? []) circles.push([s.u, s.v, s.r]);

  const src = document.createElement('canvas');
  src.width = S;
  src.height = S;
  const sctx = src.getContext('2d');
  if (!sctx) return null;
  sctx.drawImage(img, 0, 0, S, S);
  const sd = sctx.getImageData(0, 0, S, S).data;

  const out = document.createElement('canvas');
  out.width = S;
  out.height = S;
  const octx = out.getContext('2d');
  if (!octx) return null;
  const oimg = octx.createImageData(S, S);
  const od = oimg.data;
  // Mask v matches the albedo's flip: for flipY=false a canvas row maps to
  // v = py/S directly; for flipY=true it's mirrored.
  const flip = !!albedo!.flipY;
  for (let py = 0; py < S; py++) {
    for (let px = 0; px < S; px++) {
      const i = (py * S + px) * 4;
      const u = (px + 0.5) / S;
      const vRaw = (py + 0.5) / S;
      const v = flip ? 1 - vRaw : vRaw;
      let gate = 0;
      for (const [cu, cv, cr] of circles) {
        const du = u - cu;
        const dv = v - cv;
        const dd = du * du + dv * dv;
        if (dd < cr * cr) {
          const t = 1 - Math.sqrt(dd) / cr;
          if (t > gate) gate = t;
        }
      }
      let val = 0;
      if (gate > 0) {
        const lum = (0.299 * sd[i] + 0.587 * sd[i + 1] + 0.114 * sd[i + 2]) / 255;
        if (lum < dark) val = 255 * Math.min(1, gate * EDGE_GAIN);
      }
      od[i] = val;
      od[i + 1] = val;
      od[i + 2] = val;
      od[i + 3] = 255;
    }
  }
  octx.putImageData(oimg, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.flipY = albedo!.flipY;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Apply the eye-glow emissive map to a body material; the glow stays OFF (zero
 * intensity) until `setMenacing` raises it. Returns true if a mask was built.
 */
export function applyEyeGlow(
  material: THREE.MeshStandardMaterial,
  geometry: THREE.BufferGeometry,
  eyes: EyeConfig
): boolean {
  const mask = buildEyeGlowMask(geometry, material.map, eyes);
  if (!mask) return false;
  material.emissiveMap?.dispose();
  material.emissiveMap = mask;
  material.emissive.setHex(config.enemyGlow.eyeColor);
  material.emissiveIntensity = 0;
  material.needsUpdate = true;
  return true;
}
