import { describe, it, expect } from 'vitest';
import { Objectives, rollObjectives, keyExclusion } from './Objectives';
import { house } from '../world/houseLayout';

const ck = (c: { floor: number; x: number; z: number }) => `${c.floor}:${c.x},${c.z}`;

describe('objective randomization', () => {
  it('is deterministic per seed', () => {
    const a = rollObjectives(house, 1234);
    const b = rollObjectives(house, 1234);
    expect(a).toEqual(b);
  });

  it('always picks a real key candidate, a real exit, and a real spawn', () => {
    for (let seed = 0; seed < 50; seed++) {
      const roll = rollObjectives(house, seed * 7919 + 3);
      expect(house.keyCandidates).toContainEqual(roll.keyLocation);
      expect(['A', 'B', 'C']).toContain(roll.correctExit);
      expect(house.playerSpawns).toContainEqual(roll.playerSpawn);
    }
  });

  it('places the key off the main floor the large majority of the time', () => {
    let mainCount = 0;
    const N = 300;
    for (let seed = 0; seed < N; seed++) {
      const roll = rollObjectives(house, seed * 104729 + 17);
      if (roll.keyLocation.floor === 2) mainCount++; // main floor = index 2
    }
    expect(mainCount / N).toBeLessThan(0.2); // rarely on the main floor
  });

  it('never places the key in an excluded cell (spawn/connected room or stair-adjacent)', () => {
    for (let seed = 0; seed < 300; seed++) {
      const roll = rollObjectives(house, seed * 7919 + 11);
      const excl = keyExclusion(house, roll.playerSpawn);
      expect(excl.has(ck(roll.keyLocation)), `seed ${seed}: key in excluded cell`).toBe(false);
    }
  });

  it('spawns are all in the children-bedroom floor and away from stairs; the pick varies by seed', () => {
    const stairCells = new Set<string>();
    for (const s of house.stairs)
      for (const fl of [s.lower, s.upper]) for (const c of s.cells) stairCells.add(`${fl}:${c.x},${c.z}`);
    const stairAdjacent = (c: { floor: number; x: number; z: number }) =>
      [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dz]) => stairCells.has(`${c.floor}:${c.x + dx},${c.z + dz}`));
    expect(house.playerSpawns.length).toBeGreaterThanOrEqual(3);
    for (const s of house.playerSpawns) {
      expect(s.floor).toBe(3); // upstairs (the children's bedrooms)
      expect(stairAdjacent(s), `spawn ${ck(s)} is stair-adjacent`).toBe(false);
    }
    const picked = new Set<string>();
    for (let seed = 0; seed < 100; seed++) picked.add(ck(rollObjectives(house, seed * 31 + 5).playerSpawn));
    expect(picked.size).toBeGreaterThanOrEqual(2); // multiple spawns actually used
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
