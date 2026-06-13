import { describe, it, expect, afterEach } from 'vitest';
import { config } from './config';
import {
  applyDifficulty,
  DIFFICULTY_ORDER,
  DIFFICULTY_PRESETS,
  DIFFICULTY_META,
  DEFAULT_DIFFICULTY,
} from './difficulty';

// Snapshot the pristine base config before any overlay, and restore it after
// each test so applyDifficulty's in-place mutation doesn't leak between cases.
const BASE = structuredClone(config);

type Any = Record<string, unknown>;
function deepAssign(target: Any, src: Any): void {
  for (const k of Object.keys(src)) {
    const v = src[k];
    if (Array.isArray(v)) target[k] = v.slice();
    else if (v !== null && typeof v === 'object') deepAssign(target[k] as Any, v as Any);
    else target[k] = v;
  }
}
function restore(): void {
  deepAssign(config as unknown as Any, BASE as unknown as Any);
}
function effective(level: Parameters<typeof applyDifficulty>[0]) {
  restore();
  applyDifficulty(level);
  return structuredClone(config);
}

afterEach(restore);

describe('difficulty model', () => {
  it('exposes four levels with names/tiers and defaults to medium', () => {
    expect(DIFFICULTY_ORDER).toEqual(['easy', 'medium', 'hard', 'nightmare']);
    expect(DEFAULT_DIFFICULTY).toBe('medium');
    expect(DIFFICULTY_META.easy.name).toBe('Tuck-In');
    expect(DIFFICULTY_META.nightmare.name).toBe('Stuffy FrightMare');
    for (const lvl of DIFFICULTY_ORDER) {
      expect(DIFFICULTY_META[lvl].tier).toBeTruthy();
      expect(DIFFICULTY_META[lvl].description.length).toBeGreaterThan(20);
    }
  });

  it('merges a level overlay into the shared config object', () => {
    applyDifficulty('nightmare');
    expect(config.ai.chaseSpeed).toBe(5.3);
    expect(config.battery.drainSeconds).toBe(60);
    expect(config.player.stamina.drainSeconds).toBe(4);
    // restored afterEach
  });

  it('clones preset arrays so later config writes do not mutate the preset', () => {
    applyDifficulty('easy');
    config.visibility.ambientIntensityByFloor[0] = 999;
    expect(DIFFICULTY_PRESETS.easy.visibility!.ambientIntensityByFloor![0]).toBe(0.04375);
  });

  it('keeps every level within the deep-darkness budget, basement darkest', () => {
    for (const level of DIFFICULTY_ORDER) {
      restore();
      applyDifficulty(level);
      const amb = config.visibility.ambientIntensityByFloor;
      const hemi = config.visibility.hemisphereIntensityByFloor;
      for (const a of amb) {
        expect(a).toBeGreaterThan(0);
        expect(a).toBeLessThanOrEqual(0.15);
      }
      for (const h of hemi) expect(h).toBeLessThanOrEqual(0.08);
      expect(Math.min(...amb)).toBe(amb[0]); // floor 0 = basement stays darkest
    }
  });

  it('grades Easy→Nightmare in the expected directions', () => {
    const e = effective('easy');
    const m = effective('medium');
    const h = effective('hard');
    const n = effective('nightmare');
    // Harder = sees/hears more, chases faster, remembers longer.
    expect(e.ai.visionLightOff).toBeLessThan(n.ai.visionLightOff);
    expect(e.ai.hearWalk).toBeLessThan(n.ai.hearWalk);
    expect(e.ai.chaseSpeed).toBeLessThan(n.ai.chaseSpeed);
    expect(e.ai.memorySeconds).toBeLessThan(n.ai.memorySeconds);
    // Monotonic vision across all four rungs.
    expect(e.ai.visionLightOff).toBeLessThanOrEqual(m.ai.visionLightOff);
    expect(m.ai.visionLightOff).toBeLessThanOrEqual(h.ai.visionLightOff);
    expect(h.ai.visionLightOff).toBeLessThanOrEqual(n.ai.visionLightOff);
    // Easier = more battery + a longer grace period.
    expect(e.battery.drainSeconds).toBeGreaterThan(n.battery.drainSeconds);
    expect(e.ai.gracePeriod).toBeGreaterThan(n.ai.gracePeriod);
    // Cross-floor pursuit: bounded 0..1, and Easy gives up far more than Nightmare.
    for (const c of [e, m, h, n]) {
      expect(c.ai.crossFloorPursuit).toBeGreaterThanOrEqual(0);
      expect(c.ai.crossFloorPursuit).toBeLessThanOrEqual(1);
    }
    expect(e.ai.crossFloorPursuit).toBeLessThan(n.ai.crossFloorPursuit);
  });
});
