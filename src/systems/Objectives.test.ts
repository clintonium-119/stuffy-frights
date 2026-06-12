import { describe, it, expect } from 'vitest';
import { Objectives, rollObjectives } from './Objectives';
import { house } from '../world/houseLayout';

describe('objective randomization', () => {
  it('is deterministic per seed', () => {
    const a = rollObjectives(house, 1234);
    const b = rollObjectives(house, 1234);
    expect(a).toEqual(b);
  });

  it('always picks from the candidate pool and a real exit', () => {
    for (let seed = 0; seed < 50; seed++) {
      const roll = rollObjectives(house, seed * 7919 + 3);
      expect(house.keyCandidates).toContainEqual(roll.keyLocation);
      expect(['A', 'B', 'C']).toContain(roll.correctExit);
    }
  });

  it('covers every candidate and every exit across many seeds', () => {
    const keys = new Set<string>();
    const exits = new Set<string>();
    for (let seed = 0; seed < 200; seed++) {
      const roll = rollObjectives(house, seed * 104729 + 17);
      keys.add(`${roll.keyLocation.floor}:${roll.keyLocation.x},${roll.keyLocation.z}`);
      exits.add(roll.correctExit);
    }
    expect(keys.size).toBe(house.keyCandidates.length);
    expect(exits).toEqual(new Set(['A', 'B', 'C']));
  });
});

describe('Objectives flow', () => {
  it('exits are locked without the key', () => {
    const o = new Objectives(house, 42);
    expect(o.tryExit('A')).toBe('locked');
    expect(o.escaped).toBe(false);
  });

  it('wrong exits reject the key; the right one opens and wins', () => {
    const o = new Objectives(house, 42);
    let won = false;
    o.onWin = () => (won = true);
    o.takeKey();
    expect(o.hasKey).toBe(true);
    const wrong = (['A', 'B', 'C'] as const).filter((id) => id !== o.setup.correctExit);
    for (const id of wrong) expect(o.tryExit(id)).toBe('wrongKey');
    expect(won).toBe(false);
    expect(o.tryExit(o.setup.correctExit)).toBe('open');
    expect(won).toBe(true);
    expect(o.escaped).toBe(true);
    expect(o.triedExits.size).toBe(3);
  });

  it('takeKey is idempotent and fires the hook once', () => {
    const o = new Objectives(house, 7);
    let taken = 0;
    o.onKeyTaken = () => taken++;
    o.takeKey();
    o.takeKey();
    expect(taken).toBe(1);
  });
});
