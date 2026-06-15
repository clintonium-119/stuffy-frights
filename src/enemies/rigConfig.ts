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
 *
 * The declaration below is a write-to-source region: the dev viewer's "save to
 * source" regenerates everything between the markers, so inline edits inside
 * the region are overwritten on the next save (edit in the viewer instead).
 */
// <apo:gen rigConfig>
export const RIG_CONFIG: Record<string, RigConfig> = {
  pou: [
    { name: 'root', pivot: [0.5, 0.4, 0.5] },
    { name: 'head', pivot: [0.5, 0.686, 0.606], box: { min: [0.083, 0.672, 0.28], max: [1, 1, 1] }, falloff: 0.1 },
  ],
  fuggler: [
    { name: 'root', pivot: [0.5, 0.4, 0.5] },
    { name: 'head', pivot: [0.5, 0.6, 0.5], box: { min: [0.04, 0.62, 0], max: [0.96, 1, 1] }, falloff: 0.1 },
    { name: 'armL', pivot: [0.2, 0.47, 0.5], box: { min: [0, 0.34, 0.24], max: [0.22, 0.6, 0.78] }, falloff: 0.05 },
    { name: 'armR', pivot: [0.8, 0.47, 0.5], box: { min: [0.78, 0.34, 0.24], max: [1, 0.6, 0.78] }, falloff: 0.05 },
    { name: 'legFL', pivot: [0.3, 0.2, 0.5], box: { min: [0.06, 0, 0.2], max: [0.46, 0.22, 0.82] }, falloff: 0.05 },
    { name: 'legFR', pivot: [0.7, 0.2, 0.5], box: { min: [0.54, 0, 0.2], max: [0.94, 0.22, 0.82] }, falloff: 0.05 },
  ],
  gorilla: [
    { name: 'root', pivot: [0.5, 0.45, 0.5] },
    { name: 'head', pivot: [0.5, 0.74, 0.45], box: { min: [0.3, 0.74, 0.2], max: [0.7, 1, 0.95] }, falloff: 0.08 },
    { name: 'armL', pivot: [0.33, 0.5, 0.38], box: { min: [0, 0, 0.1], max: [0.34, 0.58, 1] }, falloff: 0.05 },
    { name: 'armR', pivot: [0.67, 0.5, 0.38], box: { min: [0.66, 0, 0.1], max: [1, 0.58, 1] }, falloff: 0.05 },
  ],
  llama: [
    { name: 'root', pivot: [0.5, 0.5, 0.5] },
    { name: 'head', pivot: [0.5, 0.6, 0.7], box: { min: [0.28, 0.56, 0.52], max: [0.72, 1, 1] }, falloff: 0.09 },
    { name: 'legFL', pivot: [0.32, 0.48, 0.72], box: { min: [0, 0, 0.5], max: [0.5, 0.5, 1] }, falloff: 0.07 },
    { name: 'legFR', pivot: [0.68, 0.48, 0.72], box: { min: [0.5, 0, 0.5], max: [1, 0.5, 1] }, falloff: 0.07 },
    { name: 'legHL', pivot: [0.32, 0.48, 0.28], box: { min: [0, 0, 0], max: [0.5, 0.5, 0.5] }, falloff: 0.07 },
    { name: 'legHR', pivot: [0.68, 0.48, 0.28], box: { min: [0.5, 0, 0], max: [1, 0.5, 0.5] }, falloff: 0.07 },
  ],
};
// </apo:gen>
