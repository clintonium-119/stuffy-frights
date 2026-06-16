import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { groupPlacementsByModel, type ModelPlacement } from './ModelLibrary';

function at(x: number): THREE.Matrix4 {
  return new THREE.Matrix4().makeTranslation(x, 0, 0);
}

describe('groupPlacementsByModel', () => {
  it('groups placements by model id', () => {
    const placements: ModelPlacement[] = [
      { id: 'Bed_1', matrix: at(0) },
      { id: 'Chair_1', matrix: at(1) },
      { id: 'Bed_1', matrix: at(2) },
      { id: 'Bed_1', matrix: at(3) },
    ];
    const groups = groupPlacementsByModel(placements);
    expect([...groups.keys()].sort()).toEqual(['Bed_1', 'Chair_1']);
    expect(groups.get('Bed_1')!.length).toBe(3);
    expect(groups.get('Chair_1')!.length).toBe(1);
  });

  it('preserves per-id placement order', () => {
    const placements: ModelPlacement[] = [
      { id: 'Bed_1', matrix: at(10) },
      { id: 'Bed_1', matrix: at(20) },
    ];
    const xs = groupPlacementsByModel(placements)
      .get('Bed_1')!
      .map((m) => m.elements[12]);
    expect(xs).toEqual([10, 20]);
  });

  it('returns an empty map for no placements', () => {
    expect(groupPlacementsByModel([]).size).toBe(0);
  });
});
