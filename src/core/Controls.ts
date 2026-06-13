/**
 * Source-agnostic control layer. Gameplay (PlayerController, the main loop)
 * reads a single per-step ControlIntent; it never touches raw key codes,
 * touch events, or gamepad axes. Pluggable ControlSources (keyboard/mouse,
 * touch, XR controllers) produce intents; a ControlManager aggregates them.
 *
 * Look deltas are already in radians — each source applies its own
 * sensitivity — so consumers stay unit-agnostic across platforms.
 */
import { config } from './config';
import { Input } from './Input';

export interface ControlIntent {
  /** Strafe, −1 (left) .. +1 (right). */
  moveX: number;
  /** Forward, −1 (back) .. +1 (forward). */
  moveY: number;
  /** Per-step yaw delta in radians (already sensitivity-scaled). */
  lookDx: number;
  /** Per-step pitch delta in radians. */
  lookDy: number;
  /** Held this step (continuous). */
  sprintHeld: boolean;
  /** Edges — true for exactly one step. */
  crouchToggle: boolean;
  flashlightToggle: boolean;
  interact: boolean;
  mapToggle: boolean;
  pause: boolean;
}

export function emptyIntent(): ControlIntent {
  return {
    moveX: 0,
    moveY: 0,
    lookDx: 0,
    lookDy: 0,
    sprintHeld: false,
    crouchToggle: false,
    flashlightToggle: false,
    interact: false,
    mapToggle: false,
    pause: false,
  };
}

export interface ControlSource {
  /** Poll any push-pull state (gamepads). Pull-based sources may no-op. */
  sample(): void;
  /** The source's current intent for this step. */
  readonly intent: ControlIntent;
  /** Consume per-step edges/deltas. Called once per fixed step. */
  endStep(): void;
}

const clamp1 = (v: number): number => Math.max(-1, Math.min(1, v));

/**
 * Aggregates registered sources into one intent: continuous fields sum (then
 * clamp), edges OR together. Only one source is ever active at runtime, so the
 * sum is a safe, order-independent merge.
 */
export class ControlManager {
  private sources: ControlSource[] = [];

  add(source: ControlSource): void {
    this.sources.push(source);
  }

  remove(source: ControlSource): void {
    const i = this.sources.indexOf(source);
    if (i >= 0) this.sources.splice(i, 1);
  }

  sample(): void {
    for (const s of this.sources) s.sample();
  }

  get intent(): ControlIntent {
    const out = emptyIntent();
    for (const s of this.sources) {
      const i = s.intent;
      out.moveX += i.moveX;
      out.moveY += i.moveY;
      out.lookDx += i.lookDx;
      out.lookDy += i.lookDy;
      out.sprintHeld ||= i.sprintHeld;
      out.crouchToggle ||= i.crouchToggle;
      out.flashlightToggle ||= i.flashlightToggle;
      out.interact ||= i.interact;
      out.mapToggle ||= i.mapToggle;
      out.pause ||= i.pause;
    }
    out.moveX = clamp1(out.moveX);
    out.moveY = clamp1(out.moveY);
    return out;
  }

  endStep(): void {
    for (const s of this.sources) s.endStep();
  }
}

/**
 * Keyboard + mouse source — wraps the existing Input. Pull-based: the intent
 * getter reads Input live, so it works without sample(). Edge clearing stays
 * owned by Input.endStep() (called from the main loop), so endStep() here is a
 * no-op; this keeps desktop pointer-lock/mouse bookkeeping exactly as it was.
 */
export class KeyboardMouseSource implements ControlSource {
  constructor(private readonly input: Input) {}

  sample(): void {
    /* pull-based — nothing to poll */
  }

  get intent(): ControlIntent {
    const input = this.input;
    const locked = input.isPointerLocked;
    const sens = config.player.lookSensitivity;
    return {
      moveX: (input.isDown('KeyD') ? 1 : 0) - (input.isDown('KeyA') ? 1 : 0),
      moveY: (input.isDown('KeyW') ? 1 : 0) - (input.isDown('KeyS') ? 1 : 0),
      lookDx: locked ? input.mouseDx * sens : 0,
      lookDy: locked ? input.mouseDy * sens : 0,
      sprintHeld: input.isDown('ShiftLeft') || input.isDown('ShiftRight'),
      crouchToggle: input.justPressed('KeyC'),
      flashlightToggle: input.justPressed('KeyF'),
      interact: input.justPressed('KeyE'),
      mapToggle: input.justPressed('KeyM') || input.justPressed('Tab'),
      pause: false, // desktop pause is the pointer-lock-loss path, unchanged
    };
  }

  endStep(): void {
    /* Input.endStep() (main loop) owns clearing edges + mouse deltas */
  }
}
