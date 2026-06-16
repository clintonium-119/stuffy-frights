import { describe, it, expect } from 'vitest';
import { config } from '../core/config';
import { AI_KNOB_GROUPS, allAiKnobs } from './aiKnobs';

describe('aiKnobs registry', () => {
  const knobs = allAiKnobs();

  it('every knob path is a real numeric config.ai key', () => {
    for (const k of knobs) {
      const v = config.ai[k.path];
      expect(typeof v, `${k.path} should be a number`).toBe('number');
    }
  });

  it('every knob range brackets the shipped default (min ≤ default ≤ max)', () => {
    for (const k of knobs) {
      const v = config.ai[k.path] as number;
      expect(v, `${k.path} >= min`).toBeGreaterThanOrEqual(k.min);
      expect(v, `${k.path} <= max`).toBeLessThanOrEqual(k.max);
      expect(k.min, `${k.path} min < max`).toBeLessThan(k.max);
      expect(k.step, `${k.path} step > 0`).toBeGreaterThan(0);
    }
  });

  it('has no duplicate paths', () => {
    const paths = knobs.map((k) => k.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('groups are non-empty and titled', () => {
    expect(AI_KNOB_GROUPS.length).toBeGreaterThan(0);
    for (const g of AI_KNOB_GROUPS) {
      expect(g.title.length).toBeGreaterThan(0);
      expect(g.knobs.length).toBeGreaterThan(0);
    }
  });
});
