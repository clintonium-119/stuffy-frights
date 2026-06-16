import { describe, it, expect } from 'vitest';
import { config } from '../core/config';
import { ATMO_KNOB_GROUPS, allAtmoKnobs, atmoGet, atmoSet } from './atmosphereKnobs';

describe('atmosphereKnobs registry', () => {
  const knobs = allAtmoKnobs();

  it('every knob path resolves to a number on config (floor knobs read floor 1)', () => {
    for (const k of knobs) {
      const v = atmoGet(config, k, 1);
      expect(typeof v, `${k.group}.${k.key}`).toBe('number');
    }
  });

  it('FLOOR-scoped knobs back onto a length-4 per-floor array', () => {
    const floorKnobs = knobs.filter((k) => k.scope === 'floor');
    expect(floorKnobs.length).toBeGreaterThan(0);
    for (const k of floorKnobs) {
      const arr = (config[k.group] as unknown as Record<string, number[]>)[k.key];
      expect(Array.isArray(arr), `${k.key} is array`).toBe(true);
      expect(arr.length, `${k.key} length`).toBe(4);
    }
  });

  it('number knobs bracket their default (color knobs use the full hex range)', () => {
    for (const k of knobs) {
      const v = atmoGet(config, k, 1);
      expect(v, `${k.key} >= min`).toBeGreaterThanOrEqual(k.min);
      expect(v, `${k.key} <= max`).toBeLessThanOrEqual(k.max);
    }
  });

  it('scope and kind are well-formed; no duplicate group+key', () => {
    const seen = new Set<string>();
    for (const k of knobs) {
      expect(['global', 'floor']).toContain(k.scope);
      expect(['number', 'color']).toContain(k.kind);
      const id = `${k.group}.${k.key}`;
      expect(seen.has(id), `duplicate ${id}`).toBe(false);
      seen.add(id);
    }
    expect(ATMO_KNOB_GROUPS.every((g) => g.knobs.length > 0 && g.title.length > 0)).toBe(true);
  });

  it('atmoSet writes back the floor entry without disturbing siblings', () => {
    const floorKnob = knobs.find((k) => k.scope === 'floor')!;
    const before = atmoGet(config, floorKnob, 0);
    const other = atmoGet(config, floorKnob, 2);
    atmoSet(config, floorKnob, 0, before + 0.01);
    expect(atmoGet(config, floorKnob, 0)).toBeCloseTo(before + 0.01, 6);
    expect(atmoGet(config, floorKnob, 2)).toBe(other); // sibling floor untouched
    atmoSet(config, floorKnob, 0, before); // restore
  });
});
