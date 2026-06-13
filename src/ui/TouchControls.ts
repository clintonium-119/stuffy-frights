/**
 * Mobile touch input as a ControlSource. The right screen half is a virtual
 * movement joystick; the left half is a look-drag zone. On-screen buttons
 * (flashlight, interact, run, crouch, map, pause) are added alongside. Only
 * active on phones (registered by main when Platform.isMobile()).
 *
 * Pure vector math is exported (joystickVector) and unit-tested; the DOM glue
 * is verified in-browser, matching the project's no-jsdom test convention.
 */
import { config } from '../core/config';
import type { ControlIntent, ControlSource } from '../core/Controls';

/**
 * Normalize a joystick drag into a move vector in game convention
 * (moveX = strafe right, moveY = forward). `dx/dy` are pixels from the
 * touch origin (screen axes: +x right, +y down). Inside the dead-zone the
 * result is zero; past the radius it clamps to unit length.
 */
export function joystickVector(
  dx: number,
  dy: number,
  radius: number,
  deadZoneFrac: number
): { moveX: number; moveY: number } {
  const len = Math.hypot(dx, dy);
  if (len < radius * deadZoneFrac || len === 0) return { moveX: 0, moveY: 0 };
  const mag = Math.min(len, radius) / radius;
  return { moveX: (dx / len) * mag, moveY: -(dy / len) * mag };
}

export class TouchControls implements ControlSource {
  private root: HTMLDivElement;
  private knob: HTMLDivElement;

  // Movement (right zone) — persists while the finger is down.
  private moveTouchId: number | null = null;
  private moveOriginX = 0;
  private moveOriginY = 0;
  private _moveX = 0;
  private _moveY = 0;

  // Look (left zone) — per-step accumulated delta.
  private lookTouchId: number | null = null;
  private lookLastX = 0;
  private lookLastY = 0;
  private _lookDx = 0;
  private _lookDy = 0;

  // Buttons — run is a persistent toggle; the rest are one-step edges.
  private _sprintHeld = false;
  private _crouchOn = false;
  private _flashlightToggle = false;
  private _interact = false;
  private _crouchToggle = false;
  private _mapToggle = false;
  private _pause = false;
  private runBtn!: HTMLButtonElement;
  private crouchBtn!: HTMLButtonElement;

