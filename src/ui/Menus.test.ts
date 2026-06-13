import { describe, it, expect } from 'vitest';
import { ENEMY_NAMES, DIFFICULTY_FONTS } from './Menus';
import { DIFFICULTY_ORDER, DIFFICULTY_META, DEFAULT_DIFFICULTY } from '../core/difficulty';

describe('ENEMY_NAMES display names', () => {
  it('renders the Gorilla Tag plush as Little Timmy and the blob as Pou', () => {
    expect(ENEMY_NAMES.charles).toBe('LITTLE TIMMY');
    expect(ENEMY_NAMES.poo).toBe('POU');
  });

  it('leaves New Yama and Fuggie unchanged', () => {
    expect(ENEMY_NAMES.newYama).toBe('NEW YAMA');
    expect(ENEMY_NAMES.fuggie).toBe('FUGGIE');
  });
});

// Menus is DOM-heavy and the project tests pure logic (no jsdom dependency — see
// MapOverlay.test which asserts floorDrawRecord, not the canvas). So here we assert
// the data contract the difficulty-select screen is built from; the live screen
// interaction (build, highlight, click → onSelectDifficulty) is verified in-browser.
describe('difficulty-select data contract', () => {
  it('has an accent font for every difficulty level, no extras', () => {
    for (const lvl of DIFFICULTY_ORDER) {
      expect(DIFFICULTY_FONTS[lvl]).toBeTruthy();
      expect(DIFFICULTY_FONTS[lvl]).toMatch(/'[^']+'/); // a quoted family name
    }
    expect(Object.keys(DIFFICULTY_FONTS).sort()).toEqual([...DIFFICULTY_ORDER].sort());
  });

  it('references the bundled font families', () => {
    const bundled = ['Patrick Hand', 'Special Elite', 'Eater', 'Nosifer'];
    const used = DIFFICULTY_ORDER.map((l) => DIFFICULTY_FONTS[l]);
    for (const fam of bundled) expect(used.some((f) => f.includes(fam))).toBe(true);
  });

  it('every level has a name + tier + description to render, default medium', () => {
    expect(DEFAULT_DIFFICULTY).toBe('medium');
    for (const lvl of DIFFICULTY_ORDER) {
      const m = DIFFICULTY_META[lvl];
      expect(m.name.length).toBeGreaterThan(0);
      expect(m.tier.length).toBeGreaterThan(0);
      expect(m.description.length).toBeGreaterThan(20);
    }
  });
});
