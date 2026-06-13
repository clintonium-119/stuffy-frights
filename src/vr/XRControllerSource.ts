/**
 * Quest 3 controllers as a ControlSource. Left stick moves; left trigger
 * sprints; right trigger interacts; right A toggles the flashlight; right B
 * toggles crouch. The right stick is intentionally unbound (turning is
 * head-only). The right controller's world pose is exposed for the
 * independently-aimed flashlight.
 *
 * xr-standard gamepad mapping (Touch controllers):
 *   axes[2]=stick X, axes[3]=stick Y · buttons[0]=trigger, [4]=A/X, [5]=B/Y.
 */
import * as THREE from 'three';
import { config } from '../core/config';
import { emptyIntent, type ControlIntent, type ControlSource } from '../core/Controls';

const STICK_X = 2;
const STICK_Y = 3;
const TRIGGER = 0;
const BTN_A = 4;
const BTN_B = 5;

export interface PadLike {
  readonly axes: ReadonlyArray<number>;
  readonly buttons: ReadonlyArray<{ readonly pressed: boolean; readonly value: number }>;
}

/** Stick → move vector (forward = stick pushed up, i.e. negative Y). */
export function stickVector(x: number, y: number, deadZone: number): { moveX: number; moveY: number } {
  if (Math.hypot(x, y) < deadZone) return { moveX: 0, moveY: 0 };
  return { moveX: x, moveY: -y };
}

const pressed = (pad: PadLike | undefined, i: number, threshold: number): boolean =>
  !!pad && !!pad.buttons[i] && (pad.buttons[i].pressed || pad.buttons[i].value > threshold);

export class XRControllerSource implements ControlSource {
  private _moveX = 0;
  private _moveY = 0;
  private _sprintHeld = false;
  private _interact = false;
  private _flashlightToggle = false;
  private _crouchToggle = false;

  // Edge tracking for the right-hand buttons (fire once per press).
  private prevTrigger = false;
  private prevA = false;
  private prevB = false;

  private rightIndex = -1;
  private tmpPos = new THREE.Vector3();
  private tmpQuat = new THREE.Quaternion();

  constructor(private readonly renderer: THREE.WebGLRenderer) {}

  sample(): void {
    const session = this.renderer.xr.getSession();
    if (!session) {
      this._moveX = this._moveY = 0;
      this._sprintHeld = false;
      return;
    }
    const cfg = config.vr;
    let left: PadLike | undefined;
    let right: PadLike | undefined;
    const sources = session.inputSources;
    for (let i = 0; i < sources.length; i++) {
      const src = sources[i];
      const pad = src.gamepad as PadLike | undefined;
      if (!pad) continue;
      if (src.handedness === 'left') left = pad;
      else if (src.handedness === 'right') {
        right = pad;
        this.rightIndex = i;
      }
    }

    // Left stick → move; left trigger → sprint.
    if (left) {
      const v = stickVector(left.axes[STICK_X] ?? 0, left.axes[STICK_Y] ?? 0, cfg.stickDeadZone);
      this._moveX = v.moveX;
      this._moveY = v.moveY;
      this._sprintHeld = pressed(left, TRIGGER, cfg.triggerThreshold);
    } else {
      this._moveX = this._moveY = 0;
      this._sprintHeld = false;
    }

    // Right buttons → one-shot edges.
    const trig = pressed(right, TRIGGER, cfg.triggerThreshold);
    const a = pressed(right, BTN_A, cfg.triggerThreshold);
    const b = pressed(right, BTN_B, cfg.triggerThreshold);
    if (trig && !this.prevTrigger) this._interact = true;
    if (a && !this.prevA) this._flashlightToggle = true;
    if (b && !this.prevB) this._crouchToggle = true;
    this.prevTrigger = trig;
    this.prevA = a;
    this.prevB = b;
  }

  get intent(): ControlIntent {
    return {
      ...emptyIntent(),
      moveX: this._moveX,
      moveY: this._moveY,
      sprintHeld: this._sprintHeld,
      interact: this._interact,
      flashlightToggle: this._flashlightToggle,
      crouchToggle: this._crouchToggle,
    };
  }

  endStep(): void {
    this._interact = false;
    this._flashlightToggle = false;
    this._crouchToggle = false;
  }

  /**
   * Right controller world pose for aiming the flashlight, or null when the
   * controller isn't tracked yet (pose still at the origin) — null makes the
   * flashlight fall back to following the head so it stays visible.
   */
  rightControllerPose(): { position: THREE.Vector3; forward: THREE.Vector3 } | null {
    if (this.rightIndex < 0) return null;
    const ctrl = this.renderer.xr.getController(this.rightIndex);
    const position = ctrl.getWorldPosition(this.tmpPos).clone();
    if (position.lengthSq() < 1e-4) return null; // untracked → head-follow
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      ctrl.getWorldQuaternion(this.tmpQuat)
    );
    return { position, forward };
  }
}
