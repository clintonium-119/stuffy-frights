import { describe, it, expect } from 'vitest';
import {
  legacyGridToEdges,
  edgeBetween,
  blocksMovement,
  blocksSight,
  soundCrossing,
  computeRoomIds,
} from './edges';
import type { CellKind } from './layoutTypes';
import { house } from './houseLayout';

describe('edge model', () => {
  // 3x2 single-floor grid:  row0: floor|wall|floor   row1: floor|door|floor
  const grids: CellKind[][][] = [
    [
      ['floor', 'wall', 'floor'],
      ['floor', 'door', 'floor'],
    ],
  ];
  const edges = legacyGridToEdges(grids, 3, 2);

  it('synthesizes wall edges from wall cells', () => {
    expect(edgeBetween(edges, 0, { x: 0, z: 0 }, { x: 1, z: 0 })).toBe('wall');
    expect(edgeBetween(edges, 0, { x: 1, z: 0 }, { x: 2, z: 0 })).toBe('wall');
  });

  it('synthesizes door edges from door cells', () => {
    expect(edgeBetween(edges, 0, { x: 0, z: 1 }, { x: 1, z: 1 })).toBe('door');
    expect(edgeBetween(edges, 0, { x: 1, z: 1 }, { x: 2, z: 1 })).toBe('door');
  });

  it('is open (none) between two floor cells', () => {
    expect(edgeBetween(edges, 0, { x: 0, z: 0 }, { x: 0, z: 1 })).toBe('none');
  });

  it('edgeBetween is order-independent', () => {
    expect(edgeBetween(edges, 0, { x: 1, z: 0 }, { x: 0, z: 0 })).toBe('wall');
  });

  it('blocks movement on wall + undiscovered secret only', () => {
    expect(blocksMovement('wall')).toBe(true);
    expect(blocksMovement('none')).toBe(false);
    expect(blocksMovement('door')).toBe(false);
    expect(blocksMovement('secret')).toBe(true);
    expect(blocksMovement('secret', true)).toBe(false);
  });

  it('blocks sight on wall, not open doors', () => {
    expect(blocksSight('wall')).toBe(true);
    expect(blocksSight('door')).toBe(false);
  });

  it('classifies sound crossings', () => {
    expect(soundCrossing('wall')).toEqual({ blocked: true, door: false });
    expect(soundCrossing('door')).toEqual({ blocked: false, door: true });
    expect(soundCrossing('none')).toEqual({ blocked: false, door: false });
    expect(soundCrossing('secret')).toEqual({ blocked: true, door: false });
  });

  it('floods rooms bounded by wall/door edges', () => {
    // row0: floorA | wall | floorB     row1: floorA | door | floorB
    // The wall+door edges split the grid into a left room and a right room; the
    // door is a boundary for enclosure even though it is passable.
    const r = computeRoomIds(edges, grids, 3, 2);
    expect(r[0][0][0]).toBeGreaterThanOrEqual(0);
    // (0,0) and (0,1) are the same (left) room.
    expect(r[0][0][0]).toBe(r[0][1][0]);
    // (2,0) and (2,1) are the same (right) room.
    expect(r[0][0][2]).toBe(r[0][1][2]);
    // left and right are distinct rooms (separated by wall + door edges).
    expect(r[0][0][0]).not.toBe(r[0][0][2]);
    // the door/wall cells themselves are not walkable here → -1.
    expect(r[0][0][1]).toBe(-1);
  });

  it('labels every walkable cell of the parsed house and leaves voids at -1', () => {
    const { roomId, grids: g, width, depth } = house;
    expect(roomId.length).toBe(g.length);
    let walkableLabeled = true;
    let voidUnlabeled = true;
    for (let f = 0; f < g.length; f++) {
      for (let z = 0; z < depth; z++) {
        for (let x = 0; x < width; x++) {
          const kind = g[f][z][x];
          const id = roomId[f][z][x];
          if (kind === 'void' || kind === 'wall') {
            if (id !== -1) voidUnlabeled = false;
          } else if (id < 0) {
            walkableLabeled = false;
          }
        }
      }
    }
    expect(walkableLabeled).toBe(true);
    expect(voidUnlabeled).toBe(true);
  });

  it('the parsed legacy house has edges sized to its grid', () => {
    expect(house.edgesV.length).toBe(house.grids.length);
    expect(house.edgesH.length).toBe(house.grids.length);
    expect(house.edgesV[0].length).toBe(house.depth);
    expect(house.edgesV[0][0].length).toBe(house.width);
  });
});
