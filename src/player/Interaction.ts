/**
 * Generic interactable layer. World objects register with position, radius,
 * label, enabled predicate and handler; each fixed step the nearest valid
 * target within range and roughly in view becomes active; E activates it.
 * Decoupled from Three.js (plain vectors) so it unit-tests headless.
 */
export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export interface Interactable {
  position: Vec3Like;
  /** Activation range in meters. */
  radius: number;
  /** Prompt text, static or computed (e.g. "Plug in flashlight"). */
  label: string | (() => string);
  enabled(): boolean;
  onInteract(): void;
}

/** dot(viewDir, toTarget) must exceed this — roughly within ~60° of view. */
const VIEW_DOT_THRESHOLD = 0.5;

export class InteractionSystem {
  private items = new Set<Interactable>();
  private active: Interactable | null = null;
  /** Fired when the active target (or its label) changes; HUD subscribes. */
  onPromptChange: ((label: string | null) => void) | null = null;
  private lastPrompt: string | null = null;

  add(item: Interactable): void {
    this.items.add(item);
  }

  remove(item: Interactable): void {
    this.items.delete(item);
    if (this.active === item) this.active = null;
  }

  get activeTarget(): Interactable | null {
    return this.active;
  }

  /** Recompute the active target. Call once per fixed step. */
  update(playerPos: Vec3Like, viewDir: Vec3Like): void {
    let best: Interactable | null = null;
    let bestDist = Infinity;

    for (const item of this.items) {
      if (!item.enabled()) continue;
      const dx = item.position.x - playerPos.x;
      const dy = item.position.y - playerPos.y;
      const dz = item.position.z - playerPos.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > item.radius || dist >= bestDist) continue;

      if (dist > 1e-6) {
        const inv = 1 / Math.hypot(dx, dz) || 0;
        const dot = viewDir.x * dx * inv + viewDir.z * dz * inv;
        if (dot < VIEW_DOT_THRESHOLD) continue;
      }

      best = item;
      bestDist = dist;
    }

    this.active = best;
    const prompt = best ? (typeof best.label === 'function' ? best.label() : best.label) : null;
    if (prompt !== this.lastPrompt) {
      this.lastPrompt = prompt;
      this.onPromptChange?.(prompt);
    }
  }

  /** Activate the current target (call on E justPressed). Returns true if fired. */
  interact(): boolean {
    if (!this.active || !this.active.enabled()) return false;
    this.active.onInteract();
    return true;
  }
}
