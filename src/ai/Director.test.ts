import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Director } from './Director';
import { EnemyBase, Mood } from '../enemies/EnemyBase';
import { NavGraph } from './NavGraph';
import { HidingSystem } from '../systems/HidingSpot';
import { house } from '../world/houseLayout';
import { Rng } from '../core/rng';

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
  const markerWorld = (p: { floor: number; x: number; z: number }) =>
    new THREE.Vector3(p.x * 2, p.floor * 3.5, p.z * 2);
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
