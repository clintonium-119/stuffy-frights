import { describe, it, expect } from 'vitest';
import {
  edgeBetween,
  blocksMovement,
  blocksSight,
  soundCrossing,
  computeRoomIds,
  type EdgeGrids,
} from './edges';
import { isWalkable, type CellKind } from './layoutTypes';
import { house } from './houseLayout';

describe('edge model', () => {
  // A 3x2 single-floor fixture authored directly on the edge model: a left room
  // and a right room split by a wall (row 0) and a doorway (row 1).
  //   grid  row0: floor|wall|floor   row1: floor|door|floor
  const grids: CellKind[][][] = [
    [
      ['floor', 'wall', 'floor'],
      ['floor', 'door', 'floor'],
    ],
  ];
  const edges: EdgeGrids = {
    edgesV: [
      [
        ['wall', 'wall', 'none'], // z0: floor|wall, wall|floor
        ['door', 'door', 'none'], // z1: floor|door, door|floor
      ],
    ],
    edgesH: [
      [
        ['none', 'door', 'none'], // z0→z1: open, wall|door, open
        ['none', 'none', 'none'],
      ],
    ],
  };

  it('has wall edges between the wall cell and its neighbours', () => {
    expect(edgeBetween(edges, 0, { x: 0, z: 0 }, { x: 1, z: 0 })).toBe('wall');
    expect(edgeBetween(edges, 0, { x: 1, z: 0 }, { x: 2, z: 0 })).toBe('wall');
  });

  it('has door edges between the door cell and its neighbours', () => {
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

  it('blocks sight on wall and undiscovered secrets, not open doors', () => {
    expect(blocksSight('wall')).toBe(true);
    expect(blocksSight('door')).toBe(false);
    // A secret edge conceals until revealed, then passes sight + movement.
    expect(blocksSight('secret')).toBe(true);
    expect(blocksSight('secret', true)).toBe(false);
    expect(blocksMovement('secret')).toBe(true);
    expect(blocksMovement('secret', true)).toBe(false);
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

  it('room ids enclose by edges: cells joined by an open edge share a room', () => {
    // Across the whole house, any two orthogonally-adjacent walkable cells with
    // an open (`none`) edge between them belong to the same room — the flood
    // never splits an open span, and never spills past a wall/door edge.
    const eg = { edgesV: house.edgesV, edgesH: house.edgesH };
    for (let f = 0; f < house.grids.length; f++) {
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          if (!isWalkable(house.grids[f][z][x])) continue;
          for (const [dx, dz] of [
            [1, 0],
            [0, 1],
          ] as const) {
            const nx = x + dx;
            const nz = z + dz;
            if (nx >= house.width || nz >= house.depth) continue;
            if (!isWalkable(house.grids[f][nz][nx])) continue;
            if (edgeBetween(eg, f, { x, z }, { x: nx, z: nz }) !== 'none') continue;
            expect(house.roomId[f][z][x], `${f}:${x},${z}~${nx},${nz}`).toBe(
              house.roomId[f][nz][nx]
            );
          }
        }
      }
    }
  });

  it('the mansion house has edges sized to its grid', () => {
    expect(house.edgesV.length).toBe(house.grids.length);
    expect(house.edgesH.length).toBe(house.grids.length);
    expect(house.edgesV[0].length).toBe(house.depth);
    expect(house.edgesV[0][0].length).toBe(house.width);
  });
});
