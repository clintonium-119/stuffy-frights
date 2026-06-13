import { describe, it, expect } from 'vitest';
import { house, neighbors, parseLayout } from './houseLayout';
import { PROP_PLACEMENTS } from './Props';
import { CellPos, cellToWorld, isWalkable, worldToCell } from './layoutTypes';

const k = (f: number, x: number, z: number) => `${f}:${x},${z}`;
const kp = (p: { floor: number; x: number; z: number }) => k(p.floor, p.x, p.z);

/** BFS over the adjacency, optionally treating solid prop cells as blocked. */
function reachableFrom(start: CellPos, excludeSolids: boolean): Set<string> {
  const solid = new Set<string>();
  if (excludeSolids) {
    PROP_PLACEMENTS.forEach((p) => {
      if (p.kind !== 'coatRack') solid.add(kp(p.pos));
    });
    house.hidingSpots.forEach((h) => solid.add(kp(h.pos)));
  }
  const seen = new Set<string>([kp(start)]);
  const queue: CellPos[] = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const n of neighbors(house, cur)) {
      const id = kp(n.pos);
      if (seen.has(id) || solid.has(id)) continue;
      seen.add(id);
      queue.push(n.pos);
    }
  }
  return seen;
}

describe('house layout integrity', () => {
  it('parses without error', () => {
    expect(() => parseLayout()).not.toThrow();
  });

  it('has exactly 3 exits, all on the main floor', () => {
    expect(house.exits).toHaveLength(3);
    expect(new Set(house.exits.map((e) => e.id))).toEqual(new Set(['A', 'B', 'C']));
    for (const e of house.exits) expect(e.pos.floor).toBe(1);
  });

  it('has a large key-candidate pool spanning all four floors, all walkable', () => {
    // Enlarged so the key location never feels predictable run-to-run.
    expect(house.keyCandidates.length).toBeGreaterThanOrEqual(12);
    expect(new Set(house.keyCandidates.map((c) => c.floor))).toEqual(new Set([0, 1, 2, 3]));
    for (const c of house.keyCandidates) {
      expect(isWalkable(house.grids[c.floor][c.z][c.x])).toBe(true);
    }
  });

  it('has ≥1 charging station per floor', () => {
    const byFloor = new Set(house.chargingStations.map((c) => c.floor));
    expect(byFloor).toEqual(new Set([0, 1, 2, 3]));
  });

  it('has ≥8 hiding spots and one enemy spawn per floor', () => {
    expect(house.hidingSpots.length).toBeGreaterThanOrEqual(8);
    expect(new Set(house.enemySpawns.map((e) => e.pos.floor))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(house.enemySpawns.map((e) => e.enemy)).size).toBe(4);
  });

  it('has ≥4 passages with ≥1 cross-floor', () => {
    const total = house.vents.length + house.chutes.length;
    expect(total).toBeGreaterThanOrEqual(4);
    expect(house.chutes.length).toBeGreaterThanOrEqual(1);
    for (const ch of house.chutes) {
      expect(ch.from.floor).toBe(ch.to.floor + 1); // drops exactly one floor
      expect(kp(ch.from)).not.toBe(kp(ch.to));
    }
  });

  it('every marker sits on a walkable cell', () => {
    const markers: { floor: number; x: number; z: number }[] = [
      house.playerSpawn,
      ...house.playerSpawns,
      ...house.enemySpawns.map((e) => e.pos),
      ...house.hidingSpots.map((h) => h.pos),
      ...house.chargingStations,
      ...house.keyCandidates,
      ...house.exits.map((e) => e.pos),
      ...house.chutes.flatMap((c) => [c.from, c.to]),
    ];
    for (const m of markers) {
      expect(isWalkable(house.grids[m.floor][m.z][m.x]), kp(m)).toBe(true);
    }
  });

  it('reaches every gameplay target from spawn (grid walk)', () => {
    const seen = reachableFrom(house.playerSpawn, false);
    const targets = [
      ...house.playerSpawns,
      ...house.keyCandidates,
      ...house.exits.map((e) => e.pos),
      ...house.chargingStations,
      ...house.hidingSpots.map((h) => h.pos),
      ...house.enemySpawns.map((e) => e.pos),
    ];
    for (const t of targets) expect(seen.has(kp(t)), kp(t)).toBe(true);
  });

  it('stays fully connected with solid furniture in place', () => {
    const seen = reachableFrom(house.playerSpawn, true);
    const targets = [
      ...house.keyCandidates,
      ...house.exits.map((e) => e.pos),
      ...house.chargingStations,
      ...house.enemySpawns.map((e) => e.pos),
    ];
    for (const t of targets) expect(seen.has(kp(t)), kp(t)).toBe(true);
    // Hiding spots host furniture: require a reachable adjacent cell instead.
    for (const h of house.hidingSpots) {
      const adjacentReachable = neighbors(house, h.pos).some((n) => seen.has(kp(n.pos)));
      expect(adjacentReachable, `hiding ${kp(h.pos)}`).toBe(true);
    }
  });

  it('no solid prop occupies a door, stair, vent, or critical marker cell', () => {
    const critical = new Set<string>();
    critical.add(kp(house.playerSpawn));
    house.enemySpawns.forEach((e) => critical.add(kp(e.pos)));
    house.chargingStations.forEach((c) => critical.add(kp(c)));
    house.keyCandidates.forEach((c) => critical.add(kp(c)));
    house.exits.forEach((e) => critical.add(kp(e.pos)));
    house.stairs.forEach((s) =>
      [s.lower, s.upper].forEach((f) => s.cells.forEach((c) => critical.add(k(f, c.x, c.z))))
    );
    house.vents.forEach((v) => v.cells.forEach((c) => critical.add(k(v.floor, c.x, c.z))));
    house.chutes.forEach((c) => {
      critical.add(kp(c.from));
      critical.add(kp(c.to));
    });
    const seenPlacement = new Set<string>();
    for (const p of PROP_PLACEMENTS) {
      const id = kp(p.pos);
      const kind = house.grids[p.pos.floor][p.pos.z][p.pos.x];
      expect(kind, `${p.kind}@${id}`).toBe('floor');
      expect(critical.has(id), `${p.kind}@${id} on critical cell`).toBe(false);
      expect(seenPlacement.has(id), `double placement @${id}`).toBe(false);
      seenPlacement.add(id);
    }
  });

  it('stair runs are colinear and marked S on both floors', () => {
    for (const s of house.stairs) {
      const sameX = s.cells.every((c) => c.x === s.cells[0].x);
      const sameZ = s.cells.every((c) => c.z === s.cells[0].z);
      expect(sameX || sameZ).toBe(true);
      expect(s.upper).toBe(s.lower + 1);
      for (const f of [s.lower, s.upper]) {
        for (const c of s.cells) expect(house.grids[f][c.z][c.x]).toBe('stair');
      }
    }
  });

  it('cellToWorld/worldToCell round-trips cell identity', () => {
    for (let x = 0; x < house.width; x++) {
      for (let z = 0; z < house.depth; z++) {
        const w = cellToWorld(x, z);
        const back = worldToCell(w.x, w.z);
        expect(back).toEqual({ x, z });
      }
    }
  });

  it('has multi-cell vent tunnels (maze crawl runs)', () => {
    const multiCell = house.vents.filter((v) => v.cells.length >= 2);
    expect(multiCell.length).toBeGreaterThanOrEqual(3);
    // Every vent cell is marked 'v' in its grid (parse-time invariant, asserted here too).
    for (const v of house.vents) {
      for (const c of v.cells) expect(house.grids[v.floor][c.z][c.x]).toBe('vent');
    }
    // Cells within a run are contiguous (4-neighbour chain).
    for (const v of house.vents) {
      for (let i = 1; i < v.cells.length; i++) {
        const a = v.cells[i - 1];
        const b = v.cells[i];
        expect(Math.abs(a.x - b.x) + Math.abs(a.z - b.z)).toBe(1);
      }
    }
  });

  it('has hallway closets among the hiding spots', () => {
    const closets = house.hidingSpots.filter((h) => h.kind === 'closet');
    expect(closets.length).toBeGreaterThanOrEqual(2);
  });

  it('every charging station mounts against an orthogonally-adjacent wall', () => {
    for (const c of house.chargingStations) {
      const grid = house.grids[c.floor];
      const hasWall = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dz]) => grid[c.z + dz]?.[c.x + dx] === 'wall');
      expect(hasWall, `charging station ${kp(c)} has no adjacent wall`).toBe(true);
    }
  });

  it('solid furniture never seals a doorway (both sides stay reachable)', () => {
    const seen = reachableFrom(house.playerSpawn, true);
    // Hiding markers host their own furniture, so a hiding cell is expected to
    // be solid — exclude those from the door-traversal requirement.
    const hidingCells = new Set(house.hidingSpots.map((h) => kp(h.pos)));
    for (let f = 0; f < house.grids.length; f++) {
      const grid = house.grids[f];
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          if (grid[z][x] !== 'door') continue;
          const door = { floor: f, x, z } as CellPos;
          if (!seen.has(kp(door))) continue; // unreachable doors covered elsewhere
          for (const n of neighbors(house, door)) {
            if (n.viaChute || hidingCells.has(kp(n.pos))) continue;
            expect(
              seen.has(kp(n.pos)),
              `door ${kp(door)} → ${kp(n.pos)} sealed by furniture`
            ).toBe(true);
          }
        }
      }
    }
  });

  it('a walled-off exit would fail reachability (guard self-check)', () => {
    // Sanity that the BFS actually depends on the grid: a fake start in a
    // wall reaches nothing.
    const seen = reachableFrom({ floor: 1, x: 0, z: 0 }, false);
    expect(seen.size).toBe(1);
  });
});
