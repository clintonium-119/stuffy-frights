import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { NavGraph, PathFollower } from './NavGraph';
import { house } from '../world/houseLayout';
import { PROP_PLACEMENTS } from '../world/Props';
import { Rng } from '../core/rng';
import { floorY } from '../world/layoutTypes';
import { UPSCALE } from '../world/houseLayout';

function solidCells(): Set<string> {
  const solid = new Set<string>();
  PROP_PLACEMENTS.forEach((p) => {
    if (p.kind !== 'coatRack') solid.add(`${p.pos.floor}:${p.pos.x},${p.pos.z}`);
  });
  house.hidingSpots.forEach((h) => solid.add(`${h.pos.floor}:${h.pos.x},${h.pos.z}`));
  return solid;
}

const nav = new NavGraph(house, solidCells());

describe('NavGraph on the real house', () => {
  it('paths exist from every enemy spawn to every exit and key candidate', () => {
    for (const e of house.enemySpawns) {
      for (const target of [...house.exits.map((x) => x.pos), ...house.keyCandidates]) {
        const p = nav.findPath(
          { floor: e.pos.floor, x: e.pos.x, z: e.pos.z },
          { floor: target.floor, x: target.x, z: target.z }
        );
        expect(p, `${e.enemy} -> ${target.floor}:${target.x},${target.z}`).not.toBeNull();
      }
    }
  });

  it('farthestNodeOnFloor returns the most distant node and honours the exclude set', () => {
    const from = new THREE.Vector3(0, 3.5, 0); // a main-floor corner
    const far = nav.farthestNodeOnFloor(1, from);
    expect(far).not.toBeNull();
    expect(far!.floor).toBe(1);
    const d2 = (n: { x: number; z: number }) => (n.x * 2) ** 2 + (n.z * 2) ** 2;
    // Excluding the farthest cell yields a different, no-farther node.
    const next = nav.farthestNodeOnFloor(1, from, new Set([`${far!.x},${far!.z}`]));
    expect(next).not.toBeNull();
    expect(`${next!.x},${next!.z}`).not.toBe(`${far!.x},${far!.z}`);
    expect(d2(next!)).toBeLessThanOrEqual(d2(far!));
  });

  it('cross-floor paths traverse stairs through every floor', () => {
    const p = nav.findPath({ floor: 3, x: 6, z: 5 }, { floor: 0, x: 13, z: 6 });
    expect(p).not.toBeNull();
    expect(new Set(p!.map((n) => n.floor))).toEqual(new Set([0, 1, 2, 3]));
  });

  it('passage edges are excluded by default and shortcut when allowed', () => {
    // A main-floor vent bores through a wall; cells one authored-cell to each
    // side of its mouth are in different rooms, joined only by the crawl.
    const vent = house.vents.find((v) => v.floor === 1)!;
    const mouth = vent.cells[0];
    const a = { floor: 1, x: mouth.x - UPSCALE, z: mouth.z };
    const b = { floor: 1, x: mouth.x + UPSCALE, z: mouth.z };
    const around = nav.findPath(a, b);
    const through = nav.findPath(a, b, { allowPassages: true });
    expect(around).not.toBeNull();
    expect(through).not.toBeNull();
    expect(through!.length).toBeLessThan(around!.length);
    // The default path never enters the vent mouth cell.
    expect(around!.some((n) => n.floor === 1 && n.x === mouth.x && n.z === mouth.z)).toBe(false);
  });

  it('chute drops are one-way and only with passages allowed', () => {
    const chute = house.chutes.find((c) => c.from.floor === 1)!;
    const approach = { floor: 1, x: chute.from.x + UPSCALE, z: chute.from.z };
    const down = nav.findPath(approach, chute.to, { allowPassages: true });
    expect(down).not.toBeNull();
    // Going back UP through the chute is impossible — the route must use stairs.
    const up = nav.findPath(chute.to, approach, { allowPassages: true });
    expect(up).not.toBeNull();
    expect(up!.length).toBeGreaterThan(down!.length);
  });

  it('nearestNode resolves positions on prop cells to a neighbor', () => {
    // The living-room couch cell (1: 2,10) is solid — spiral out finds one.
    const n = nav.nearestNode(new THREE.Vector3(5, 3.5, 21));
    expect(n).not.toBeNull();
    expect(n!.floor).toBe(1);
  });

  it('waypoints skip collinear cells', () => {
    const p = nav.findPath({ floor: 1, x: 6, z: 5 }, { floor: 1, x: 8, z: 7 })!;
    const wp = nav.toWaypoints(p);
    expect(wp.length).toBeLessThanOrEqual(p.length);
    expect(wp[wp.length - 1].y).toBeCloseTo(3.5);
  });
});

