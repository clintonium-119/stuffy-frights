import { describe, it, expect } from 'vitest';
import { ColliderSet, CylinderBody, aabb } from './Collision';

const STEP_UP = 0.28;

function body(x: number, z: number, y = 0): CylinderBody {
  return { x, y, z, radius: 0.35, height: 1.8 };
}

describe('ColliderSet.moveBody', () => {
  it('pushes the body out of a wall along the contact normal', () => {
    const set = new ColliderSet();
    set.add(aabb(-5, 0, -1, 5, 3, 0)); // wall slab from z=-1 to z=0
    // Walk forward (−Z) into the wall front face (z = 0).
    const r = set.moveBody(body(0, 1), 0, -1.5, STEP_UP);
    expect(r.z).toBeCloseTo(0.35, 5); // face + radius
    expect(r.x).toBeCloseTo(0, 5);
  });

  it('slides along a wall: blocked axis stops, free axis advances', () => {
    const set = new ColliderSet();
    set.add(aabb(-5, 0, -1, 5, 3, 0));
    // Move diagonally into the wall: −Z blocked, +X free.
    const r = set.moveBody(body(0, 1), 0.8, -1.5, STEP_UP);
    expect(r.z).toBeCloseTo(0.35, 5);
    expect(r.x).toBeCloseTo(0.8, 5);
  });

  it('does not block on climbable ledges (≤ stepUp)', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 0, -3, 1, 0.25, -1)); // low step
    const r = set.moveBody(body(0, 0), 0, -2, STEP_UP);
    expect(r.z).toBeCloseTo(-2, 5); // passed over, not pushed out
  });

  it('blocks on ledges above the stepUp threshold', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 0, -3, 1, 0.6, -1)); // too-tall block, front face z=-1
    const r = set.moveBody(body(0, 0), 0, -2, STEP_UP);
    expect(r.z).toBeCloseTo(-0.65, 5); // face + radius
  });

  it('is unaffected by boxes outside the body height span', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 2.5, -3, 1, 3.5, -1)); // overhead beam
    const r = set.moveBody(body(0, 0), 0, -2, STEP_UP);
    expect(r.z).toBeCloseTo(-2, 5);
  });
});

describe('ColliderSet.groundHeight', () => {
  it('returns box top when standing on a climbable box', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 0, -1, 1, 0.25, 1));
    expect(set.groundHeight(0, 0, 0.35, 0, STEP_UP)).toBeCloseTo(0.25, 5);
  });

  it('steps down to 0 when off the box', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 0, -1, 1, 0.25, 1));
    expect(set.groundHeight(5, 5, 0.35, 0.25, STEP_UP)).toBe(0);
  });

  it('ignores tops above y + stepUp (no teleporting onto tall furniture)', () => {
    const set = new ColliderSet();
    set.add(aabb(-1, 0, -1, 1, 1.5, 1));
    expect(set.groundHeight(0, 0, 0.35, 0, STEP_UP)).toBe(0);
  });

  it('climbs progressive stairs one step at a time', () => {
    const set = new ColliderSet();
    set.add(aabb(0, 0, 0, 2, 0.25, 2)); // step 1
    set.add(aabb(2, 0, 0, 4, 0.5, 2)); // step 2
    const y1 = set.groundHeight(1, 1, 0.35, 0, STEP_UP);
    expect(y1).toBeCloseTo(0.25, 5);
    const y2 = set.groundHeight(3, 1, 0.35, y1, STEP_UP);
    expect(y2).toBeCloseTo(0.5, 5);
  });
});
