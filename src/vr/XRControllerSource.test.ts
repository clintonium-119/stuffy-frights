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

  it('maps the buttons: L-grip=crouch, L-X=map, R-grip=flashlight, R-A=pause, R-trigger=interact', () => {
    // left grip(1)+X(4); right trigger(0)+grip(1)+A(4)
    const src = new XRControllerSource(fakeRenderer(pad([0, 0, 0, 0], [1, 4]), pad([0, 0, 0, 0], [0, 1, 4])));
    src.sample();
    const i = src.intent;
    expect(i.crouchToggle).toBe(true); // left grip
    expect(i.mapToggle).toBe(true); // left X
    expect(i.interact).toBe(true); // right trigger
    expect(i.flashlightToggle).toBe(true); // right grip
    expect(i.pause).toBe(true); // right A
  });

  it('buttons fire one edge per press, not while held', () => {
    const src = new XRControllerSource(fakeRenderer(pad([0, 0, 0, 0], []), pad([0, 0, 0, 0], [1])));
    src.sample();
    expect(src.intent.flashlightToggle).toBe(true);
    src.endStep();
    src.sample(); // grip still held — no new edge
    expect(src.intent.flashlightToggle).toBe(false);
  });

  it('right stick does not move the player (it snap-turns instead)', () => {
    const src = new XRControllerSource(fakeRenderer(undefined, pad([0, 0, 1, 1], [])));
    src.sample();
    expect(src.intent.moveX).toBe(0);
    expect(src.intent.moveY).toBe(0);
  });

  it('right stick X snap-turns once per flick (positive), not while held', () => {
    const src = new XRControllerSource(fakeRenderer(undefined, pad([0, 0, 1, 0], [])));
    const step = (config.vr.snapTurnDegrees * Math.PI) / 180;
    src.sample();
    expect(src.takeSnapTurn()).toBeCloseTo(step, 6); // right flick → +
    expect(src.takeSnapTurn()).toBe(0); // consumed
    src.sample(); // still pushed — no re-fire until re-center
    expect(src.takeSnapTurn()).toBe(0);
  });

  it('left stick-X flick snap-turns negative', () => {
    const src = new XRControllerSource(fakeRenderer(undefined, pad([0, 0, -1, 0], [])));
    const step = (config.vr.snapTurnDegrees * Math.PI) / 180;
    src.sample();
    expect(src.takeSnapTurn()).toBeCloseTo(-step, 6);
  });

  it('zeroes movement when no session is active', () => {
    const src = new XRControllerSource({ xr: { getSession: () => null } } as unknown as THREE.WebGLRenderer);
    src.sample();
    expect(src.intent.moveX).toBe(0);
    expect(src.intent.sprintHeld).toBe(false);
  });
});
