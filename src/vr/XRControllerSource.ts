/**
 * Quest 3 controllers as a ControlSource.
 *   Left  — stick: move · trigger: run (held) · grip: crouch · X: map
 *   Right — trigger: interact · grip: flashlight · A: pause · stick X: snap-turn
 * The right controller's world pose is exposed for the independently-aimed
 * flashlight. Vertical look stays headset-only (right stick Y is ignored).
 *
 * xr-standard gamepad mapping (Touch controllers):
 *   axes[2]=stick X, axes[3]=stick Y · buttons[0]=trigger, [1]=grip,
 *   [4]=A/X (primary), [5]=B/Y (secondary).
 */
import * as THREE from 'three';
import { config } from '../core/config';
import { emptyIntent, type ControlIntent, type ControlSource } from '../core/Controls';

const STICK_X = 2;
const STICK_Y = 3;
const TRIGGER = 0;
const GRIP = 1;
const BTN_PRIMARY = 4; // A on the right, X on the left

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
  private _mapToggle = false;
  private _pause = false;

  // Edge tracking (fire once per press).
  private prevRightTrigger = false;
  private prevRightGrip = false;
  private prevRightA = false;
  private prevLeftGrip = false;
  private prevLeftX = false;

  // Right-stick snap-turn — accumulates radians, consumed by takeSnapTurn().
  private snapArmed = true;
  private pendingSnap = 0;

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

    // Left: stick → move, trigger → run, grip → crouch, X → map.
    if (left) {
      const v = stickVector(left.axes[STICK_X] ?? 0, left.axes[STICK_Y] ?? 0, cfg.stickDeadZone);
      this._moveX = v.moveX;
      this._moveY = v.moveY;
      this._sprintHeld = pressed(left, TRIGGER, cfg.triggerThreshold);
    } else {
      this._moveX = this._moveY = 0;
      this._sprintHeld = false;
    }
    const leftGrip = pressed(left, GRIP, cfg.triggerThreshold);
    const leftX = pressed(left, BTN_PRIMARY, cfg.triggerThreshold);
    if (leftGrip && !this.prevLeftGrip) this._crouchToggle = true;
    if (leftX && !this.prevLeftX) this._mapToggle = true;
    this.prevLeftGrip = leftGrip;
    this.prevLeftX = leftX;

    // Right: trigger → interact, grip → flashlight, A → pause.
    const rTrig = pressed(right, TRIGGER, cfg.triggerThreshold);
    const rGrip = pressed(right, GRIP, cfg.triggerThreshold);
    const rA = pressed(right, BTN_PRIMARY, cfg.triggerThreshold);
    if (rTrig && !this.prevRightTrigger) this._interact = true;
    if (rGrip && !this.prevRightGrip) this._flashlightToggle = true;
    if (rA && !this.prevRightA) this._pause = true;
    this.prevRightTrigger = rTrig;
    this.prevRightGrip = rGrip;
    this.prevRightA = rA;

    // Right stick X → snap-turn (re-center between snaps; Y ignored).
    const rx = right?.axes[STICK_X] ?? 0;
    if (this.snapArmed && Math.abs(rx) > cfg.snapTurnThreshold) {
      const step = (cfg.snapTurnDegrees * Math.PI) / 180;
      this.pendingSnap += rx > 0 ? step : -step;
      this.snapArmed = false;
    } else if (Math.abs(rx) < cfg.snapTurnRelease) {
      this.snapArmed = true;
    }
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
      mapToggle: this._mapToggle,
      pause: this._pause,
    };
  }

  endStep(): void {
    this._interact = false;
    this._flashlightToggle = false;
    this._crouchToggle = false;
    this._mapToggle = false;
    this._pause = false;
  }

  /** Pending snap-turn rotation in radians (signed); resets to 0 when read. */
  takeSnapTurn(): number {
    const s = this.pendingSnap;
    this.pendingSnap = 0;
    return s;
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
