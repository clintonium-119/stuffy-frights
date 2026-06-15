import * as THREE from 'three';
import { config } from '../core/config';
import { EyeConfig } from './eyeConfig';

/** Emissive-mask resolution; the glow map can be coarser than the albedo. */
const MASK_SIZE = 1024;
/** Soft-edge gain so the gate falloff saturates to full white before its rim. */
const EDGE_GAIN = 1.6;

/**
 * Build an emissive mask (white where the body should glow) from a body's albedo
 * + the painted glow stamps: a texel glows when it is a DARK painted pixel AND
 * inside one of the UV-space stamp discs. So stamping a feature lights up that
 * whole feature — and because the mask rides the body material, it deforms and
 * tracks with the mesh — while lighter areas (fur, catch-lights) stay unlit.
 * Returns null if the albedo image isn't readable, or if there are no stamps.
 * Browser-only (canvas readback).
 */
export function buildEyeGlowMask(albedo: THREE.Texture | null, eyes: EyeConfig): THREE.CanvasTexture | null {
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
      for (const s of stamps) {
        const du = u - s.u;
        const dv = v - s.v;
        const dd = du * du + dv * dv;
        if (dd < s.r * s.r) {
          const t = 1 - Math.sqrt(dd) / s.r;
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
 * Apply the glow emissive map to a body material; the glow stays OFF (zero
 * intensity) until `setMenacing` raises it. Returns true if a mask was built.
 */
export function applyEyeGlow(material: THREE.MeshStandardMaterial, eyes: EyeConfig): boolean {
  const mask = buildEyeGlowMask(material.map, eyes);
  if (!mask) return false;
  material.emissiveMap?.dispose();
  material.emissiveMap = mask;
  material.emissive.setHex(config.enemyGlow.eyeColor);
  material.emissiveIntensity = 0;
  material.needsUpdate = true;
  return true;
}
