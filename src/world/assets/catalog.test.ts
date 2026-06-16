import { describe, it, expect } from 'vitest';
import {
  interiorModels,
  interiorModelById,
  interiorCategories,
  interiorModelsByCategory,
  footprintCells,
  normalizationOverride,
} from './catalog';

describe('interior model catalog', () => {
  it('has the full converted pack', () => {
    expect(interiorModels.length).toBe(123);
  });

  it('every entry is well-formed', () => {
    for (const m of interiorModels) {
      expect(m.id).toBeTruthy();
      expect(m.file).toBe(`${m.id}.glb`);
      expect(m.category).toBeTruthy();
      expect(m.dims.x).toBeGreaterThan(0);
      expect(m.dims.y).toBeGreaterThan(0);
      expect(m.dims.z).toBeGreaterThan(0);
    }
  });

  it('ids are unique', () => {
    const ids = new Set(interiorModels.map((m) => m.id));
    expect(ids.size).toBe(interiorModels.length);
  });

  it('category is the id prefix before the first underscore', () => {
    for (const m of interiorModels) {
      expect(m.category).toBe(m.id.split('_')[0]);
    }
  });

  it('looks models up by id', () => {
    const first = interiorModels[0];
    expect(interiorModelById(first.id)).toEqual(first);
    expect(interiorModelById('NoSuchModel')).toBeUndefined();
  });

  it('exposes a sorted, non-empty category list', () => {
    const cats = interiorCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect([...cats].sort()).toEqual(cats);
  });
});

describe('interior registry', () => {
  it('lists models by category', () => {
    for (const cat of interiorCategories()) {
      const models = interiorModelsByCategory(cat);
      expect(models.length).toBeGreaterThan(0);
      expect(models.every((m) => m.category === cat)).toBe(true);
    }
    expect(interiorModelsByCategory('NoSuchCategory')).toEqual([]);
  });

  it('computes a floor footprint in cells (>=1, scales with cell size)', () => {
    const m = { id: 't', file: 't.glb', category: 't', dims: { x: 1.6, y: 1, z: 3.9 } };
    expect(footprintCells(m, 0.5)).toEqual({ x: 4, z: 8 });
    expect(footprintCells(m, 2)).toEqual({ x: 1, z: 2 });
    const tiny = { ...m, dims: { x: 0.1, y: 0.1, z: 0.1 } };
    expect(footprintCells(tiny, 0.5)).toEqual({ x: 1, z: 1 });
  });

  it('defaults normalization to identity (no overrides yet)', () => {
    const o = normalizationOverride(interiorModels[0].id);
    expect(o.scale ?? 1).toBe(1);
    expect(o.yawDeg ?? 0).toBe(0);
  });
});
