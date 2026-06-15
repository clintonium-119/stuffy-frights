import { describe, it, expect } from 'vitest';
import { RIG_CONFIG } from './rigConfig';

describe('RIG_CONFIG', () => {
  const models = Object.keys(RIG_CONFIG);

  it('covers the four enemies', () => {
    expect(models.sort()).toEqual(['fuggie', 'littleTimmy', 'newYama', 'pou']);
  });

  for (const [model, bones] of Object.entries(RIG_CONFIG)) {
    describe(model, () => {
      it('has root as bones[0] with no box', () => {
        expect(bones[0].name).toBe('root');
        expect(bones[0].box).toBeUndefined();
      });

      it('has unique bone names', () => {
        const names = bones.map((b) => b.name);
        expect(new Set(names).size).toBe(names.length);
      });

      it('keeps every pivot + box within the normalized bbox and min < max', () => {
        for (const b of bones) {
          for (const p of b.pivot) expect(p).toBeGreaterThanOrEqual(0), expect(p).toBeLessThanOrEqual(1);
          if (b.box) {
            for (let a = 0; a < 3; a++) {
              expect(b.box.min[a]).toBeGreaterThanOrEqual(0);
              expect(b.box.max[a]).toBeLessThanOrEqual(1);
              expect(b.box.min[a]).toBeLessThan(b.box.max[a]);
            }
          }
        }
      });

      it('has a head bone (gaze target)', () => {
        expect(bones.some((b) => b.name === 'head')).toBe(true);
      });
    });
  }

  it('littleTimmy has both arms', () => {
    const names = RIG_CONFIG.littleTimmy.map((b) => b.name);
    expect(names).toContain('armL');
    expect(names).toContain('armR');
  });

  it('newYama has four legs', () => {
    const names = RIG_CONFIG.newYama.map((b) => b.name);
    expect(names).toEqual(expect.arrayContaining(['legFL', 'legFR', 'legHL', 'legHR']));
  });
});
