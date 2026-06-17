import { describe, it, expect } from 'vitest';
import { resolveFurniture, furnitureFootprint } from './Props';
import { FURNITURE, type FurnitureMarker } from './mansion/markers';
import { buildMansion } from './mansion/index';
import { interiorModelById } from './assets/catalog';
import { isWalkable } from './layoutTypes';

describe('furniture markers', () => {
  const house = buildMansion();

  it('every authored marker sits on a walkable mansion cell', () => {
    for (const m of FURNITURE) {
      const kind = house.grids[m.pos.floor]?.[m.pos.z]?.[m.pos.x];
      expect(kind, `marker ${m.model} at ${m.pos.floor}:${m.pos.x},${m.pos.z}`).toBeDefined();
      expect(isWalkable(kind!), `${m.model} at ${m.pos.floor}:${m.pos.x},${m.pos.z}`).toBe(true);
    }
  });

  it('resolves each marker as either a catalog placement or a fallback prop', () => {
    const r = resolveFurniture(FURNITURE, house.width, house.depth);
    expect(r.instanced.length + r.fallback.length).toBe(FURNITURE.length);
    // The catalog-backed count matches how many markers name a known model id.
    const catalogCount = FURNITURE.filter((m) => interiorModelById(m.model)).length;
    expect(r.instanced).toHaveLength(catalogCount);
  });

  it('reports furniture footprint cells solid for nav, all in-bounds', () => {
    const r = resolveFurniture(FURNITURE, house.width, house.depth);
    expect(r.solidCells.size).toBeGreaterThan(0);
    for (const key of r.solidCells) {
      const [floor, xz] = key.split(':');
      const [x, z] = xz.split(',').map(Number);
      expect(Number(floor)).toBeGreaterThanOrEqual(0);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(house.width);
      expect(z).toBeGreaterThanOrEqual(0);
      expect(z).toBeLessThan(house.depth);
    }
  });

  it('places a known catalog model with a non-empty footprint', () => {
    const marker: FurnitureMarker = { model: 'Bed_King', pos: { floor: 2, x: 20, z: 20 } };
    const r = resolveFurniture([marker], house.width, house.depth);
    expect(r.instanced).toHaveLength(1);
    expect(r.instanced[0].id).toBe('Bed_King');
    expect(r.fallback).toHaveLength(0);
    expect(r.solidCells.size).toBeGreaterThan(0);
  });

  it('falls back to a procedural prop for an unmatched model id', () => {
    const r = resolveFurniture(
      [{ model: 'Not_A_Real_Model', pos: { floor: 2, x: 20, z: 20 } }],
      house.width,
      house.depth
    );
    expect(r.instanced).toHaveLength(0);
    expect(r.fallback).toHaveLength(1);
    expect(r.fallback[0].kind).toBe('crates');
    expect(r.solidCells.has('2:20,20')).toBe(true);
  });

  it('keeps a procedural-only landmark when the marker names a PropKind', () => {
    const r = resolveFurniture(
      [{ model: 'boiler', pos: { floor: 1, x: 28, z: 40 } }],
      house.width,
      house.depth
    );
    expect(r.fallback).toHaveLength(1);
    expect(r.fallback[0].kind).toBe('boiler');
  });

  describe('furnitureFootprint', () => {
    const W = 80;
    const D = 60;

    it('a 1×1 model covers only its own cell', () => {
      const cells = furnitureFootprint({ model: 'x', pos: { floor: 0, x: 10, z: 10 } }, 1, 1, W, D);
      expect(cells).toEqual([{ x: 10, z: 10 }]);
    });

    it('a quarter turn swaps the footprint extents', () => {
      const flat = furnitureFootprint({ model: 'x', pos: { floor: 0, x: 10, z: 10 } }, 3, 1, W, D);
      const turned = furnitureFootprint(
        { model: 'x', pos: { floor: 0, x: 10, z: 10 }, rot: 1 },
        3,
        1,
        W,
        D
      );
      // 3×1 spans x; turned (rot 1) spans z instead.
      expect(new Set(flat.map((c) => c.z)).size).toBe(1);
      expect(new Set(turned.map((c) => c.x)).size).toBe(1);
      expect(flat).toHaveLength(3);
      expect(turned).toHaveLength(3);
    });

    it('clamps cells to the envelope', () => {
      const cells = furnitureFootprint({ model: 'x', pos: { floor: 0, x: 0, z: 0 } }, 4, 4, W, D);
      for (const c of cells) {
        expect(c.x).toBeGreaterThanOrEqual(0);
        expect(c.z).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
