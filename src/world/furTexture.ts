import * as THREE from 'three';

/**
 * Per-style procedural plush-fur texture generator. Produces a tileable
 * albedo + a matching tangent-space normal map of directional fibres, so each
 * stuffy's surface reads as its own kind of plush (smooth nap, short fuzz,
 * coarse shag, long curly fleece) and catches light along the strands.
 *
 * The fibre *parameters* are derived by a pure function (`furParams`) that is
 * unit-tested headless; the canvas rasterisation is browser-only (guarded, so
 * headless callers get bare textures like the rest of the material library).
 */

export interface FurStyle {
  /** Base (root) fabric colour, CSS string. */
  base: string;
  /** Tip / highlight colour catching the light at strand ends. */
  tip: string;
  /** Optional darker shadow colour at the roots. Defaults to a darkened base. */
  shade?: string;
  /** Mean fibre length in texels (longer = shaggier/fleece). */
  fiberLen: number;
  /** Relative fibre density, 0..2 (1 = default). */
  density?: number;
  /** Sideways curl/wave of each strand, 0 (straight) .. 1 (curly fleece). */
  curl?: number;
  /** Strand thickness in texels. */
  thickness?: number;
  /** Texture resolution (square). Default 512. */
  size?: number;
  /** UV repeat for the resulting textures. Default [1, 1]. */
  repeat?: [number, number];
}

export interface FurParams {
  size: number;
  strokeCount: number;
  fiberLen: number;
  curl: number;
  thickness: number;
  base: string;
  tip: string;
  shade: string;
  repeat: [number, number];
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/** Darken a #rrggbb by a factor (0..1). */
function darken(hex: string, f: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Pure: resolve a FurStyle into concrete rasterisation parameters. Density
 * scales the stroke count with area; everything is clamped to sane ranges.
 * Distinct styles yield distinct params — the property the unit test pins.
 */
export function furParams(style: FurStyle): FurParams {
  const size = style.size ?? 512;
  const density = clamp(style.density ?? 1, 0, 2);
  const fiberLen = clamp(style.fiberLen, 1, size * 0.5);
  // More, finer strokes for short nap; fewer, longer for shag — but always
  // dense enough to cover. Scale with texel area.
  const area = size * size;
  const strokeCount = Math.round((area / 90) * density * (1 + 6 / fiberLen));
  return {
    size,
    strokeCount: clamp(strokeCount, 200, 60000),
    fiberLen,
    curl: clamp(style.curl ?? 0, 0, 1),
    thickness: clamp(style.thickness ?? 1.3, 0.5, 6),
    base: style.base,
    tip: style.tip,
    shade: style.shade ?? darken(style.base, 0.7),
    repeat: style.repeat ?? [1, 1],
  };
}

function headless(): boolean {
  return typeof document === 'undefined';
}

/** Draw the fibre field onto a 2D context (albedo or normal mode). */
function paintFur(p: FurParams, mode: 'albedo' | 'normal'): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = p.size;
  const ctx = c.getContext('2d')!;

  if (mode === 'albedo') {
    ctx.fillStyle = p.shade;
    ctx.fillRect(0, 0, p.size, p.size);
  } else {
    ctx.fillStyle = '#8080ff'; // flat tangent normal
    ctx.fillRect(0, 0, p.size, p.size);
  }

  ctx.lineCap = 'round';
  for (let i = 0; i < p.strokeCount; i++) {
    const x = Math.random() * p.size;
    const y = Math.random() * p.size;
    const len = p.fiberLen * (0.6 + Math.random() * 0.7);
    // Strands point generally "up" (-y) with per-strand lean + curl.
    const lean = (Math.random() - 0.5) * 0.9;
    const dx = Math.sin(lean) + (Math.random() - 0.5) * p.curl * 1.2;
    const dy = -Math.cos(lean);
    const midCurl = (Math.random() - 0.5) * p.curl * len * 0.6;

    ctx.lineWidth = p.thickness * (0.7 + Math.random() * 0.6);
    if (mode === 'albedo') {
      // Root→tip lightening via two passes (cheap gradient).
      ctx.globalAlpha = 0.5 + Math.random() * 0.4;
      ctx.strokeStyle = Math.random() < 0.5 ? p.base : p.tip;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + dx * len * 0.5 + midCurl, y + dy * len * 0.5, x + dx * len, y + dy * len);
      ctx.stroke();
    } else {
      // Fake a raised strand: bright (toward +x/+y) edge and dark edge.
      const side = (Math.random() - 0.5) * 80;
      ctx.globalAlpha = 0.35 + Math.random() * 0.3;
      ctx.strokeStyle = `rgb(${clamp(128 + side, 40, 220) | 0},${clamp(128 + side * 0.6, 40, 220) | 0},255)`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + dx * len * 0.5 + midCurl, y + dy * len * 0.5, x + dx * len, y + dy * len);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  return c;
}

/**
 * Build a fur albedo + matching normal map for a plush style. Headless callers
 * get bare textures (no canvas) so material construction stays side-effect-free
 * off the browser.
 */
export function furTexture(style: FurStyle): { map: THREE.Texture; normal: THREE.Texture } {
  const p = furParams(style);
  if (headless()) {
    const map = new THREE.Texture();
    const normal = new THREE.Texture();
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, normal };
  }
  const map = new THREE.CanvasTexture(paintFur(p, 'albedo'));
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(p.repeat[0], p.repeat[1]);

  const normal = new THREE.CanvasTexture(paintFur(p, 'normal'));
  normal.colorSpace = THREE.NoColorSpace;
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(p.repeat[0], p.repeat[1]);

  return { map, normal };
}
