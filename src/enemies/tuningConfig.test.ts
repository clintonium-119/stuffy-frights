import { describe, it, expect } from 'vitest';
import { ENEMY_TUNING, DEFAULT_ANIM, DEFAULT_GAMEPLAY, EnemyAnimTuning } from './tuningConfig';

const ANIM_KEYS: Array<keyof EnemyAnimTuning> = [
  'swingRate',
  'legSwing',
  'armSwing',
  'headYaw',
  'headPitch',
  'bobRate',
  'bob',
  'squash',
  'rock',
];

describe('ENEMY_TUNING', () => {
  const ids = ['pou', 'fuggie', 'littleTimmy', 'newYama'];

  it('has a complete anim block + positive height for every enemy', () => {
    for (const id of ids) {
      const t = ENEMY_TUNING[id];
      expect(t).toBeDefined();
      for (const k of ANIM_KEYS) expect(typeof t.anim[k]).toBe('number');
      expect(t.height).toBeGreaterThan(0);
    }
  });

  // Anim magnitudes are live-tuned in the viewer, so assert the gait-distinguishing
  // SHAPE (which never changes), not the exact tuned numbers.
  it('gait-distinguishing body shape: hop squashes, shuffle rocks, others neither', () => {
    expect(ENEMY_TUNING.pou.anim.squash).toBeGreaterThan(0); // hop
    expect(ENEMY_TUNING.fuggie.anim.rock).toBeGreaterThan(0); // shuffle
    expect(ENEMY_TUNING.littleTimmy.anim.squash).toBe(0);
    expect(ENEMY_TUNING.littleTimmy.anim.rock).toBe(0);
    expect(ENEMY_TUNING.newYama.anim.squash).toBe(0);
    expect(ENEMY_TUNING.newYama.anim.rock).toBe(0);
  });

  it('gameplay multipliers default to 1.0 (no-op vs the global baseline)', () => {
    for (const id of ids) {
      const g = ENEMY_TUNING[id].gameplay;
      expect([g.speedMult, g.visionMult, g.hearingMult, g.threatMult, g.scaleMult]).toEqual([1, 1, 1, 1, 1]);
    }
  });

  it('exposes neutral fallbacks', () => {
    expect(typeof DEFAULT_ANIM.legSwing).toBe('number');
    expect(DEFAULT_GAMEPLAY).toEqual({ speedMult: 1, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1 });
  });
});
