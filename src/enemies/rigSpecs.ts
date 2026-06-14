import { RigSpec, smooth } from './Skinning';

/**
 * Per-model skeletons (keyed by texture-model prefix). Pivots + region weights
 * are in normalized bbox coords [0..1]; +Z is the model front. The shared
 * articulation drives the named bones: `head` (gaze/look-down), `legFL/FR/HL/HR`
 * (walk + stair foot-placement). The gorilla's arms get a rest rotation to
 * neutralize the splayed photo pose.
 */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const RIG_SPECS: Record<string, RigSpec> = {
  // Pou — body + eye-pods on top. Head bone tilts the eyes (proven).
  pou: {
    rootBase: 0.3,
    bones: [
      { name: 'root', pivot: [0.5, 0.25, 0.5], weight: () => 0 },
      { name: 'head', pivot: [0.5, 0.58, 0.5], weight: (_x, y) => smooth(0.5, 0.72, y) },
    ],
  },

  // Fuggie — pillow body + head (eyes/ears) on top.
  fuggler: {
    rootBase: 0.3,
    bones: [
      { name: 'root', pivot: [0.5, 0.35, 0.5], weight: () => 0 },
      { name: 'head', pivot: [0.5, 0.7, 0.5], weight: (_x, y) => smooth(0.64, 0.82, y) },
    ],
  },

  // Charles (gorilla) — head on top + two long arms; arms rotated down to
  // neutralize the splayed photo pose.
  gorilla: {
    rootBase: 0.28,
    bones: [
      { name: 'root', pivot: [0.5, 0.42, 0.5], weight: () => 0 },
      { name: 'head', pivot: [0.5, 0.8, 0.5], weight: (_x, y) => smooth(0.72, 0.9, y) },
      {
        name: 'armL',
        pivot: [0.34, 0.56, 0.5],
        weight: (x, y) => (1 - smooth(0.2, 0.44, x)) * smooth(0.32, 0.55, y) * (1 - smooth(0.6, 0.78, y)),
        rest: [0, 0, 1.3], // swing the -X arm down
      },
      {
        name: 'armR',
        pivot: [0.66, 0.56, 0.5],
        weight: (x, y) => smooth(0.56, 0.8, x) * smooth(0.32, 0.55, y) * (1 - smooth(0.6, 0.78, y)),
        rest: [0, 0, -1.3], // swing the +X arm down
      },
    ],
  },

  // NewYama (llama) — neck/head (front-upper) + four legs (lower quadrants).
  llama: {
    rootBase: 0.25,
    bones: [
      { name: 'root', pivot: [0.5, 0.45, 0.5], weight: () => 0 },
      { name: 'head', pivot: [0.5, 0.72, 0.78], weight: (_x, y, z) => smooth(0.55, 0.72, y) * smooth(0.45, 0.65, z) },
      { name: 'legFL', pivot: [0.32, 0.42, 0.72], weight: (x, y, z) => smooth(0.45, 0.26, y) * (1 - smooth(0.35, 0.55, x)) * smooth(0.45, 0.65, z) },
      { name: 'legFR', pivot: [0.68, 0.42, 0.72], weight: (x, y, z) => smooth(0.45, 0.26, y) * smooth(0.45, 0.65, x) * smooth(0.45, 0.65, z) },
      { name: 'legHL', pivot: [0.32, 0.42, 0.28], weight: (x, y, z) => smooth(0.45, 0.26, y) * (1 - smooth(0.35, 0.55, x)) * (1 - smooth(0.35, 0.55, z)) },
      { name: 'legHR', pivot: [0.68, 0.42, 0.28], weight: (x, y, z) => smooth(0.45, 0.26, y) * smooth(0.45, 0.65, x) * (1 - smooth(0.35, 0.55, z)) },
    ],
  },
};

void clamp01;
