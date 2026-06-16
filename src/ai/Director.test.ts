import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Director } from './Director';
import { EnemyBase, Mood } from '../enemies/EnemyBase';
import { NavGraph } from './NavGraph';
import { HidingSystem } from '../systems/HidingSpot';
import { house } from '../world/houseLayout';
import { Rng } from '../core/rng';
import { config } from '../core/config';
import { isWalkable, worldToCell, cellToWorld, floorY } from '../world/layoutTypes';
import { UPSCALE } from '../world/houseLayout';

/** Cell → world using the real engine pitch (mirrors production marker placement). */
const markerWorld = (p: { floor: number; x: number; z: number }) => {
  const w = cellToWorld(p.x, p.z);
  return new THREE.Vector3(w.x, floorY(p.floor), w.z);
};

/** Canvas-free stub enemy (no init()/face baking) for headless Director tests. */
class StubEnemy extends EnemyBase {
  constructor(id: string) {
    super(id);
  }
  protected buildBody(): THREE.Mesh {
    return new THREE.Mesh();
  }
  drawFace(_ctx: CanvasRenderingContext2D, _size: number, _mood: Mood): void {}
  protected animateGait(): void {}
}

function makeDirector() {
  const nav = new NavGraph(house, new Set());
  const rng = new Rng(12345);
  const hiding = { all: [], active: null } as unknown as HidingSystem;
  const scene = new THREE.Scene();
  const director = new Director(
    house,
    nav,
    rng,
    { hiding, onFoundHidden: () => {} },
    scene,
    markerWorld,
    (id) => new StubEnemy(id)
  );
  return director;
}

describe('Director safe spawns', () => {
  // A main-floor room cell, upscaled from the authored (2,2) to the engine grid.
  const playerCell = { x: 2 * UPSCALE, z: 2 * UPSCALE };
  const playerFloor = 1;
  const playerPos = markerWorld({ floor: 1, x: playerCell.x, z: playerCell.z });

  // Mirror Director.floodRoom for assertions (room = walls + doors bounded).
  function playerRoom(): Set<string> {
    const grid = house.grids[playerFloor];
    const seen = new Set<string>([`${playerCell.x},${playerCell.z}`]);
    const q = [{ ...playerCell }];
    while (q.length) {
      const c = q.shift()!;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = c.x + dx;
        const nz = c.z + dz;
        const k = grid[nz]?.[nx];
        if (k === undefined || k === 'door' || !isWalkable(k)) continue;
        const key = `${nx},${nz}`;
        if (seen.has(key)) continue;
        seen.add(key);
        q.push({ x: nx, z: nz });
      }
    }
    return seen;
  }

  it('never leaves a same-floor enemy in the player room (relocates the worst case)', () => {
    const director = makeDirector();
    // Force the main-floor resident right onto the player — worst possible spawn.
    const main = director.residents.find((r) => r.enemy.floorIndex === playerFloor)!;
    main.enemy.position.copy(playerPos);
    director.seedSafeSpawns(playerPos, playerCell, playerFloor);
    const room = playerRoom();
    for (const r of director.residents) {
      if (r.enemy.floorIndex !== playerFloor) continue;
      const cell = worldToCell(r.enemy.position.x, r.enemy.position.z);
      expect(room.has(`${cell.x},${cell.z}`), 'enemy left in player room').toBe(false);
      expect(r.enemy.position.distanceTo(playerPos)).toBeGreaterThanOrEqual(
        config.ai.safeSpawnDistance
      );
    }
  });

  it('aims same-floor enemies away — first patrol is no nearer the player', () => {
    const director = makeDirector();
    director.seedSafeSpawns(playerPos, playerCell, playerFloor);
    for (const r of director.residents) {
      if (r.enemy.floorIndex !== playerFloor) continue;
      expect(r.brain.forcedDestination).not.toBeNull();
      const dest = r.brain.forcedDestination!;
      // The seeded patrol target is at least as far from the player as the enemy
      // itself — so its first move never heads toward the player.
      expect(dest.distanceTo(playerPos)).toBeGreaterThanOrEqual(
        r.enemy.position.distanceTo(playerPos) - 0.01
      );
    }
  });
});

describe('Director floor migration', () => {
  it('fires onMigrate when a patrolling resident adopts a new home floor', () => {
    const director = makeDirector();
    const events: { from: number; to: number }[] = [];
    director.onMigrate = (_r, from, to) => events.push({ from, to });

    // Burn the grace period, then run long enough for migrations to fire.
    // Player parked on floor 1 so passive==false residents can still move.
    for (let i = 0; i < 800; i++) director.update(0.5, 1);

    expect(events.length).toBeGreaterThan(0);
    for (const e of events) {
      expect(Math.abs(e.from - e.to)).toBe(1); // exactly one floor at a time
      expect(e.to).toBeGreaterThanOrEqual(0);
      expect(e.to).toBeLessThanOrEqual(3);
    }
  });
});
