import { describe, it, expect } from 'vitest';
import { MansionBuilder } from './build';
import { validateMansion } from './validate';
import { edgeBetween } from '../edges';

describe('mansion authoring builder + validator', () => {
  it('builds a clean, connected two-room house (room + door)', () => {
    const b = new MansionBuilder(8, 5, 1);
    b.room(0, { x0: 1, z0: 1, x1: 3, z1: 3 });
    b.room(0, { x0: 4, z0: 1, x1: 6, z1: 3 });
    b.door(0, { x: 3, z: 2 }, { x: 4, z: 2 });
    expect(validateMansion(b.build())).toEqual([]);
  });

  it('flags a disconnected region (two rooms, no door)', () => {
    const b = new MansionBuilder(8, 5, 1);
    b.room(0, { x0: 1, z0: 1, x1: 3, z1: 3 });
    b.room(0, { x0: 4, z0: 1, x1: 6, z1: 3 });
    const issues = validateMansion(b.build());
    expect(issues).toHaveLength(1);
    expect(issues[0].kind).toBe('disconnected');
  });

  it('flags an unenclosed room (perimeter opened to the void)', () => {
    const b = new MansionBuilder(8, 5, 1);
    b.room(0, { x0: 1, z0: 1, x1: 3, z1: 3 });
    b.open(0, { x: 1, z: 2 }, { x: 0, z: 2 }); // knock a hole to outside
    const issues = validateMansion(b.build());
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ kind: 'unenclosed', floor: 0, x: 1, z: 2 });
  });

  it('flags a dangling door (door edge with a non-walkable side)', () => {
    const b = new MansionBuilder(8, 5, 1);
    b.room(0, { x0: 1, z0: 1, x1: 3, z1: 3 });
    b.door(0, { x: 1, z: 2 }, { x: 0, z: 2 }); // door into the void
    const issues = validateMansion(b.build());
    expect(issues).toHaveLength(1);
    expect(issues[0].kind).toBe('dangling-door');
  });

  it('flags a misaligned stair column (cell not stair on a joined floor)', () => {
    const b = new MansionBuilder(8, 5, 2);
    b.room(0, { x0: 1, z0: 1, x1: 6, z1: 3 });
    b.room(1, { x0: 1, z0: 1, x1: 6, z1: 3 });
    b.stair({ lower: 0, upper: 1, cells: [{ x: 6, z: 1 }, { x: 6, z: 2 }] });
    const house = b.build();
    expect(validateMansion(house)).toEqual([]); // aligned + connected across floors
    house.grids[1][1][6] = 'floor'; // break the upper landing of the column
    const issues = validateMansion(house);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ kind: 'misaligned', floor: 1, x: 6, z: 1 });
  });

  it('flags a chute that does not drop vertically', () => {
    const b = new MansionBuilder(8, 5, 2);
    b.room(0, { x0: 1, z0: 1, x1: 6, z1: 3 });
    b.room(1, { x0: 1, z0: 1, x1: 6, z1: 3 });
    b.chute({ floor: 1, x: 3, z: 2 }, { floor: 0, x: 5, z: 2 });
    const issues = validateMansion(b.build());
    expect(issues).toHaveLength(1);
    expect(issues[0].kind).toBe('misaligned');
    expect(issues[0].message).toContain('vertically aligned');
  });

  it('expresses a corridor and a secret edge and stays clean', () => {
    const b = new MansionBuilder(10, 6, 1);
    b.room(0, { x0: 1, z0: 1, x1: 3, z1: 4 });
    b.corridor(0, { x0: 4, z0: 1, x1: 4, z1: 4 });
    b.room(0, { x0: 5, z0: 1, x1: 7, z1: 4 });
    b.door(0, { x: 3, z: 2 }, { x: 4, z: 2 });
    b.door(0, { x: 4, z: 3 }, { x: 5, z: 3 });
    b.secret(0, { x: 4, z: 1 }, { x: 5, z: 1 });
    const house = b.build();
    expect(validateMansion(house)).toEqual([]);
    expect(edgeBetween(house, 0, { x: 4, z: 1 }, { x: 5, z: 1 })).toBe('secret');
  });

  it('expresses vent, stair, chute, and window primitives', () => {
    const b = new MansionBuilder(7, 3, 2);
    // A 1-cell crawl bored between two rooms, mouths opened, sides walled.
    b.room(0, { x0: 1, z0: 1, x1: 2, z1: 1 });
    b.room(0, { x0: 4, z0: 1, x1: 5, z1: 1 });
    b.vent(0, [{ x: 3, z: 1 }]);
    b.open(0, { x: 3, z: 1 }, { x: 2, z: 1 });
    b.open(0, { x: 3, z: 1 }, { x: 4, z: 1 });
    b.wall(0, { x: 3, z: 1 }, { x: 3, z: 0 });
    b.wall(0, { x: 3, z: 1 }, { x: 3, z: 2 });
    b.stair({ lower: 0, upper: 1, cells: [{ x: 1, z: 1 }] });
    b.room(1, { x0: 1, z0: 1, x1: 2, z1: 1 });
    b.chute({ floor: 1, x: 1, z: 1 }, { floor: 0, x: 1, z: 1 });
    b.window({ floor: 0, x: 1, z: 1, edge: 'h' });
    const house = b.build();
    expect(house.grids[0][1][3]).toBe('vent');
    expect(house.vents).toHaveLength(1);
    expect(house.grids[0][1][1]).toBe('stair');
    expect(house.grids[1][1][1]).toBe('stair');
    expect(house.stairs).toHaveLength(1);
    expect(house.chutes).toHaveLength(1);
    expect(house.windows).toHaveLength(1);
    // The crawl connects both rooms with no enclosure leak.
    expect(validateMansion(house).filter((i) => i.kind === 'unenclosed')).toEqual([]);
  });
});
