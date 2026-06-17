import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { CellKind, EdgeState, House, cellToWorld, worldToCell } from '../world/layoutTypes';
import { NavNodeId } from './NavGraph';
import { SoundGraph, propagateSound } from './SoundPropagation';
import type { EdgeGrids } from '../world/edges';

// Test fixture: synthesize edges from a toy CellKind grid (a door edge if either
// side is a door cell, a wall edge if either side is wall/void, else open). The
// production house authors edges directly; this only builds tiny grids for tests.
function gridToEdges(grids: CellKind[][][], width: number, depth: number): EdgeGrids {
  const between = (a: CellKind, b: CellKind): EdgeState =>
    a === 'door' || b === 'door'
      ? 'door'
      : a === 'wall' || b === 'wall' || a === 'void' || b === 'void'
        ? 'wall'
        : 'none';
  const edgesV: EdgeState[][][] = [];
  const edgesH: EdgeState[][][] = [];
  for (const grid of grids) {
    const v: EdgeState[][] = [];
    const h: EdgeState[][] = [];
    for (let z = 0; z < depth; z++) {
      const vrow: EdgeState[] = [];
      const hrow: EdgeState[] = [];
      for (let x = 0; x < width; x++) {
        vrow.push(x < width - 1 ? between(grid[z][x], grid[z][x + 1]) : 'none');
        hrow.push(z < depth - 1 ? between(grid[z][x], grid[z + 1][x]) : 'none');
      }
      v.push(vrow);
      h.push(hrow);
    }
    edgesV.push(v);
    edgesH.push(h);
  }
  return { edgesV, edgesH };
}

// Build a tiny single-floor sound graph + house from an ASCII map.
//   '.' open floor, '#' wall (not a node), 'D' door (node, attenuates).
// rows[z] is a string of x-cells. Deterministic, no DOM.
function makeGrid(rows: string[]): { graph: SoundGraph; house: House } {
  const open = new Map<string, NavNodeId>();
  const kindAt = (x: number, z: number): CellKind => {
    const ch = rows[z]?.[x];
    if (ch === '#' || ch === undefined) return 'wall';
    if (ch === 'D') return 'door';
    return 'floor';
  };
  rows.forEach((row, z) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') open.set(`0:${x},${z}`, { floor: 0, x, z });
    }
  });
  const width = rows[0].length;
  const depth = rows.length;
  const grids: CellKind[][][] = [
    rows.map((_row, z) => Array.from({ length: width }, (_, x) => kindAt(x, z))),
  ];
  // Door cost is now an edge crossing, so the synthetic house needs edges too.
  const { edgesV, edgesH } = gridToEdges(grids, width, depth);
  const graph: SoundGraph = {
    nearestNode(world: THREE.Vector3) {
      const c = worldToCell(world.x, world.z);
      return open.get(`0:${c.x},${c.z}`) ?? null;
    },
    soundNeighbors(node) {
      const out: { to: NavNodeId; cost: number }[] = [];
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const n = open.get(`0:${node.x + dx},${node.z + dz}`);
        if (n) out.push({ to: n, cost: 1 });
      }
      return out;
    },
  };
  return { graph, house: { grids, edgesV, edgesH, width, depth } as House };
}

const world = (x: number, z: number): THREE.Vector3 => {
  const w = cellToWorld(x, z);
  return new THREE.Vector3(w.x, 0, w.z);
};

describe('SoundPropagation', () => {
  it('occlusion: a wall with no in-budget detour is inaudible', () => {
    // Listener (0,0) and source (2,0) separated by a wall column at x=1, with
    // the only detour far away (beyond budget).
    const { graph, house } = makeGrid([
      '.#.',
      '.#.',
      '.#.',
      '.#.',
      '...', // the detour is 8+ cells around — beyond a budget of 3
    ]);
    const r = propagateSound(graph, house, world(0, 0), world(2, 0), { maxCost: 3, doorCost: 0 });
    expect(r.audible).toBe(false);
    expect(r.intensity).toBe(0);
  });

  it('an open path within budget is audible', () => {
    const { graph, house } = makeGrid(['......']);
    const r = propagateSound(graph, house, world(0, 0), world(3, 0), { maxCost: 6, doorCost: 0 });
    expect(r.audible).toBe(true);
    expect(r.intensity).toBeGreaterThan(0);
  });

  it('attenuation: a longer path is quieter', () => {
    const { graph, house } = makeGrid(['..........']);
    const near = propagateSound(graph, house, world(0, 0), world(2, 0), { maxCost: 10, doorCost: 0 });
    const far = propagateSound(graph, house, world(0, 0), world(6, 0), { maxCost: 10, doorCost: 0 });
    expect(near.intensity).toBeGreaterThan(far.intensity);
  });

  it('a door on the path attenuates further than open floor', () => {
    const open = makeGrid(['.....']);
    const door = makeGrid(['..D..']);
    const through = (g: ReturnType<typeof makeGrid>) =>
      propagateSound(g.graph, g.house, world(0, 0), world(4, 0), { maxCost: 12, doorCost: 3 });
    expect(through(door).intensity).toBeLessThan(through(open).intensity);
  });

  it('charges a doorway once, regardless of how many door cells span it', () => {
    // Both maps are 5 wide with the same 4-step path; the door region differs
    // only in thickness. With edge-based door cost (charged on entry), the
    // doorway penalty is identical — so the intensities match. A per-door-cell
    // charge would make the thick doorway markedly quieter.
    const thin = makeGrid(['..D..']);
    const thick = makeGrid(['.DDD.']);
    const through = (g: ReturnType<typeof makeGrid>) =>
      propagateSound(g.graph, g.house, world(0, 0), world(4, 0), { maxCost: 12, doorCost: 3 });
    expect(through(thick).intensity).toBeCloseTo(through(thin).intensity);
  });

  it('direction: arrivalDir is the first step toward the source', () => {
    const { graph, house } = makeGrid(['....']);
    const r = propagateSound(graph, house, world(0, 0), world(3, 0), { maxCost: 6, doorCost: 0 });
    expect(r.arrivalDir).not.toBeNull();
    expect(r.arrivalDir!.x).toBeGreaterThan(0.9); // points +x toward the source
    expect(Math.abs(r.arrivalDir!.z)).toBeLessThan(1e-6);
  });

  it('sound arrives from the corner it rounds, not through the wall', () => {
    // Listener at (0,0); source at (0,2) directly south but walled; the path
    // must go east around a wall, so the first step is +x, not +z.
    const { graph, house } = makeGrid([
      '..',
      '#.',
      '..',
    ]);
    const r = propagateSound(graph, house, world(0, 0), world(0, 2), { maxCost: 8, doorCost: 0 });
    expect(r.audible).toBe(true);
    expect(r.arrivalDir!.x).toBeGreaterThan(0.5); // rounds the corner east
  });
});
