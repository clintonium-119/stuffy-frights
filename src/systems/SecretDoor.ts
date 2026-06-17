import { ColliderSet } from '../core/Collision';
import { InteractionSystem } from '../player/Interaction';
import { House } from '../world/layoutTypes';
import { SecretDoorRender } from '../world/HouseBuilder';

/**
 * Secret doors: flush wall panels on `secret` edges that the player reveals by
 * searching the wall. One interact opens a panel for the rest of the run — it
 * drops the panel's collider, hides the flush mesh, and flips the underlying edge
 * to a passable doorway so nav and room flooding treat it as open. This is the
 * minimal traversal hook (so secret passages are reachable in the playtest), not
 * the full clue/keypad discovery loop.
 */
export interface SecretDoorState {
  id: string;
  revealed: boolean;
}

export class SecretDoorSystem {
  readonly doors: SecretDoorState[] = [];
  /** Fired when a panel is revealed (nav rebuild / audible scrape hook). */
  onReveal: ((door: SecretDoorState) => void) | null = null;

  constructor(
    private readonly house: House,
    renders: readonly SecretDoorRender[],
    private readonly colliders: ColliderSet,
    interactions: InteractionSystem
  ) {
    renders.forEach((render, i) => {
      const state: SecretDoorState = { id: `secret-${i}`, revealed: false };
      this.doors.push(state);
      interactions.add({
        position: render.center.clone(),
        radius: 1.8,
        label: () => (state.revealed ? '' : 'Search the wall'),
        enabled: () => !state.revealed,
        onInteract: () => this.reveal(render, state),
      });
    });
  }

  private reveal(render: SecretDoorRender, state: SecretDoorState): void {
    if (state.revealed) return;
    state.revealed = true;
    this.colliders.remove(render.collider);
    render.mesh.visible = false;
    // Flip the concealed edge(s) to a passable doorway so movement, sight, sound,
    // and room membership all treat the opening as a normal door from now on.
    for (const e of render.edges) {
      if (e.a.z === e.b.z) {
        this.house.edgesV[render.floor][e.a.z][Math.min(e.a.x, e.b.x)] = 'door';
      } else {
        this.house.edgesH[render.floor][Math.min(e.a.z, e.b.z)][e.a.x] = 'door';
      }
    }
    this.onReveal?.(state);
  }
}
