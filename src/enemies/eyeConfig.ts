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
export interface EyeConfig {
  /** Left eye centre, normalized model-box coords [0..1]. */
  left: [number, number, number];
  /** Right eye centre, normalized model-box coords [0..1]. */
  right: [number, number, number];
  /** Glow gate radius in UV space; omit to use config.enemyGlow.eyeUvRadius. */
  radius?: number;
}

// <apo:gen eyeConfig>
export const EYE_CONFIG: Record<string, EyeConfig> = {
  pou: { left: [0.1575, 0.81, 0.8435], right: [0.7888, 0.8275, 0.9422], radius: 0.61 },
  fuggie: { left: [0.4, 0.8, 0.92], right: [0.6, 0.8, 0.92], radius: 0.16 },
  littleTimmy: { left: [0.46, 0.82, 0.45], right: [0.54, 0.82, 0.45], radius: 0.16 },
  newYama: { left: [0.45, 0.85, 0.95], right: [0.6, 0.85, 0.95], radius: 0.16 },
};
// </apo:gen>
