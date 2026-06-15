import { describe, it, expect } from 'vitest';
import { ENEMY_TUNING, DEFAULT_ANIM, EnemyAnimTuning } from './tuningConfig';

describe('ENEMY_TUNING anim defaults', () => {
  const ids = ['poo', 'fuggie', 'charles', 'newYama'];

  it('has an anim block for every enemy', () => {
    for (const id of ids) expect(ENEMY_TUNING[id]?.anim).toBeDefined();
  });

  it('shares the swing / head defaults across enemies', () => {
    for (const id of ids) {
      const a = ENEMY_TUNING[id].anim;
      expect(a.swingRate).toBe(2.6);
      expect(a.legSwing).toBe(0.45);
      expect(a.armSwing).toBe(0.5);
      expect(a.headYaw).toBe(0.7);
      expect(a.headPitch).toBe(0.7);
    }
  });

  it('keeps each gait body-bob default (matches the prior hardcoded constants)', () => {
    const pou = ENEMY_TUNING.poo.anim;
    expect([pou.bobRate, pou.bob, pou.squash, pou.rock]).toEqual([3.2, 0.18, 0.28, 0]);
    const fug = ENEMY_TUNING.fuggie.anim;
    expect([fug.bobRate, fug.bob, fug.squash, fug.rock]).toEqual([3.6, 0.05, 0, 0.07]);
    for (const id of ['charles', 'newYama']) {
      const a = ENEMY_TUNING[id].anim;
      expect([a.bobRate, a.bob, a.squash, a.rock]).toEqual([2.6, 0.03, 0, 0]);
    }
  });

  it('DEFAULT_ANIM is a neutral trot-style fallback', () => {
    const d: EnemyAnimTuning = DEFAULT_ANIM;
    expect([d.bobRate, d.bob, d.squash, d.rock]).toEqual([2.6, 0.03, 0, 0]);
    expect(d.legSwing).toBe(0.45);
  });
});
