import { describe, it, expect } from 'vitest';
import { Rng } from './rng';

describe('Rng', () => {
  it('produces an identical sequence for the same seed', () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    for (let i = 0; i < 100; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = new Rng(1);
    const b = new Rng(2);
    const seqA = Array.from({ length: 10 }, () => a.next());
    const seqB = Array.from({ length: 10 }, () => b.next());
    expect(seqA).not.toEqual(seqB);
  });

  it('randInt stays within inclusive bounds', () => {
    const rng = new Rng(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng.randInt(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it('randInt covers both endpoints', () => {
    const rng = new Rng(7);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) seen.add(rng.randInt(0, 2));
    expect(seen).toEqual(new Set([0, 1, 2]));
  });

  it('pick returns elements from the array and throws on empty', () => {
    const rng = new Rng(9);
    const items = ['a', 'b', 'c'];
    for (let i = 0; i < 100; i++) {
      expect(items).toContain(rng.pick(items));
    }
    expect(() => rng.pick([])).toThrow();
  });

  it('shuffle returns a permutation (same multiset, original untouched)', () => {
    const rng = new Rng(11);
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = rng.shuffle(items);
    expect(shuffled).not.toBe(items);
    expect([...shuffled].sort((x, y) => x - y)).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('chance(0) is never true and chance(1) is always true', () => {
    const rng = new Rng(13);
    for (let i = 0; i < 100; i++) {
      expect(rng.chance(0)).toBe(false);
      expect(rng.chance(1)).toBe(true);
    }
  });
});
