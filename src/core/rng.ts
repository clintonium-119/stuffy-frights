/** Seeded RNG (mulberry32) — deterministic per seed, headless-testable. */
export class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** Uniform float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform integer in [min, max] inclusive. */
  randInt(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Random element of a non-empty array. */
  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('pick() on empty array');
    return items[this.randInt(0, items.length - 1)];
  }

  /** Fisher–Yates shuffle returning a new array. */
  shuffle<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.randInt(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }
}
