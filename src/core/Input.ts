/**
 * Single keyboard/mouse state service. Systems read state per fixed step;
 * edge detection (justPressed) is consumed once per step via endStep().
 */
export class Input {
  private down = new Set<string>();
  private pressedThisStep = new Set<string>();

  /** Accumulated mouse movement since the last endStep(), in px. */
  mouseDx = 0;
  mouseDy = 0;

  private pointerLocked = false;
  private target: HTMLElement | null = null;
  /** Fired when pointer lock is lost (browser Esc) — GameState consumes this. */
  onPointerLockLost: (() => void) | null = null;

  attach(target: HTMLElement): void {
    this.target = target;
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.down.add(e.code);
      this.pressedThisStep.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.down.delete(e.code);
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.pointerLocked) return;
      this.mouseDx += e.movementX;
      this.mouseDy += e.movementY;
    });
    document.addEventListener('pointerlockchange', () => {
      const locked = document.pointerLockElement === this.target;
      if (this.pointerLocked && !locked) this.onPointerLockLost?.();
      this.pointerLocked = locked;
    });
    window.addEventListener('blur', () => {
      this.down.clear();
    });
  }

  requestPointerLock(): void {
    this.target?.requestPointerLock();
  }

  exitPointerLock(): void {
    if (this.pointerLocked) document.exitPointerLock();
  }

  get isPointerLocked(): boolean {
    return this.pointerLocked;
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  /** True once for the fixed step in which the key went down. */
  justPressed(code: string): boolean {
    return this.pressedThisStep.has(code);
  }

  /** True if any movement key is currently held (unplug-from-charger check). */
  anyMovementDown(): boolean {
    return (
      this.down.has('KeyW') || this.down.has('KeyA') || this.down.has('KeyS') || this.down.has('KeyD')
    );
  }

  /** Consume per-step edges and mouse deltas. Call exactly once per fixed step. */
  endStep(): void {
    this.pressedThisStep.clear();
    this.mouseDx = 0;
    this.mouseDy = 0;
  }
}
