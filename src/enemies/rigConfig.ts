import { RigConfig } from './rigWeights';

/**
 * Per-model rig configs (keyed by the GLB model name). Each bone has a pivot +
 * weight-region box in normalized bbox coords [0..1] (x = left→right, y =
 * bottom→top, z = back→front, +Z is the model front). bones[0] is the root and
 * holds the remainder weight. The shared articulation drives the named bones:
 * `head` (gaze / look-down), `armL`/`armR` (arm-walk), `legFL/FR/HL/HR` (walk +
 * stair foot placement). Boxes span the WHOLE limb so the whole limb moves —
 * authored/refined in the dev viewer's rig edit mode. No rest rotations: the
 * rest pose reproduces the source GLB exactly.
 */
export const RIG_CONFIG: Record<string, RigConfig> = {
  // Pou — round body, two eye-pods at the top-front. The head bone tilts the pods.
  pou: [
    { name: 'root', pivot: [0.5, 0.4, 0.5] },
    { name: 'head', pivot: [0.5, 0.64, 0.42], box: { min: [0.12, 0.64, 0.28], max: [0.88, 1.0, 1.0] }, falloff: 0.1 },
  ],

  // Fuggie — pillow body with stubby arm-nubs at the lower-mid sides and foot-
  // nubs at the bottom corners. Head turns the upper third (eyes + maw); the
  // short arms swing fore/aft and the feet alternate-step for the shuffle.
  // Pivots sit at the inner edge of each nub so it swings without warping the
  // body core.
  fuggler: [
    { name: 'root', pivot: [0.5, 0.4, 0.5] },
    { name: 'head', pivot: [0.5, 0.6, 0.5], box: { min: [0.04, 0.62, 0.0], max: [0.96, 1.0, 1.0] }, falloff: 0.1 },
    { name: 'armL', pivot: [0.2, 0.47, 0.5], box: { min: [0.0, 0.34, 0.24], max: [0.22, 0.6, 0.78] }, falloff: 0.05 },
    { name: 'armR', pivot: [0.8, 0.47, 0.5], box: { min: [0.78, 0.34, 0.24], max: [1.0, 0.6, 0.78] }, falloff: 0.05 },
    { name: 'legFL', pivot: [0.3, 0.2, 0.5], box: { min: [0.06, 0.0, 0.2], max: [0.46, 0.22, 0.82] }, falloff: 0.05 },
    { name: 'legFR', pivot: [0.7, 0.2, 0.5], box: { min: [0.54, 0.0, 0.2], max: [0.94, 0.22, 0.82] }, falloff: 0.05 },
  ],

  // Charles (gorilla) — head on top + two long arms splayed to the sides. The
  // arm boxes span each arm end-to-end so the WHOLE arm swings (not the shoulder).
  gorilla: [
    { name: 'root', pivot: [0.5, 0.45, 0.5] },
    { name: 'head', pivot: [0.5, 0.74, 0.45], box: { min: [0.3, 0.74, 0.2], max: [0.7, 1.0, 0.95] }, falloff: 0.08 },
    // The arms splay out + droop: shoulder ~(x0.33,y0.5,z0.38) → hand ~(x0,y0.13,z0.85).
    // Boxes reach down to the hands (low y) + forward (high z) but stop BEFORE the
    // torso (centre x≈0.4-0.6) so the arm rotates at the shoulder without dragging
    // / stretching the body. The shoulder pivot is at the box's inner edge.
    { name: 'armL', pivot: [0.33, 0.5, 0.38], box: { min: [0.0, 0.0, 0.1], max: [0.34, 0.58, 1.0] }, falloff: 0.05 },
    { name: 'armR', pivot: [0.67, 0.5, 0.38], box: { min: [0.66, 0.0, 0.1], max: [1.0, 0.58, 1.0] }, falloff: 0.05 },
  ],

  // NewYama (llama) — neck/head up front + four legs in the lower quadrants.
  llama: [
    { name: 'root', pivot: [0.5, 0.5, 0.5] },
    { name: 'head', pivot: [0.5, 0.6, 0.7], box: { min: [0.28, 0.56, 0.52], max: [0.72, 1.0, 1.0] }, falloff: 0.09 },
    { name: 'legFL', pivot: [0.32, 0.48, 0.72], box: { min: [0.0, 0.0, 0.5], max: [0.5, 0.5, 1.0] }, falloff: 0.07 },
    { name: 'legFR', pivot: [0.68, 0.48, 0.72], box: { min: [0.5, 0.0, 0.5], max: [1.0, 0.5, 1.0] }, falloff: 0.07 },
    { name: 'legHL', pivot: [0.32, 0.48, 0.28], box: { min: [0.0, 0.0, 0.0], max: [0.5, 0.5, 0.5] }, falloff: 0.07 },
    { name: 'legHR', pivot: [0.68, 0.48, 0.28], box: { min: [0.5, 0.0, 0.0], max: [1.0, 0.5, 0.5] }, falloff: 0.07 },
  ],
};
