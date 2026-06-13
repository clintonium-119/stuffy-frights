import { describe, it, expect } from 'vitest';
import { joystickVector } from './TouchControls';

const R = 70;
const DZ = 0.15;

describe('joystickVector', () => {
  it('returns zero inside the dead-zone', () => {
    const v = joystickVector(5, 5, R, DZ); // |len| ≈ 7 < 70*0.15 = 10.5
    expect(v).toEqual({ moveX: 0, moveY: 0 });
  });

  it('maps a rightward drag to +moveX', () => {
    const v = joystickVector(R, 0, R, DZ);
    expect(v.moveX).toBeCloseTo(1, 5);
    expect(v.moveY).toBeCloseTo(0, 5);
  });

  it('maps an upward (screen-up) drag to +moveY (forward)', () => {
    const v = joystickVector(0, -R, R, DZ);
    expect(v.moveY).toBeCloseTo(1, 5);
    expect(v.moveX).toBeCloseTo(0, 5);
  });

  it('maps a downward drag to -moveY (backward)', () => {
    const v = joystickVector(0, R, R, DZ);
    expect(v.moveY).toBeCloseTo(-1, 5);
  });

  it('clamps magnitude to 1 past the radius', () => {
    const v = joystickVector(R * 4, 0, R, DZ);
    expect(Math.hypot(v.moveX, v.moveY)).toBeCloseTo(1, 5);
  });

  it('scales magnitude between dead-zone and radius', () => {
    const v = joystickVector(R / 2, 0, R, DZ); // half deflection
    expect(v.moveX).toBeCloseTo(0.5, 5);
  });
});
