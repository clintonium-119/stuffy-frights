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

/** Monochrome 24×24 glyphs (fill: currentColor → tinted the menu cream). */
const svg = (paths: string): string =>
  `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  pause: svg('<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'),
  map: svg(
    '<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>'
  ),
  // Running figure (sprint).
  run: svg(
    '<path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>'
  ),
  // Double down-chevron (crouch / go low).
  crouch: svg(
    '<path d="M16.59 5.59L12 10.17 7.41 5.59 6 7l6 6 6-6zM16.59 11.59L12 16.17 7.41 11.59 6 13l6 6 6-6z"/>'
  ),
  // Torch with bulb.
  flashlight: svg(
    '<path d="M6 2v4h12V2H6zm0 6v3l3 3v8h6v-8l3-3V8H6zm6 5c-.83 0-1.5-.67-1.5-1.5S11.17 10 12 10s1.5.67 1.5 1.5S12.83 13 12 13z"/>'
  ),
  // Open hand (interact).
  interact: svg(
    '<path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83c0-.01 1.26-1.24 1.3-1.25.21-.19.49-.29.79-.29.22 0 .42.06.6.16L7 15V4c0-.83.67-1.5 1.5-1.5S10 3.17 10 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S14 .67 14 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"/>'
  ),
} as const;

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
   * Round, semi-transparent, icon-only buttons (icons tinted the same cream as
   * the menu text). Layout matches the control sides: LEFT half = movement, so
   * run + crouch toggles live on the left edge; RIGHT half = look, so flashlight
   * + interact live on the right edge. Pause + map sit in the top corners. The
   * action buttons stay clear of the bottom-left HUD bars. Each button captures
   * its own touch so the zone underneath doesn't also react.
   */
  private buildButtons(): void {
    // Top corners (occasional) — smaller.
    this.makeButton(ICONS.pause, 'left:16px;top:16px', 46, () => {
      this._pause = true;
    });
    this.makeButton(ICONS.map, 'right:16px;top:16px', 46, () => {
      this._mapToggle = true;
    });
    // Left edge (movement side) — run + crouch toggles, mid-height, above the HUD.
    this.runBtn = this.makeButton(ICONS.run, 'left:16px;bottom:190px', 60, () => {
      this._sprintHeld = !this._sprintHeld;
      this.paintToggle(this.runBtn, this._sprintHeld);
    });
    this.crouchBtn = this.makeButton(ICONS.crouch, 'left:16px;bottom:118px', 60, () => {
      this._crouchToggle = true;
      this._crouchOn = !this._crouchOn;
      this.paintToggle(this.crouchBtn, this._crouchOn);
    });
    // Right edge (look side) — flashlight + interact.
    this.makeButton(ICONS.flashlight, 'right:16px;bottom:190px', 60, () => {
      this._flashlightToggle = true;
    });
    this.makeButton(ICONS.interact, 'right:16px;bottom:118px', 60, () => {
      this._interact = true;
    });
  }

  private makeButton(iconSvg: string, posCss: string, size: number, onPress: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.innerHTML = iconSvg;
    b.style.cssText =
      `position:absolute;${posCss};width:${size}px;height:${size}px;padding:0;` +
      `display:flex;align-items:center;justify-content:center;color:#e8dcc0;` +
      `background:rgba(12,10,6,0.42);border:1.5px solid rgba(232,220,192,0.45);` +
      `border-radius:50%;pointer-events:auto;touch-action:none;-webkit-tap-highlight-color:transparent`;
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
    // The SVG icon uses currentColor, so flipping color recolors the glyph too.
    b.style.background = on ? 'rgba(216,201,160,0.9)' : 'rgba(12,10,6,0.42)';
    b.style.color = on ? '#15110a' : '#e8dcc0';
    b.style.borderColor = on ? 'rgba(216,201,160,0.95)' : 'rgba(232,220,192,0.45)';
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
      if (t.clientX < mid && this.moveTouchId === null) {
        // Left half — movement joystick.
        this.moveTouchId = t.identifier;
        this.moveOriginX = t.clientX;
        this.moveOriginY = t.clientY;
        this.knob.style.left = `${t.clientX}px`;
        this.knob.style.top = `${t.clientY}px`;
        this.knob.style.display = 'block';
      } else if (t.clientX >= mid && this.lookTouchId === null) {
        // Right half — look drag.
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
