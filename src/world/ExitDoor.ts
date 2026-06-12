import * as THREE from 'three';
import { InteractionSystem } from '../player/Interaction';
import { CELL_SIZE, ExitDef, House, cellToWorld, floorY } from './layoutTypes';

/**
 * The three main-floor exterior doors. Visually identical lock affordance —
 * nothing betrays which one the key opens. `tryOpen` behavior is injected
 * by the objectives system; until then the doors just rattle.
 */
export class ExitDoor {
  readonly def: ExitDef;
  readonly group: THREE.Group;
  readonly position: THREE.Vector3;
  /** Injected by objectives: returns 'locked' | 'wrongKey' | 'open'. */
  tryOpen: (() => 'locked' | 'wrongKey' | 'open') | null = null;
  private panel: THREE.Mesh;
  private opened = false;

  constructor(def: ExitDef, house: House) {
    this.def = def;
    this.group = new THREE.Group();

    const { x, z } = cellToWorld(def.pos.x, def.pos.z);
    const y0 = floorY(def.pos.floor);
    // Find the exterior wall side: the neighbor that is the boundary wall.
    let dx = 0;
    let dz = 0;
    if (def.pos.z + 1 >= house.depth - 1) dz = 1;
    else if (def.pos.z - 1 <= 0) dz = -1;
    else if (def.pos.x + 1 >= house.width - 1) dx = 1;
    else dx = -1;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2e2218, roughness: 0.8 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x49301c, roughness: 0.75 });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0x8a703a,
      roughness: 0.35,
      metalness: 0.7,
    });

    // Frame against the wall face.
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.18), frameMat);
    this.panel = new THREE.Mesh(new THREE.BoxGeometry(1.24, 2.3, 0.1), doorMat);
    this.panel.position.z = 0.02;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), brassMat);
    knob.position.set(0.45, -0.1, 0.12);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.04), brassMat);
    plate.position.set(0.45, -0.32, 0.08);
    this.panel.add(knob, plate);
    frame.add(this.panel);
    frame.castShadow = true;

    const wallOffset = CELL_SIZE / 2 - 0.05;
    frame.position.set(x + dx * wallOffset, y0 + 1.25, z + dz * wallOffset);
    if (dx !== 0) frame.rotation.y = dx > 0 ? -Math.PI / 2 : Math.PI / 2;
    else if (dz < 0) frame.rotation.y = Math.PI;
    this.group.add(frame);

    this.position = new THREE.Vector3(x, y0 + 1.0, z);
  }

  register(interactions: InteractionSystem): void {
    interactions.add({
      position: this.position,
      radius: 2.2,
      label: () => (this.opened ? '' : 'Try the door'),
      enabled: () => !this.opened,
      onInteract: () => {
        const result = this.tryOpen?.() ?? 'locked';
        if (result === 'open') this.swingOpen();
      },
    });
  }

  swingOpen(): void {
    this.opened = true;
    this.panel.rotation.y = -Math.PI * 0.55;
    this.panel.position.x -= 0.5;
  }
}

/**
 * The key-ring prop: shown at the chosen candidate location by the
 * objectives system. Faint emissive glint pulse so it reads in darkness
 * at close range.
 */
export class KeyProp {
  readonly group: THREE.Group;
  private glintMat: THREE.MeshStandardMaterial;
  private t = 0;

  constructor() {
    this.group = new THREE.Group();
    this.glintMat = new THREE.MeshStandardMaterial({
      color: 0xb09a4a,
      emissive: 0x665522,
      emissiveIntensity: 0.8,
      metalness: 0.85,
      roughness: 0.3,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 20), this.glintMat);
    ring.rotation.x = Math.PI / 2;
    this.group.add(ring);

    for (const [angle, len] of [
      [0.4, 0.16],
      [-0.5, 0.13],
    ] as const) {
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.02, len, 0.012), this.glintMat);
      shaft.position.set(Math.sin(angle) * 0.08, -len / 2, Math.cos(angle) * 0.02);
      shaft.rotation.z = angle * 0.3;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.012), this.glintMat);
      head.position.set(Math.sin(angle) * 0.08, -len - 0.01, Math.cos(angle) * 0.02);
      this.group.add(shaft, head);
    }
    this.group.visible = false;
  }

  showAt(pos: THREE.Vector3): void {
    this.group.position.copy(pos).add(new THREE.Vector3(0, 0.55, 0));
    this.group.visible = true;
  }

  hide(): void {
    this.group.visible = false;
  }

  /** Idle bob + glint pulse. */
  updateVisual(dt: number): void {
    if (!this.group.visible) return;
    this.t += dt;
    this.group.position.y += Math.sin(this.t * 2.2) * 0.0009;
    this.group.rotation.y += dt * 0.8;
    this.glintMat.emissiveIntensity = 0.6 + (Math.sin(this.t * 3.1) + 1) * 0.5;
  }
}
