import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { NavGraph, PathFollower } from './NavGraph';
import { house, neighbors } from '../world/houseLayout';
import { resolveFurniture } from '../world/Props';
import { FURNITURE } from '../world/mansion/markers';
import { Rng } from '../core/rng';
import { floorY, cellToWorld, isWalkable, FLOOR_SPACING } from '../world/layoutTypes';
import { edgeBetween, blocksMovement } from '../world/edges';

function solidCells(): Set<string> {
  const solid = resolveFurniture(FURNITURE, house.width, house.depth).solidCells;
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

  it('cross-floor paths traverse stairs through the upper floors', () => {
    // Attic (4) → basement (1): the only vertical route runs 4→3→2→1, so the
    // path threads every floor in between. (Floors 0/1 hang off the main floor,
    // so an attic→basement walk visits 1..4.)
    const p = nav.findPath({ floor: 4, x: 50, z: 22 }, { floor: 1, x: 40, z: 28 });
    expect(p).not.toBeNull();
    expect(new Set(p!.map((n) => n.floor))).toEqual(new Set([1, 2, 3, 4]));
  });

  it('passage edges are excluded by default and shortcut when allowed', () => {
    // The upstairs kids' vent (floor 3) bores between the boy's and girl's rooms;
    // the cells flanking its single-cell bore are in different rooms, joined
    // directly only by the crawl (otherwise the route detours via the nursery).
    const vent = house.vents.find((v) => v.floor === 3)!;
    const mouth = vent.cells[0];
    const a = { floor: 3, x: mouth.x - 1, z: mouth.z };
    const b = { floor: 3, x: mouth.x + 1, z: mouth.z };
    const around = nav.findPath(a, b);
    const through = nav.findPath(a, b, { allowPassages: true });
    expect(around).not.toBeNull();
    expect(through).not.toBeNull();
    expect(through!.length).toBeLessThan(around!.length);
    // The default path never enters the vent mouth cell.
    expect(around!.some((n) => n.floor === 3 && n.x === mouth.x && n.z === mouth.z)).toBe(false);
  });

  it('chute drops are one-way and only with passages allowed', () => {
    // The garage trap chute drops from the main floor (2) into the basement (1).
    const chute = house.chutes.find((c) => c.from.floor === 2)!;
    const approach = { floor: 2, x: chute.from.x - 1, z: chute.from.z };
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
    const s = house.stairs.find((st) => st.cells.length >= 3)!; // a full run with interior steps
    const entrance = { floor: s.lower, x: s.cells[0].x, z: s.cells[0].z };
    const last = s.cells[s.cells.length - 1];
    const landing = { floor: s.upper, x: last.x, z: last.z };
    const ys = nav.toWaypoints([entrance, landing]).map((w) => w.y);
    expect(ys.length).toBeGreaterThan(2); // endpoints + interior steps
    expect(ys[0]).toBeCloseTo(floorY(s.lower));
    expect(ys[ys.length - 1]).toBeCloseTo(floorY(s.upper));
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThan(ys[i - 1]);
  });

  it('same-floor adjacency is present iff the shared edge is non-blocking', () => {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;
    for (let f = 0; f < house.grids.length; f++) {
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          if (!isWalkable(house.grids[f][z][x]) || house.grids[f][z][x] === 'stair') continue;
          // Same-floor, single-cell, non-chute steps from the adjacency builder.
          const present = new Set(
            neighbors(house, { floor: f, x, z })
              .filter(
                (n) =>
                  n.pos.floor === f &&
                  !n.viaChute &&
                  Math.abs(n.pos.x - x) + Math.abs(n.pos.z - z) === 1
              )
              .map((n) => `${n.pos.x},${n.pos.z}`)
          );
          for (const [dx, dz] of dirs) {
            const nx = x + dx;
            const nz = z + dz;
            if (nx < 0 || nz < 0 || nx >= house.width || nz >= house.depth) continue;
            // Stair-run adjacency is layered separately; skip stair endpoints here.
            if (house.grids[f][nz][nx] === 'stair') continue;
            const expected =
              isWalkable(house.grids[f][nz][nx]) &&
              !blocksMovement(edgeBetween(house, f, { x, z }, { x: nx, z: nz }));
            expect(present.has(`${nx},${nz}`), `${f}:${x},${z} -> ${nx},${nz}`).toBe(expected);
          }
        }
      }
    }
  });

  it('nearestNode snaps to the correct floor for every floor (dynamic count)', () => {
    for (let f = 0; f < house.grids.length; f++) {
      const node = nav.nodesOnFloor(f)[0];
      expect(node, `floor ${f} has nodes`).toBeDefined();
      const w = cellToWorld(node.x, node.z);
      const got = nav.nearestNode(new THREE.Vector3(w.x, floorY(f), w.z));
      expect(got, `floor ${f}`).not.toBeNull();
      expect(got!.floor).toBe(f);
    }
    // A y far above the top floor clamps to the top floor (no overflow past N-1).
    const top = house.grids.length - 1;
    const tn = nav.nodesOnFloor(top)[0];
    const tw = cellToWorld(tn.x, tn.z);
    const got = nav.nearestNode(new THREE.Vector3(tw.x, floorY(top) + FLOOR_SPACING * 3, tw.z));
    expect(got!.floor).toBe(top);
  });
});
