import * as THREE from 'three';
import { InteractionSystem } from '../player/Interaction';
import { PlayerController } from '../player/PlayerController';
import { HidingKind, HidingSpotDef } from '../world/layoutTypes';

/**
 * Enterable concealment. Interact at the host furniture to slide inside
 * (movement locked, light forced off, low peek pose for under-bed);
 * E again steps back out. Records whether the flashlight was on at entry —
 * the AI's discovery probabilities key off it.
 */
export class HidingSpot {
  readonly kind: HidingKind;
  readonly position: THREE.Vector3;
  occupied = false;
  /** True when the player entered with the flashlight off. */
  enteredWithLightOff = true;
  /** Where the player stood before entering (restored on exit). */
  exitPos: THREE.Vector3 | null = null;

  constructor(def: HidingSpotDef, worldPos: THREE.Vector3) {
    this.kind = def.kind;
    this.position = worldPos;
  }
}

export class HidingSystem {
  private spots: HidingSpot[] = [];
  /** The spot the player is currently inside, if any. */
  active: HidingSpot | null = null;
  /** Hook: is the flashlight currently on? (wired in the survival phase) */
  isLightOn: () => boolean = () => false;
  /** Hook: force the flashlight off on entry. */
  forceLightOff: () => void = () => {};
  /** Event for AI: fired when the player enters a spot (witnessable moment). */
  onEnter: ((spot: HidingSpot) => void) | null = null;
  onExit: ((spot: HidingSpot) => void) | null = null;

  constructor(
    private player: PlayerController,
    interactions: InteractionSystem,
    defs: { def: HidingSpotDef; worldPos: THREE.Vector3 }[]
  ) {
    for (const { def, worldPos } of defs) {
      const spot = new HidingSpot(def, worldPos);
      this.spots.push(spot);
      interactions.add({
        position: worldPos,
        radius: 2.2,
        label: labelFor(def.kind),
        enabled: () => !spot.occupied && this.active === null,
        onInteract: () => this.enter(spot),
      });
    }
  }

  get all(): readonly HidingSpot[] {
    return this.spots;
  }

  private enter(spot: HidingSpot): void {
    if (this.active) return;
    spot.occupied = true;
    spot.enteredWithLightOff = !this.isLightOn();
    this.forceLightOff();
    this.active = spot;

    // Save the return point, then tuck the player into the furniture.
    spot.exitPos = this.player.position.clone();
    this.player.position.set(spot.position.x, spot.position.y, spot.position.z);
    this.player.movementLocked = true;
    this.player.forceCrouch = spot.kind === 'underBed' || spot.kind === 'cabinet';
    this.onEnter?.(spot);
  }

  /** Step out of the current spot. Returns true if an exit happened. */
  exit(): boolean {
    const spot = this.active;
    if (!spot) return false;
    if (spot.exitPos) this.player.position.copy(spot.exitPos);
    spot.occupied = false;
    this.active = null;
    this.player.movementLocked = false;
    this.player.forceCrouch = false;
    this.onExit?.(spot);
    return true;
  }
}

export function labelFor(kind: HidingKind): string {
  switch (kind) {
    case 'wardrobe':
      return 'Hide in the wardrobe';
    case 'underBed':
      return 'Hide under the bed';
    case 'cabinet':
      return 'Hide in the cabinet';
    case 'boxFort':
      return 'Hide between the boxes';
    case 'closet':
      return 'Hide in the closet';
  }
}
