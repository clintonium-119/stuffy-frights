import * as THREE from 'three';
import { InteractionSystem } from '../player/Interaction';
import { CellPos } from '../world/layoutTypes';

/**
 * Wall-mounted charging stations. This step ships the physical shell +
 * interactable; the survival phase wires real charging behavior into
 * `onPlugIn`. The LED is an emissive beacon players learn to navigate by.
 */
export class ChargingStation {
  readonly cell: CellPos;
  readonly position: THREE.Vector3;
  readonly group: THREE.Group;
  private led: THREE.Mesh;
  /** Behavior injected by the charging system. */
  onPlugIn: (() => void) | null = null;
  /** Pulsing while charging. */
  charging = false;
  private pulse = 0;

  constructor(cell: CellPos, worldPos: THREE.Vector3, wallDir: THREE.Vector3) {
    this.cell = cell;
    this.position = worldPos.clone().add(new THREE.Vector3(0, 1.1, 0));
    this.group = new THREE.Group();

    const boxMat = new THREE.MeshStandardMaterial({ color: 0x3d4044, roughness: 0.5, metalness: 0.4 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.18), boxMat);
    body.castShadow = true;
    this.group.add(body);

    this.led = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 10, 8),
      new THREE.MeshStandardMaterial({
        color: 0x113311,
        emissive: 0x22ff44,
        emissiveIntensity: 2.2,
      })
    );
    this.led.position.set(0.12, 0.2, 0.1);
    this.group.add(this.led);

    // Dangling plug on a cable.
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), cableMat);
    cable.position.set(-0.1, -0.5, 0.06);
    this.group.add(cable);
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), boxMat);
    plug.position.set(-0.1, -0.8, 0.06);
    this.group.add(plug);

    // Mount against the nearest wall: offset back along wallDir. When no wall
    // is adjacent (open room), wallDir is zero — mount flush at the cell rather
    // than floating off into empty air on a default axis.
    const hasWall = wallDir.lengthSq() > 1e-6;
    const mount = hasWall ? worldPos.clone().add(wallDir.clone().multiplyScalar(0.78)) : worldPos.clone();
    this.group.position.set(mount.x, worldPos.y + 1.1, mount.z);
    if (hasWall) this.group.lookAt(worldPos.x, worldPos.y + 1.1, worldPos.z);
  }

  register(interactions: InteractionSystem): void {
    interactions.add({
      position: this.position,
      radius: 2.0,
      label: 'Plug in flashlight',
      enabled: () => true,
      onInteract: () => this.onPlugIn?.(),
    });
  }

  /** Per-frame LED pulse while charging. */
  updateVisual(dt: number): void {
    const mat = this.led.material as THREE.MeshStandardMaterial;
    if (this.charging) {
      this.pulse += dt * 5;
      mat.emissiveIntensity = 1.6 + Math.sin(this.pulse) * 1.2;
    } else {
      mat.emissiveIntensity = 2.2;
    }
  }
}
