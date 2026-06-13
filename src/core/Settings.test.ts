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

describe('SettingsStore — ironman ladder', () => {
  it('starts at Easy and advances one rung per win up to completion', () => {
    const s = new SettingsStore(fakeBackend());
    s.startIronman();
    expect(s.isIronmanActive()).toBe(true);
    expect(s.getIronman().currentLevel).toBe('easy');
    expect(s.ironmanRung()).toBe(1);
    s.advanceIronman(); // easy → medium
    expect(s.getIronman().currentLevel).toBe('medium');
    expect(s.ironmanRung()).toBe(2);
    s.advanceIronman(); // medium → hard
    s.advanceIronman(); // hard → nightmare
    expect(s.getIronman().currentLevel).toBe('nightmare');
    expect(s.isIronmanActive()).toBe(true);
    s.advanceIronman(); // win nightmare → complete
    const im = s.getIronman();
    expect(im.active).toBe(false);
    expect(im.bestStreak).toBe(4);
    expect(im.bestLevelReached).toBe('nightmare');
  });

  it('a death resets the ladder to Easy and records the rung reached', () => {
    const s = new SettingsStore(fakeBackend());
    s.startIronman();
    s.advanceIronman(); // medium
    s.advanceIronman(); // hard
    s.failIronman();
    const im = s.getIronman();
    expect(im.active).toBe(false);
    expect(im.currentLevel).toBe('easy');
    expect(im.bestLevelReached).toBe('hard');
    expect(im.bestStreak).toBe(2); // cleared easy + medium before dying on hard
  });

  it('abandoning leaves the ladder without recording a death', () => {
    const s = new SettingsStore(fakeBackend());
    s.startIronman();
    s.advanceIronman();
    s.abandonIronman();
    expect(s.isIronmanActive()).toBe(false);
    expect(s.getIronman().currentLevel).toBe('easy');
  });

  it('persists the ladder across store instances (a reload)', () => {
    const b = fakeBackend();
    const s1 = new SettingsStore(b);
    s1.startIronman();
    s1.advanceIronman(); // now on medium
    const s2 = new SettingsStore(b);
    expect(s2.isIronmanActive()).toBe(true);
    expect(s2.getIronman().currentLevel).toBe('medium');
  });
});

describe('SettingsStore — statsSummary', () => {
  it('aggregates per-difficulty games/winRate/bestStreak + ironman best', () => {
    const s = new SettingsStore(fakeBackend());
    s.recordRun({ difficulty: 'hard', won: true });
    s.recordRun({ difficulty: 'hard', won: true });
    s.recordRun({ difficulty: 'hard', won: false }); // 2/3 = 67%, best streak 2
    s.startIronman();
    s.advanceIronman(); // medium
    s.failIronman(); // best streak 1, furthest medium
    const sum = s.statsSummary();
    expect(sum.perDifficulty.hard).toEqual({ games: 3, winRate: 67, bestStreak: 2 });
    expect(sum.ironman.bestStreak).toBe(1);
    expect(sum.ironman.bestLevelReached).toBe('medium');
  });

  it('a fresh profile summarizes to all zeros with no furthest rung', () => {
    const sum = new SettingsStore(fakeBackend()).statsSummary();
    for (const lvl of ['easy', 'medium', 'hard', 'nightmare'] as const) {
      expect(sum.perDifficulty[lvl]).toEqual({ games: 0, winRate: 0, bestStreak: 0 });
    }
    expect(sum.ironman.bestStreak).toBe(0);
    expect(sum.ironman.bestLevelReached).toBeNull();
  });
});
