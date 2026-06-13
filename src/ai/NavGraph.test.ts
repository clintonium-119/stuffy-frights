import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { NavGraph, PathFollower } from './NavGraph';
import { house } from '../world/houseLayout';
import { PROP_PLACEMENTS } from '../world/Props';
import { Rng } from '../core/rng';

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

  it('cross-floor paths traverse stairs through every floor', () => {
    const p = nav.findPath({ floor: 3, x: 6, z: 5 }, { floor: 0, x: 13, z: 6 });
    expect(p).not.toBeNull();
    expect(new Set(p!.map((n) => n.floor))).toEqual(new Set([0, 1, 2, 3]));
  });

  it('passage edges are excluded by default and shortcut when allowed', () => {
    const around = nav.findPath({ floor: 1, x: 4, z: 5 }, { floor: 1, x: 6, z: 5 });
    const through = nav.findPath(
      { floor: 1, x: 4, z: 5 },
      { floor: 1, x: 6, z: 5 },
      { allowPassages: true }
    );
    expect(around).not.toBeNull();
    expect(through).not.toBeNull();
    expect(through!.length).toBeLessThan(around!.length);
    // The default path never enters the vent cell.
    expect(around!.some((n) => n.floor === 1 && n.x === 5 && n.z === 5)).toBe(false);
  });

  it('chute drops are one-way and only with passages allowed', () => {
    const down = nav.findPath(
      { floor: 1, x: 11, z: 7 },
      { floor: 0, x: 10, z: 7 },
      { allowPassages: true }
    );
    expect(down).not.toBeNull();
    // Going back UP through the chute is impossible — the route must use stairs.
    const up = nav.findPath(
      { floor: 0, x: 10, z: 7 },
      { floor: 1, x: 11, z: 7 },
      { allowPassages: true }
    );
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
