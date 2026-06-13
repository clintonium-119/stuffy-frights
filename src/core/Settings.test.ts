import { describe, it, expect } from 'vitest';
import { SettingsStore } from './Settings';

/** A Map-backed storage shim, so persistence is testable without a DOM. */
function fakeBackend() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
    _map: m,
  };
}

describe('SettingsStore — defaults & persistence', () => {
  it('returns medium + zeroed stats + inactive ironman on a fresh profile', () => {
    const s = new SettingsStore(fakeBackend());
    expect(s.getLastDifficulty()).toBe('medium');
    expect(s.winRate('hard')).toBe(0);
    expect(s.getStats().easy).toEqual({ wins: 0, losses: 0, bestStreak: 0, currentStreak: 0 });
    expect(s.isIronmanActive()).toBe(false);
  });

  it('round-trips the last difficulty across store instances over one backend', () => {
    const b = fakeBackend();
    new SettingsStore(b).setLastDifficulty('nightmare');
    expect(new SettingsStore(b).getLastDifficulty()).toBe('nightmare');
  });

  it('falls back to defaults on corrupt JSON', () => {
    const corrupt = { getItem: () => 'not-json{{', setItem: () => {} };
    expect(new SettingsStore(corrupt).getLastDifficulty()).toBe('medium');
  });

  it('falls back to defaults on an unrecognized schema version', () => {
    const wrongVersion = {
      getItem: () => JSON.stringify({ version: 99, lastDifficulty: 'hard' }),
      setItem: () => {},
    };
    expect(new SettingsStore(wrongVersion).getLastDifficulty()).toBe('medium');
  });

  it('works with no injected backend (in-memory fallback, no DOM)', () => {
    // localStorage is undefined under the node test env → memory backend.
    const s = new SettingsStore();
    expect(() => s.setLastDifficulty('easy')).not.toThrow();
    expect(s.getLastDifficulty()).toBe('easy');
  });
});

describe('SettingsStore — stats & streak math', () => {
  it('tallies wins/losses and tracks current + best streak', () => {
    const s = new SettingsStore(fakeBackend());
    s.recordRun({ difficulty: 'hard', won: true });
    s.recordRun({ difficulty: 'hard', won: true });
    s.recordRun({ difficulty: 'hard', won: false }); // breaks the streak
    s.recordRun({ difficulty: 'hard', won: true });
    const st = s.getStats().hard;
    expect(st.wins).toBe(3);
    expect(st.losses).toBe(1);
    expect(st.currentStreak).toBe(1);
    expect(st.bestStreak).toBe(2);
  });

  it('computes win rate as a rounded percentage, 0 with no games', () => {
    const s = new SettingsStore(fakeBackend());
    expect(s.winRate('medium')).toBe(0);
    s.recordRun({ difficulty: 'medium', won: true });
    s.recordRun({ difficulty: 'medium', won: true });
    s.recordRun({ difficulty: 'medium', won: false }); // 2/3 = 67%
    expect(s.winRate('medium')).toBe(67);
  });

  it('keeps per-difficulty stats independent', () => {
    const s = new SettingsStore(fakeBackend());
    s.recordRun({ difficulty: 'easy', won: true });
    s.recordRun({ difficulty: 'nightmare', won: false });
    expect(s.getStats().easy.wins).toBe(1);
    expect(s.getStats().nightmare.losses).toBe(1);
    expect(s.getStats().easy.losses).toBe(0);
  });
});
