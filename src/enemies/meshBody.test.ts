import { describe, it, expect } from 'vitest';
import { ENEMY_MODEL } from './projectionConfig';
import { ENEMY_TUNING } from './tuningConfig';
import { RIG_CONFIG } from './rigConfig';

/**
 * The four enemy bodies are Meshy GLBs wired by id → model → rig/height. These
 * lookups must stay in sync (a missing entry = an enemy with no body, wrong
 * size, or no rig). Pure-data invariant — the actual GLB load/rig/render is
 * verified in-browser (no jsdom).
 */
describe('Meshy enemy body wiring', () => {
  const ids = Object.keys(ENEMY_MODEL);

  it('covers the four enemies', () => {
    expect(ids.sort()).toEqual(['charles', 'fuggie', 'newYama', 'poo']);
  });

  for (const id of Object.keys(ENEMY_MODEL)) {
    it(`${id} maps to a model with a height + rig config`, () => {
      const model = ENEMY_MODEL[id];
      expect(model).toBeTruthy();
      expect(ENEMY_TUNING[id].height).toBeGreaterThan(0);
      expect(RIG_CONFIG[model]).toBeTruthy();
      expect(RIG_CONFIG[model][0].name).toBe('root');
    });
  }
});
