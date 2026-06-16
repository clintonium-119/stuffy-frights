import { describe, it, expect } from 'vitest';
import { edgeRuns, slabHoleSet } from './HouseBuilder';
import {
  CELL_SIZE,
  type CellKind,
  type EdgeState,
  type Stair,
  type Chute,
} from './layoutTypes';

/** Build width-sized `none` edge rows for a `depth`-row floor. */
function blank(width: number, depth: number): EdgeState[][] {
  return Array.from({ length: depth }, () => new Array<EdgeState>(width).fill('none'));
}

describe('edgeRuns', () => {
  it('emits one wall run for a single wall edge between two floor cells', () => {
    const grid: CellKind[][] = [['floor', 'floor', 'floor']];
    const edgesV = blank(3, 1);
    edgesV[0][0] = 'wall'; // boundary between col 0 and col 1
    const runs = edgeRuns(edgesV, blank(3, 1), grid, 3, 1);
    expect(runs).toEqual([{ axis: 'v', b: 0, i0: 0, i1: 0, state: 'wall' }]);
  });

  it('merges collinear same-state vertical edges into one run', () => {
    const grid: CellKind[][] = [
      ['floor', 'floor'],
      ['floor', 'floor'],
      ['floor', 'floor'],
    ];
    const edgesV = blank(2, 3);
    for (let z = 0; z < 3; z++) edgesV[z][0] = 'wall';
    const runs = edgeRuns(edgesV, blank(2, 3), grid, 2, 3);
    expect(runs).toEqual([{ axis: 'v', b: 0, i0: 0, i1: 2, state: 'wall' }]);
  });

  it('splits a wall→door→wall line into three same-state runs', () => {
    const grid: CellKind[][] = [
      ['floor', 'floor'],
      ['floor', 'floor'],
      ['floor', 'floor'],
    ];
    const edgesV = blank(2, 3);
    edgesV[0][0] = 'wall';
    edgesV[1][0] = 'door';
    edgesV[2][0] = 'wall';
    const runs = edgeRuns(edgesV, blank(2, 3), grid, 2, 3);
    expect(runs).toEqual([
      { axis: 'v', b: 0, i0: 0, i1: 0, state: 'wall' },
      { axis: 'v', b: 0, i0: 1, i1: 1, state: 'door' },
      { axis: 'v', b: 0, i0: 2, i1: 2, state: 'wall' },
    ]);
  });

  it('emits a secret edge as its own run (rendered flush)', () => {
    const grid: CellKind[][] = [['floor', 'floor']];
    const edgesV = blank(2, 1);
    edgesV[0][0] = 'secret';
    const runs = edgeRuns(edgesV, blank(2, 1), grid, 2, 1);
    expect(runs).toEqual([{ axis: 'v', b: 0, i0: 0, i1: 0, state: 'secret' }]);
  });

  it('skips block-interior edges, keeping only walkable-facing faces', () => {
    // Legacy-style thick wall: floor | wall | wall | floor.
    const grid: CellKind[][] = [['floor', 'wall', 'wall', 'floor']];
    const edgesV = blank(4, 1);
    edgesV[0][0] = 'wall'; // floor|wall  → kept (faces floor)
    edgesV[0][1] = 'wall'; // wall|wall   → skipped (faces no walkable cell)
    edgesV[0][2] = 'wall'; // wall|floor  → kept (faces floor)
    const runs = edgeRuns(edgesV, blank(4, 1), grid, 4, 1);
    expect(runs).toEqual([
      { axis: 'v', b: 0, i0: 0, i1: 0, state: 'wall' },
      { axis: 'v', b: 2, i0: 0, i1: 0, state: 'wall' },
    ]);
  });

  it('merges horizontal wall edges along x', () => {
    const grid: CellKind[][] = [
      ['floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor'],
    ];
    const edgesH = blank(3, 2);
    for (let x = 0; x < 3; x++) edgesH[0][x] = 'wall'; // boundary between row 0 and row 1
    const runs = edgeRuns(blank(3, 2), edgesH, grid, 3, 2);
    expect(runs).toEqual([{ axis: 'h', b: 0, i0: 0, i1: 2, state: 'wall' }]);
  });

  it('does nothing for a wall edge facing only void/wall cells', () => {
    const grid: CellKind[][] = [['void', 'wall', 'void']];
    const edgesV = blank(3, 1);
    edgesV[0][0] = 'wall'; // void|wall
    edgesV[0][1] = 'wall'; // wall|void
    const runs = edgeRuns(edgesV, blank(3, 1), grid, 3, 1);
    expect(runs).toEqual([]);
  });

  it('locks the index→world mapping (boundary plane + run length)', () => {
    // A vertical run on boundary col 1, spanning rows 0..2.
    const run = { axis: 'v' as const, b: 1, i0: 0, i1: 2, state: 'wall' as const };
    const boundaryX = (run.b + 1) * CELL_SIZE;
    const len = (run.i1 - run.i0 + 1) * CELL_SIZE;
    const midZ = (run.i0 * CELL_SIZE + (run.i1 + 1) * CELL_SIZE) / 2;
    expect(boundaryX).toBe(2 * CELL_SIZE);
    expect(len).toBe(3 * CELL_SIZE);
    expect(midZ).toBe(1.5 * CELL_SIZE);
  });
});

describe('slabHoleSet', () => {
  it('opens the upper floor over a stairwell run and its own floor under a chute', () => {
    const stairs: Stair[] = [
      { lower: 0, upper: 1, cells: [{ x: 3, z: 3 }, { x: 3, z: 4 }] },
    ];
    const chutes: Chute[] = [
      { from: { floor: 1, x: 7, z: 7 }, to: { floor: 0, x: 7, z: 7 } },
    ];
    const holes = slabHoleSet(3, stairs, chutes);
    expect(holes).toHaveLength(3);
    expect(holes[0].size).toBe(0); // lower floor keeps its slab under the stairs
    expect([...holes[1]].sort()).toEqual(['3,3', '3,4', '7,7']);
    expect(holes[2].size).toBe(0);
  });

  it('sizes the hole sets to any floor count', () => {
    expect(slabHoleSet(5, [], [])).toHaveLength(5);
  });
});
