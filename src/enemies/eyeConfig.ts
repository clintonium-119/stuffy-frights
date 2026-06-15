/**
 * Per-enemy glowing-eye positions (keyed by the canonical enemy id = GLB file
 * name = rig-config key). Coords are in the SAME normalized model-box space the
 * rig uses ([0..1]: x = left→right, y = bottom→top, z = back→front, +Z front),
 * so an eye sits at `min + coord * size` of the mesh bbox. Each centre seeds an
 * emissive glow over the dark PAINTED eye pixels near it (see eyeGlow.ts), so
 * the whole almond lights up and tracks the head. Colour / intensity / default
 * glow radius / dark threshold are global knobs in `config.enemyGlow`.
 *
 * Authored in the dev viewer's rig edit mode (drag the eye handles). The
 * declaration below is a write-to-source region: "save eyes to source"
 * regenerates everything between the markers, so edit in the viewer, not inline.
 */
/** A hand-painted glow region: a disc in UV space (rig editor paint tool). */
export interface GlowStamp {
  /** Stamp centre in UV space [0..1]. */
  u: number;
  v: number;
  /** Stamp radius in UV space. */
  r: number;
}

export interface EyeConfig {
  /** Left eye centre, normalized model-box coords [0..1]. */
  left: [number, number, number];
  /** Right eye centre, normalized model-box coords [0..1]. */
  right: [number, number, number];
  /** Glow gate radius in UV space; omit to use config.enemyGlow.eyeUvRadius. */
  radius?: number;
  /** Extra hand-painted glow regions, unioned with the two eye gates. Painted by
   * clicking the mesh in the rig editor (each click stamps a UV disc). */
  stamps?: GlowStamp[];
}

