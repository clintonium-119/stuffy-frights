import { describe, it, expect } from 'vitest';
import { ENEMY_TUNING } from './tuningConfig';
import { RIG_CONFIG } from './rigConfig';
import { EYE_CONFIG } from './eyeConfig';

/**
 * The four enemy bodies are Meshy GLBs keyed by the canonical enemy id (= GLB
 * file name = rig-config key). These lookups must stay in sync (a missing entry
 * = an enemy with no body, wrong size, or no rig). Pure-data invariant — the
 * actual GLB load/rig/render is verified in-browser (no jsdom).
 */
describe('Meshy enemy body wiring', () => {
  const ids = Object.keys(ENEMY_TUNING);

  it('covers the four enemies', () => {
    expect(ids.sort()).toEqual(['fuggie', 'littleTimmy', 'newYama', 'pou']);
  });

  for (const id of Object.keys(ENEMY_TUNING)) {
    it(`${id} has a height + rig config`, () => {
      expect(ENEMY_TUNING[id].height).toBeGreaterThan(0);
      expect(RIG_CONFIG[id]).toBeTruthy();
      expect(RIG_CONFIG[id][0].name).toBe('root');
    });

    it(`${id} has eye config + a head bone to parent eyes to`, () => {
      const eye = EYE_CONFIG[id];
      expect(eye).toBeTruthy();
      expect(eye.left).toHaveLength(3);
      expect(eye.right).toHaveLength(3);
      // Eyes parent to the head bone — it must exist in the rig.
      expect(RIG_CONFIG[id].some((b) => b.name === 'head')).toBe(true);
    });
  }
});
