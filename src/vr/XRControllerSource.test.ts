import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { XRControllerSource, stickVector } from './XRControllerSource';
import { config } from '../core/config';

const DZ = config.vr.stickDeadZone;

describe('stickVector', () => {
  it('zeroes inside the dead-zone', () => {
    expect(stickVector(0.05, 0.05, DZ)).toEqual({ moveX: 0, moveY: 0 });
  });
  it('maps stick-up to forward (+moveY)', () => {
    const v = stickVector(0, -1, DZ);
    expect(v.moveY).toBe(1);
    expect(v.moveX).toBe(0);
  });
  it('passes strafe through on X', () => {
    expect(stickVector(0.8, 0, DZ).moveX).toBeCloseTo(0.8, 5);
  });
});

/** Minimal gamepad/inputSource/renderer fakes. */
function pad(axes: number[], pressedButtons: number[]) {
  const buttons = Array.from({ length: 6 }, (_, i) => ({
    pressed: pressedButtons.includes(i),
    value: pressedButtons.includes(i) ? 1 : 0,
  }));
  return { axes, buttons };
}
function fakeRenderer(left?: ReturnType<typeof pad>, right?: ReturnType<typeof pad>) {
  const inputSources = [
    { handedness: 'left', gamepad: left },
    { handedness: 'right', gamepad: right },
  ].filter((s) => s.gamepad);
  return {
    xr: {
      getSession: () => ({ inputSources }),
      getController: () => new THREE.Group(),
    },
  } as unknown as THREE.WebGLRenderer;
}

describe('XRControllerSource mapping', () => {
  it('left stick drives move; left trigger drives sprint', () => {
    const src = new XRControllerSource(fakeRenderer(pad([0, 0, 0.9, -1], [0]), pad([0, 0, 0, 0], [])));
    src.sample();
    const i = src.intent;
    expect(i.moveX).toBeCloseTo(0.9, 5);
    expect(i.moveY).toBeCloseTo(1, 5);
    expect(i.sprintHeld).toBe(true);
  });

  it('right A/B/trigger fire one edge per press, not while held', () => {
    const renderer = fakeRenderer(pad([0, 0, 0, 0], []), pad([0, 0, 0, 0], [4]));
    const src = new XRControllerSource(renderer);
    src.sample();
    expect(src.intent.flashlightToggle).toBe(true);
    src.endStep();
    src.sample(); // still held — no new edge
    expect(src.intent.flashlightToggle).toBe(false);
  });

  it('right stick is ignored (no movement from it)', () => {
    const src = new XRControllerSource(fakeRenderer(undefined, pad([0, 0, 1, 1], [])));
    src.sample();
    expect(src.intent.moveX).toBe(0);
    expect(src.intent.moveY).toBe(0);
  });

  it('zeroes movement when no session is active', () => {
    const src = new XRControllerSource({ xr: { getSession: () => null } } as unknown as THREE.WebGLRenderer);
    src.sample();
    expect(src.intent.moveX).toBe(0);
    expect(src.intent.sprintHeld).toBe(false);
  });
});
