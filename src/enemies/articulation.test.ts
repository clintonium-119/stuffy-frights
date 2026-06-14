import { describe, it, expect } from 'vitest';
import { solveGaze, solveFootLift, bodyPitchFromFeet, wrapAngle } from './articulation';

const base = { headX: 0, headY: 1.5, headZ: 0, bodyYaw: 0, maxYaw: 0.9, maxPitch: 0.7 };

describe('solveGaze', () => {
  it('yaws toward a target off to the side, within the clamp', () => {
    const g = solveGaze({ ...base, targetX: 2, targetY: 1.5, targetZ: 0.5 });
    expect(g.yaw).toBeGreaterThan(0); // +X side → positive yaw
    expect(g.yaw).toBeLessThanOrEqual(base.maxYaw);
    expect(Math.abs(g.pitch)).toBeLessThan(0.05); // level target → ~no pitch
  });

  it('looks DOWN for a low target (positive pitch = +Z tipped down)', () => {
    const g = solveGaze({ ...base, targetX: 0, targetY: 0.25, targetZ: 1.2 });
    expect(g.pitch).toBeGreaterThan(0);
  });

  it('looks up for a target above', () => {
    const g = solveGaze({ ...base, targetX: 0, targetY: 3, targetZ: 1 });
    expect(g.pitch).toBeLessThan(0);
  });

  it('clamps yaw for a target behind, never wrapping past the cone', () => {
    const g = solveGaze({ ...base, targetX: 0.2, targetY: 1.5, targetZ: -2 });
    expect(g.yaw).toBeLessThanOrEqual(base.maxYaw);
    expect(g.yaw).toBeGreaterThanOrEqual(-base.maxYaw);
  });

  it('measures yaw relative to the body facing', () => {
    // Target dead ahead in world, but body already turned +0.5: head should
    // counter toward -0.5 to face world-forward.
    const g = solveGaze({ ...base, bodyYaw: 0.5, targetX: 0, targetY: 1.5, targetZ: 2 });
    expect(g.yaw).toBeCloseTo(-0.5, 5);
  });
});

describe('solveFootLift', () => {
  it('is zero on flat ground', () => {
    expect(solveFootLift({ groundUnderFoot: 1, groundUnderBody: 1, maxLift: 0.4 })).toBe(0);
  });
  it('lifts the foot when its ground is higher (ascending), clamped', () => {
    expect(solveFootLift({ groundUnderFoot: 1.3, groundUnderBody: 1, maxLift: 0.4 })).toBeCloseTo(0.3);
    expect(solveFootLift({ groundUnderFoot: 5, groundUnderBody: 1, maxLift: 0.4 })).toBe(0.4);
  });
  it('drops the foot when its ground is lower (descending), clamped', () => {
    expect(solveFootLift({ groundUnderFoot: 0.7, groundUnderBody: 1, maxLift: 0.4 })).toBeCloseTo(-0.3);
    expect(solveFootLift({ groundUnderFoot: -5, groundUnderBody: 1, maxLift: 0.4 })).toBe(-0.4);
  });
});

describe('bodyPitchFromFeet', () => {
  it('tips the front up when the front feet are higher (ascending)', () => {
    expect(bodyPitchFromFeet(0.2, -0.1, 0.6)).toBeGreaterThan(0);
  });
  it('is level when front and back match', () => {
    expect(bodyPitchFromFeet(0.1, 0.1, 0.6)).toBe(0);
  });
});

describe('wrapAngle', () => {
  it('wraps into (-pi, pi]', () => {
    expect(wrapAngle(Math.PI * 1.5)).toBeCloseTo(-Math.PI * 0.5, 5);
    expect(wrapAngle(-Math.PI * 1.5)).toBeCloseTo(Math.PI * 0.5, 5);
  });
});