describe('NavGraph degenerate-input hardening', () => {
  it('randomNodeOnFloor returns null for a floor with no cells (no throw)', () => {
    const rng = new Rng(1);
    expect(() => nav.randomNodeOnFloor(99, rng)).not.toThrow();
    expect(nav.randomNodeOnFloor(99, rng)).toBeNull();
  });

  it('randomNodeOnFloor still returns a valid node for a real floor', () => {
    const node = nav.randomNodeOnFloor(1, new Rng(1));
    expect(node).not.toBeNull();
    expect(node!.floor).toBe(1);
  });

  it('PathFollower.drive on an empty path is a safe no-op', () => {
    const follower = new PathFollower();
    let targetSet: unknown = 'untouched';
    const enemy = {
      position: new THREE.Vector3(0, 0, 0),
      setMoveTarget(t: THREE.Vector3 | null) {
        targetSet = t;
      },
    };
    expect(() => follower.drive(enemy, 4)).not.toThrow();
    expect(follower.done).toBe(true);
    expect(targetSet).toBeNull();
  });
});

describe('stairs: no void crossing, no clipping', () => {
  it('marks the over-the-void stair cells as nav-blocked', () => {
    expect(house.navBlockedStairCells.size).toBeGreaterThan(0);
  });

  it('never routes a path through an over-the-void stair cell', () => {
    for (const e of house.enemySpawns) {
      for (const target of [...house.exits.map((x) => x.pos), ...house.keyCandidates]) {
        const p = nav.findPath(
          { floor: e.pos.floor, x: e.pos.x, z: e.pos.z },
          { floor: target.floor, x: target.x, z: target.z }
        );
        if (!p) continue;
        for (const c of p) {
          expect(house.navBlockedStairCells.has(`${c.floor}:${c.x},${c.z}`)).toBe(false);
        }
      }
    }
  });

  it('a void stair cell is not a nav node (unreachable as a target)', () => {
    const e = house.enemySpawns[0].pos;
    for (const k of house.navBlockedStairCells) {
      const [f, xz] = k.split(':');
      const [x, z] = xz.split(',').map(Number);
      const p = nav.findPath(
        { floor: e.floor, x: e.x, z: e.z },
        { floor: Number(f), x, z }
      );
      expect(p, `void cell ${k} should be unreachable`).toBeNull();
    }
  });

  it('stair waypoints rise monotonically from the lower to the upper floor', () => {
    const s = house.stairs[0]; // run 0 → 1
    const entrance = { floor: s.lower, x: s.cells[0].x, z: s.cells[0].z };
    const last = s.cells[s.cells.length - 1];
    const landing = { floor: s.upper, x: last.x, z: last.z };
    const ys = nav.toWaypoints([entrance, landing]).map((w) => w.y);
    expect(ys.length).toBeGreaterThan(2); // endpoints + interior steps
    expect(ys[0]).toBeCloseTo(floorY(s.lower));
    expect(ys[ys.length - 1]).toBeCloseTo(floorY(s.upper));
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThan(ys[i - 1]);
  });
});
