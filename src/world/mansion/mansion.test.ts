import { describe, it, expect } from 'vitest';
import { buildMansion } from './index';
import { validateMansion } from '../authoring/validate';
import { edgeBetween } from '../edges';
import { isWalkable } from '../layoutTypes';
import { FLOOR, FLOOR_COUNT, COLUMN } from './layout';

describe('authored mansion', () => {
  const house = buildMansion();

  it('assembles and validates clean (connected, enclosed, aligned)', () => {
    expect(validateMansion(house)).toEqual([]);
  });

  it('has all five floors, each with walkable space', () => {
    expect(house.grids).toHaveLength(FLOOR_COUNT);
    for (let f = 0; f < FLOOR_COUNT; f++) {
      const walkable = house.grids[f].some((row) => row.some(isWalkable));
      expect(walkable, `floor ${f} has walkable cells`).toBe(true);
    }
  });

  it('gates the sub-level behind the wine-cellar secret jib', () => {
    const jib = edgeBetween(
      house,
      FLOOR.basement,
      { x: COLUMN.cellarSecret.x, z: 53 },
      { x: COLUMN.cellarSecret.x, z: 54 }
    );
    expect(jib).toBe('secret');
  });
});
