import { describe, it, expect } from 'vitest';
import {
  interiorModels,
  interiorModelById,
  interiorCategories,
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
