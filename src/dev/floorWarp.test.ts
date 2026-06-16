import { describe, it, expect } from 'vitest';
import { NavGraph } from '../ai/NavGraph';
import { house } from '../world/houseLayout';
import { PROP_PLACEMENTS } from '../world/Props';
import { Rng } from '../core/rng';
import { FLOOR_NAMES } from '../world/layoutTypes';
import { clampFloor, floorWarpNode } from './floorWarp';

function solidCells(): Set<string> {
  const solid = new Set<string>();
  PROP_PLACEMENTS.forEach((p) => {
    if (p.kind !== 'coatRack') solid.add(`${p.pos.floor}:${p.pos.x},${p.pos.z}`);
  });
  house.hidingSpots.forEach((h) => solid.add(`${h.pos.floor}:${h.pos.x},${h.pos.z}`));
  return solid;
}
const nav = new NavGraph(house, solidCells());

describe('clampFloor', () => {
  it('clamps out-of-range and rounds fractional floors', () => {
    expect(clampFloor(-5)).toBe(0);
    expect(clampFloor(99)).toBe(FLOOR_NAMES.length - 1);
    expect(clampFloor(1.4)).toBe(1);
    expect(clampFloor(2)).toBe(2);
  });
});

describe('floorWarpNode', () => {
  it('returns a node on the requested floor', () => {
    for (let f = 0; f < FLOOR_NAMES.length; f++) {
      const node = floorWarpNode(nav, f, new Rng(1));
      expect(node, `floor ${f} has a node`).not.toBeNull();
      expect(node!.floor).toBe(f);
    }
  });

  it('clamps an invalid floor request onto a valid floor', () => {
    const node = floorWarpNode(nav, 99, new Rng(1));
    expect(node).not.toBeNull();
    expect(node!.floor).toBe(FLOOR_NAMES.length - 1);
  });

  it('is deterministic for a fixed seed', () => {
    const a = floorWarpNode(nav, 1, new Rng(7));
    const b = floorWarpNode(nav, 1, new Rng(7));
    expect(a).toEqual(b);
  });
});
