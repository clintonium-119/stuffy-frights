import { describe, it, expect } from 'vitest';
import { ControlManager, KeyboardMouseSource, emptyIntent, type ControlSource } from './Controls';
import { Input } from './Input';
import { config } from './config';

/** Poke Input's private state without attaching DOM listeners. */
function rawInput() {
  const input = new Input();
  const priv = input as unknown as {
    down: Set<string>;
    pressedThisStep: Set<string>;
    pointerLocked: boolean;
  };
  return { input, priv };
}

describe('KeyboardMouseSource movement mapping', () => {
  it('maps W to forward, S to back, D/A to strafe', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    priv.down.add('KeyW');
    expect(src.intent.moveY).toBe(1);
    expect(src.intent.moveX).toBe(0);
    priv.down.add('KeyD');
    expect(src.intent.moveX).toBe(1);
    priv.down.add('KeyA');
    expect(src.intent.moveX).toBe(0); // A + D cancel
    priv.down.delete('KeyW');
    priv.down.add('KeyS');
    expect(src.intent.moveY).toBe(-1);
  });

  it('opposing keys on both axes cancel to a zero vector', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    priv.down.add('KeyW');
    priv.down.add('KeyS');
    priv.down.add('KeyA');
    priv.down.add('KeyD');
    expect(src.intent.moveX).toBe(0);
    expect(src.intent.moveY).toBe(0);
  });
});

describe('KeyboardMouseSource look mapping', () => {
  it('scales mouse delta by sensitivity only while pointer-locked', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    input.mouseDx = 10;
    input.mouseDy = -4;
    expect(src.intent.lookDx).toBe(0); // not locked
    priv.pointerLocked = true;
    expect(src.intent.lookDx).toBeCloseTo(10 * config.player.lookSensitivity, 10);
    expect(src.intent.lookDy).toBeCloseTo(-4 * config.player.lookSensitivity, 10);
  });
});

describe('KeyboardMouseSource sprint + edges', () => {
  it('reports sprintHeld while Shift is down', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    expect(src.intent.sprintHeld).toBe(false);
    priv.down.add('ShiftLeft');
    expect(src.intent.sprintHeld).toBe(true);
  });

  it('maps justPressed keys to their one-step edges', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    priv.pressedThisStep.add('KeyC');
    priv.pressedThisStep.add('KeyF');
    priv.pressedThisStep.add('KeyE');
    priv.pressedThisStep.add('Tab');
    const i = src.intent;
    expect(i.crouchToggle).toBe(true);
    expect(i.flashlightToggle).toBe(true);
    expect(i.interact).toBe(true);
    expect(i.mapToggle).toBe(true); // Tab also opens the map
    // Input.endStep clears the per-step edges.
    input.endStep();
    expect(src.intent.crouchToggle).toBe(false);
  });

  it('KeyM also drives mapToggle; pause is never set by keyboard', () => {
    const { input, priv } = rawInput();
    const src = new KeyboardMouseSource(input);
    priv.pressedThisStep.add('KeyM');
    expect(src.intent.mapToggle).toBe(true);
    expect(src.intent.pause).toBe(false);
  });
});

describe('ControlManager aggregation', () => {
  const stub = (over: Partial<ReturnType<typeof emptyIntent>>): ControlSource => ({
    sample() {},
    endStep() {},
    get intent() {
      return { ...emptyIntent(), ...over };
    },
  });

  it('sums continuous fields (clamped) and ORs edges across sources', () => {
    const mgr = new ControlManager();
    mgr.add(stub({ moveX: 0.8, moveY: 0.5, interact: true }));
    mgr.add(stub({ moveX: 0.8, sprintHeld: true }));
    const i = mgr.intent;
    expect(i.moveX).toBe(1); // 0.8 + 0.8 clamped to 1
    expect(i.moveY).toBe(0.5);
    expect(i.interact).toBe(true);
    expect(i.sprintHeld).toBe(true);
  });

  it('an empty manager yields a zero intent', () => {
    const mgr = new ControlManager();
    expect(mgr.intent).toEqual(emptyIntent());
  });
});