  constructor(ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'clickable';
    this.root.style.cssText = 'position:absolute;inset:0;display:none;touch-action:none;z-index:5';

    this.knob = document.createElement('div');
    this.knob.style.cssText =
      'position:absolute;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;' +
      'border:2px solid rgba(232,220,192,0.5);background:rgba(232,220,192,0.12);' +
      'pointer-events:none;display:none';
    this.root.appendChild(this.knob);

    ui.appendChild(this.root);

    this.root.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    this.root.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.root.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
    this.root.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });

    this.buildButtons();
  }

  /**
   * Six finger-sized buttons. Left (look) side: flashlight + interact, near
   * that thumb. Right (move) side: run + crouch toggles, clear of the joystick
   * zone. Top corners: map + pause. Each captures its own touch so the zone
   * underneath doesn't also react.
   */
  private buildButtons(): void {
    // Left side (above the look thumb).
    this.makeButton('🔦', 'left:18px;bottom:104px', () => {
      this._flashlightToggle = true;
    });
    this.makeButton('✋', 'left:104px;bottom:36px', () => {
      this._interact = true;
    });
    // Right side (above/left of the joystick thumb, clear of its travel).
    this.runBtn = this.makeButton('RUN', 'right:18px;bottom:200px', () => {
      this._sprintHeld = !this._sprintHeld;
      this.paintToggle(this.runBtn, this._sprintHeld);
    });
    this.crouchBtn = this.makeButton('CROUCH', 'right:18px;bottom:140px', () => {
      this._crouchToggle = true;
      this._crouchOn = !this._crouchOn;
      this.paintToggle(this.crouchBtn, this._crouchOn);
    });
    // Top corners.
    this.makeButton('MAP', 'right:18px;top:18px', () => {
      this._mapToggle = true;
    });
    this.makeButton('❚❚', 'left:18px;top:18px', () => {
      this._pause = true;
    });
  }

  private makeButton(label: string, posCss: string, onPress: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText =
      `position:absolute;${posCss};min-width:56px;height:56px;padding:0 12px;` +
      `font:700 15px 'Trebuchet MS';color:#e8dcc0;background:rgba(58,47,34,0.78);` +
      `border:2px solid #6b6149;border-radius:10px;pointer-events:auto;touch-action:none`;
    const press = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onPress();
    };
    b.addEventListener('touchstart', press, { passive: false });
    this.root.appendChild(b);
    return b;
  }

  private paintToggle(b: HTMLButtonElement, on: boolean): void {
    b.style.background = on ? 'rgba(181,159,106,0.85)' : 'rgba(58,47,34,0.78)';
    b.style.color = on ? '#1a140c' : '#e8dcc0';
  }

  /** Root element so later steps (buttons) can append into the same overlay. */
  protected get overlay(): HTMLDivElement {
    return this.root;
  }

  show(): void {
    this.root.style.display = 'block';
  }

  hide(): void {
    this.root.style.display = 'none';
    this.reset();
  }

  private reset(): void {
    this.moveTouchId = null;
    this.lookTouchId = null;
    this._moveX = 0;
    this._moveY = 0;
    this._lookDx = 0;
    this._lookDy = 0;
    this._sprintHeld = false;
    this._crouchOn = false;
    this.endStep();
    this.knob.style.display = 'none';
    this.paintToggle(this.runBtn, false);
    this.paintToggle(this.crouchBtn, false);
  }

  private onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const mid = window.innerWidth / 2;
    for (const t of Array.from(e.changedTouches)) {
      if (t.clientX >= mid && this.moveTouchId === null) {
        // Right half — movement joystick.
        this.moveTouchId = t.identifier;
        this.moveOriginX = t.clientX;
        this.moveOriginY = t.clientY;
        this.knob.style.left = `${t.clientX}px`;
        this.knob.style.top = `${t.clientY}px`;
        this.knob.style.display = 'block';
      } else if (t.clientX < mid && this.lookTouchId === null) {
        // Left half — look drag.
        this.lookTouchId = t.identifier;
        this.lookLastX = t.clientX;
        this.lookLastY = t.clientY;
      }
    }
  }

  private onTouchMove(e: TouchEvent): void {
    e.preventDefault();
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === this.moveTouchId) {
        const v = joystickVector(
          t.clientX - this.moveOriginX,
          t.clientY - this.moveOriginY,
          config.touch.joystickRadius,
          config.touch.joystickDeadZone
        );
        this._moveX = v.moveX;
        this._moveY = v.moveY;
      } else if (t.identifier === this.lookTouchId) {
        this._lookDx += (t.clientX - this.lookLastX) * config.touch.lookSensitivity;
        this._lookDy += (t.clientY - this.lookLastY) * config.touch.lookSensitivity;
        this.lookLastX = t.clientX;
        this.lookLastY = t.clientY;
      }
    }
  }

  private onTouchEnd(e: TouchEvent): void {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === this.moveTouchId) {
        this.moveTouchId = null;
        this._moveX = 0;
        this._moveY = 0;
        this.knob.style.display = 'none';
      } else if (t.identifier === this.lookTouchId) {
        this.lookTouchId = null;
      }
    }
  }

  sample(): void {
    /* event-driven — nothing to poll */
  }

  get intent(): ControlIntent {
    return {
      moveX: this._moveX,
      moveY: this._moveY,
      lookDx: this._lookDx,
      lookDy: this._lookDy,
      sprintHeld: this._sprintHeld,
      crouchToggle: this._crouchToggle,
      flashlightToggle: this._flashlightToggle,
      interact: this._interact,
      mapToggle: this._mapToggle,
      pause: this._pause,
    };
  }

  endStep(): void {
    // Look is per-step; movement + the run toggle persist. Clear one-step edges.
    this._lookDx = 0;
    this._lookDy = 0;
    this._flashlightToggle = false;
    this._interact = false;
    this._crouchToggle = false;
    this._mapToggle = false;
    this._pause = false;
  }
}
