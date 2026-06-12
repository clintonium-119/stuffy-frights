/**
 * Static-world collision: axis-aligned boxes vs the player capsule,
 * resolved as a vertical cylinder (radius + height) — adequate for
 * walls/furniture and cheap enough to run per fixed step.
 */
export interface Aabb {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export function aabb(
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number
): Aabb {
  return { minX, minY, minZ, maxX, maxY, maxZ };
}

export interface CylinderBody {
  /** Center-bottom of the cylinder (feet position). */
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
}

/** Horizontal circle-vs-rect overlap test at the body's height span. */
function overlaps(body: CylinderBody, box: Aabb): boolean {
  if (body.y + body.height <= box.minY || body.y >= box.maxY) return false;
  const cx = clamp(body.x, box.minX, box.maxX);
  const cz = clamp(body.z, box.minZ, box.maxZ);
  const dx = body.x - cx;
  const dz = body.z - cz;
  return dx * dx + dz * dz < body.radius * body.radius;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Push the body horizontally out of one box. When the body center is still
 * outside the rect, push along the contact normal. When the center landed
 * inside (large displacement), push back through the face it entered —
 * derived from the movement direction on the current resolution axis —
 * so fast movement can't tunnel to the far side.
 */
function pushOut(
  body: CylinderBody,
  box: Aabb,
  axis: 'x' | 'z',
  delta: number
): { x: number; z: number } {
  const cx = clamp(body.x, box.minX, box.maxX);
  const cz = clamp(body.z, box.minZ, box.maxZ);
  const dx = body.x - cx;
  const dz = body.z - cz;
  const distSq = dx * dx + dz * dz;

  if (distSq > 1e-12) {
    // Center is outside the rect: push along the contact normal.
    const dist = Math.sqrt(distSq);
    const push = body.radius - dist;
    return { x: body.x + (dx / dist) * push, z: body.z + (dz / dist) * push };
  }

  // Center inside the rect: exit through the face it entered.
  if (axis === 'x' && delta > 0) return { x: box.minX - body.radius, z: body.z };
  if (axis === 'x' && delta < 0) return { x: box.maxX + body.radius, z: body.z };
  if (axis === 'z' && delta > 0) return { x: body.x, z: box.minZ - body.radius };
  if (axis === 'z' && delta < 0) return { x: body.x, z: box.maxZ + body.radius };

  // No movement on this axis (overlap from elsewhere): smallest face push.
  const left = body.x - box.minX + body.radius;
  const right = box.maxX - body.x + body.radius;
  const back = body.z - box.minZ + body.radius;
  const front = box.maxZ - body.z + body.radius;
  const min = Math.min(left, right, back, front);
  if (min === left) return { x: box.minX - body.radius, z: body.z };
  if (min === right) return { x: box.maxX + body.radius, z: body.z };
  if (min === back) return { x: body.x, z: box.minZ - body.radius };
  return { x: body.x, z: box.maxZ + body.radius };
}

export class ColliderSet {
  private boxes: Aabb[] = [];

  add(box: Aabb): void {
    this.boxes.push(box);
  }

  addAll(boxes: Aabb[]): void {
    for (const b of boxes) this.boxes.push(b);
  }

  clear(): void {
    this.boxes = [];
  }

  get all(): readonly Aabb[] {
    return this.boxes;
  }

  /**
   * Move the body by (dx, dz) with wall sliding: X and Z applied separately
   * so blocked motion on one axis preserves the other. Boxes whose top is
   * within stepUp of the body's feet are climbable and don't block
   * horizontally — the caller settles Y afterwards via groundHeight().
   *
   * Returns the resolved horizontal position (x, z).
   */
  moveBody(body: CylinderBody, dx: number, dz: number, stepUp: number): { x: number; z: number } {
    let { x, z } = body;

    for (const axis of ['x', 'z'] as const) {
      const moved: CylinderBody = {
        x: axis === 'x' ? x + dx : x,
        y: body.y,
        z: axis === 'z' ? z + dz : z,
        radius: body.radius,
        height: body.height,
      };
      const delta = axis === 'x' ? dx : dz;
      for (const box of this.boxes) {
        if (!overlaps(moved, box)) continue;
        const ledge = box.maxY - moved.y;
        if (ledge > 0 && ledge <= stepUp) continue; // climbable — Y settles later
        const corrected = pushOut(moved, box, axis, delta);
        moved.x = corrected.x;
        moved.z = corrected.z;
      }
      x = moved.x;
      z = moved.z;
    }

    return { x, z };
  }

  /** Highest collider top at (x, z) within radius that is at or below y + stepUp. */
  groundHeight(x: number, z: number, radius: number, y: number, stepUp: number): number {
    let ground = 0;
    const probe: CylinderBody = { x, y: -1e3, z, radius, height: 2e3 };
    for (const box of this.boxes) {
      if (!overlaps(probe, box)) continue;
      if (box.maxY <= y + stepUp && box.maxY > ground) ground = box.maxY;
    }
    return ground;
  }
}
