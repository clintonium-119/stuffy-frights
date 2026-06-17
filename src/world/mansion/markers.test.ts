import { describe, it, expect } from 'vitest';
import { buildMansion } from './index';
import {
  PLAYER_SPAWNS,
  ENEMY_SPAWNS,
  HIDING_SPOTS,
  CHARGING_STATIONS,
  KEY_CANDIDATES,
  EXITS,
  FURNITURE,
} from './markers';
import { resolveFurniture } from '../Props';
import { edgeBetween } from '../edges';
import { isWalkable, type CellPos } from '../layoutTypes';

describe('mansion gameplay markers', () => {
  const house = buildMansion();
  const walkable = (c: CellPos) => isWalkable(house.grids[c.floor]?.[c.z]?.[c.x] ?? 'void');

  it('applyMarkers surfaces every marker table on the house', () => {
    expect(house.playerSpawns).toHaveLength(PLAYER_SPAWNS.length);
    expect(house.enemySpawns).toHaveLength(ENEMY_SPAWNS.length);
    expect(house.hidingSpots).toHaveLength(HIDING_SPOTS.length);
    expect(house.chargingStations).toHaveLength(CHARGING_STATIONS.length);
    expect(house.keyCandidates).toHaveLength(KEY_CANDIDATES.length);
    expect(house.exits).toHaveLength(EXITS.length);
    expect(house.playerSpawn).toEqual(PLAYER_SPAWNS[0]);
  });

  it('every marker sits on a walkable cell', () => {
    const all: { what: string; pos: CellPos }[] = [
      ...PLAYER_SPAWNS.map((p) => ({ what: 'playerSpawn', pos: p })),
      ...ENEMY_SPAWNS.map((e) => ({ what: `enemy ${e.enemy}`, pos: e.pos })),
      ...HIDING_SPOTS.map((h) => ({ what: `hiding ${h.kind}`, pos: h.pos })),
      ...CHARGING_STATIONS.map((c) => ({ what: 'charging', pos: c })),
      ...KEY_CANDIDATES.map((c) => ({ what: 'key', pos: c })),
      ...EXITS.map((e) => ({ what: `exit ${e.id}`, pos: e.pos })),
    ];
    for (const { what, pos } of all) {
      expect(walkable(pos), `${what} at ${pos.floor}:${pos.x},${pos.z}`).toBe(true);
    }
  });

  it('spawns, keys, charging stations and exits are clear of solid furniture', () => {
    const solid = resolveFurniture(FURNITURE, house.width, house.depth).solidCells;
    const clearMarkers: { what: string; pos: CellPos }[] = [
      ...PLAYER_SPAWNS.map((p) => ({ what: 'spawn', pos: p })),
      ...ENEMY_SPAWNS.map((e) => ({ what: `enemy ${e.enemy}`, pos: e.pos })),
      ...KEY_CANDIDATES.map((c) => ({ what: 'key', pos: c })),
      ...CHARGING_STATIONS.map((c) => ({ what: 'charging', pos: c })),
      ...EXITS.map((e) => ({ what: `exit ${e.id}`, pos: e.pos })),
    ];
    for (const { what, pos } of clearMarkers) {
      expect(solid.has(`${pos.floor}:${pos.x},${pos.z}`), `${what} ${pos.floor}:${pos.x},${pos.z}`).toBe(
        false
      );
    }
  });

  it('spreads key candidates and charging stations across multiple floors', () => {
    expect(new Set(KEY_CANDIDATES.map((c) => c.floor)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(CHARGING_STATIONS.map((c) => c.floor)).size).toBeGreaterThanOrEqual(3);
  });

  it('offers one exit per id', () => {
    expect(new Set(EXITS.map((e) => e.id)).size).toBe(EXITS.length);
  });

  it('mounts every charging station against a wall (edge or envelope)', () => {
    for (const c of CHARGING_STATIONS) {
      const hasWall = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dz]) => {
        const nx = c.x + dx;
        const nz = c.z + dz;
        const envelope = nx < 0 || nz < 0 || nx >= house.width || nz >= house.depth;
        return envelope || edgeBetween(house, c.floor, c, { x: nx, z: nz }) === 'wall';
      });
      expect(hasWall, `charging ${c.floor}:${c.x},${c.z} has no adjacent wall`).toBe(true);
    }
  });
});