// <apo:gen eyeConfig>
export const EYE_CONFIG: Record<string, EyeConfig> = {
  pou: { left: [0.1575, 0.81, 0.8435], right: [0.7888, 0.8275, 0.9422], radius: 0, stamps: [{ u: 0.8114, v: 0.2623, r: 0.08 }, { u: 0.4315, v: 0.2776, r: 0.08 }, { u: 0.517, v: 0.2867, r: 0.08 }, { u: 0.8343, v: 0.1634, r: 0.08 }, { u: 0.4944, v: 0.3194, r: 0.08 }, { u: 0.2757, v: 0.3602, r: 0.08 }, { u: 0.2752, v: 0.2791, r: 0.08 }, { u: 0.5954, v: 0.3085, r: 0.08 }, { u: 0.8004, v: 0.2443, r: 0.08 }, { u: 0.6607, v: 0.6871, r: 0.08 }, { u: 0.7922, v: 0.2534, r: 0.08 }, { u: 0.453, v: 0.2055, r: 0.08 }, { u: 0.5145, v: 0.778, r: 0.08 }, { u: 0.8082, v: 0.303, r: 0.08 }, { u: 0.4312, v: 0.301, r: 0.08 }, { u: 0.3111, v: 0.4312, r: 0.08 }, { u: 0.8793, v: 0.1257, r: 0.08 }] },
  fuggie: { left: [0.2208, 0.7597, 1], right: [0.7525, 0.7192, 0.9901], radius: 0, stamps: [{ u: 0.5941, v: 0.5661, r: 0.08 }, { u: 0.4367, v: 0.0733, r: 0.08 }, { u: 0.8301, v: 0.1987, r: 0.08 }, { u: 0.9434, v: 0.3076, r: 0.08 }, { u: 0.0407, v: 0.0435, r: 0.08 }, { u: 0.84, v: 0.076, r: 0.08 }, { u: 0.8423, v: 0.1397, r: 0.08 }, { u: 0.9743, v: 0.6388, r: 0.08 }, { u: 0.4478, v: 0.2311, r: 0.08 }, { u: 0.4348, v: 0.0772, r: 0.08 }, { u: 0.4393, v: 0.0644, r: 0.08 }, { u: 0.4156, v: 0.0685, r: 0.08 }, { u: 0.4226, v: 0.0772, r: 0.08 }, { u: 0.4125, v: 0.0883, r: 0.08 }, { u: 0.4121, v: 0.0879, r: 0.08 }, { u: 0.9776, v: 0.1953, r: 0.08 }, { u: 0.1654, v: 0.0569, r: 0.08 }, { u: 0.8603, v: 0.562, r: 0.08 }, { u: 0.584, v: 0.6058, r: 0.08 }, { u: 0.5921, v: 0.5993, r: 0.08 }, { u: 0.614, v: 0.5743, r: 0.08 }, { u: 0.6231, v: 0.5757, r: 0.08 }, { u: 0.6161, v: 0.5616, r: 0.08 }, { u: 0.9701, v: 0.5339, r: 0.08 }, { u: 0.6162, v: 0.5817, r: 0.08 }, { u: 0.6179, v: 0.5832, r: 0.08 }, { u: 0.6301, v: 0.5772, r: 0.08 }, { u: 0.6258, v: 0.5877, r: 0.08 }, { u: 0.6258, v: 0.5877, r: 0.08 }, { u: 0.6159, v: 0.5623, r: 0.08 }, { u: 0.8456, v: 0.1572, r: 0.08 }, { u: 0.8457, v: 0.1523, r: 0.08 }, { u: 0.8434, v: 0.1482, r: 0.08 }, { u: 0.8366, v: 0.1401, r: 0.08 }, { u: 0.8357, v: 0.1385, r: 0.08 }, { u: 0.4748, v: 0.3361, r: 0.08 }, { u: 0.8142, v: 0.6043, r: 0.08 }, { u: 0.9652, v: 0.4794, r: 0.08 }] },
  littleTimmy: { left: [0.4409, 0.6948, 0.5465], right: [0.5409, 0.6934, 0.5354], radius: 0, stamps: [{ u: 0.3131, v: 0.3201, r: 0.01 }, { u: 0.3094, v: 0.3117, r: 0.01 }, { u: 0.0099, v: 0.1198, r: 0.01 }, { u: 0.3192, v: 0.3095, r: 0.01 }, { u: 0.0438, v: 0.1268, r: 0.01 }, { u: 0.0343, v: 0.1284, r: 0.01 }, { u: 0.0525, v: 0.1355, r: 0.01 }, { u: 0.0482, v: 0.1352, r: 0.01 }, { u: 0.0503, v: 0.1291, r: 0.01 }, { u: 0.0465, v: 0.1257, r: 0.01 }, { u: 0.0415, v: 0.1267, r: 0.01 }, { u: 0.0382, v: 0.1264, r: 0.01 }, { u: 0.0419, v: 0.1404, r: 0.01 }, { u: 0.0366, v: 0.1363, r: 0.01 }, { u: 0.034, v: 0.1253, r: 0.01 }, { u: 0.0403, v: 0.1239, r: 0.01 }, { u: 0.0428, v: 0.1212, r: 0.01 }, { u: 0.0399, v: 0.1212, r: 0.01 }, { u: 0.0368, v: 0.1227, r: 0.01 }, { u: 0.034, v: 0.1265, r: 0.01 }, { u: 0.0316, v: 0.1299, r: 0.01 }, { u: 0.0507, v: 0.124, r: 0.01 }, { u: 0.0507, v: 0.124, r: 0.01 }, { u: 0.0546, v: 0.1316, r: 0.01 }, { u: 0.0546, v: 0.1316, r: 0.01 }, { u: 0.0546, v: 0.1382, r: 0.01 }, { u: 0.0492, v: 0.1419, r: 0.01 }, { u: 0.0548, v: 0.1325, r: 0.01 }, { u: 0.0564, v: 0.1283, r: 0.01 }, { u: 0.0455, v: 0.121, r: 0.01 }, { u: 0.0088, v: 0.1261, r: 0.01 }, { u: 0.0087, v: 0.1277, r: 0.01 }, { u: 0.3091, v: 0.3045, r: 0.01 }, { u: 0.3148, v: 0.3034, r: 0.01 }, { u: 0.3148, v: 0.3034, r: 0.01 }, { u: 0.3169, v: 0.3049, r: 0.01 }, { u: 0.3227, v: 0.308, r: 0.01 }, { u: 0.3227, v: 0.308, r: 0.01 }, { u: 0.3216, v: 0.304, r: 0.01 }, { u: 0.3197, v: 0.309, r: 0.01 }, { u: 0.3178, v: 0.3177, r: 0.01 }, { u: 0.3193, v: 0.3155, r: 0.01 }, { u: 0.3194, v: 0.3153, r: 0.01 }, { u: 0.3202, v: 0.3124, r: 0.01 }, { u: 0.3171, v: 0.3234, r: 0.01 }, { u: 0.3127, v: 0.3211, r: 0.01 }, { u: 0.0105, v: 0.1149, r: 0.01 }, { u: 0.3141, v: 0.3206, r: 0.01 }, { u: 0.3141, v: 0.3206, r: 0.01 }, { u: 0.3138, v: 0.3232, r: 0.01 }, { u: 0.0114, v: 0.1163, r: 0.01 }, { u: 0.0118, v: 0.1217, r: 0.01 }, { u: 0.0123, v: 0.1262, r: 0.01 }, { u: 0.0311, v: 0.0733, r: 0.01 }, { u: 0.0367, v: 0.0772, r: 0.01 }, { u: 0.0238, v: 0.073, r: 0.01 }, { u: 0.0153, v: 0.0738, r: 0.01 }, { u: 0.0059, v: 0.0741, r: 0.01 }, { u: 0.0121, v: 0.073, r: 0.01 }] },
  newYama: { left: [0.45, 0.85, 0.95], right: [0.6, 0.85, 0.95], radius: 0, stamps: [{ u: 0.1909, v: 0.241, r: 0.08 }, { u: 0.962, v: 0.3509, r: 0.08 }, { u: 0.8353, v: 0.7424, r: 0.08 }] },
};
// </apo:gen>
