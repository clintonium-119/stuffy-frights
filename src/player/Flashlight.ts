import * as THREE from 'three';
import { config } from '../core/config';

/**
 * The player's flashlight: the game's only shadow-casting light. Beam
 * follows the camera with handheld lag; dims and flickers near-empty
 * (driven by the battery via setLevel/setFlickering).
 */
export class Flashlight {
  readonly light: THREE.SpotLight;
  on = false;
  /** Battery-driven output scale 0..1. */
  private level = 1;
  private flickering = false;
  private flickerPhase = 0;
  private flickerDrop = 1;
  private smoothedTarget = new THREE.Vector3();
  private initialized = false;

  constructor(scene: THREE.Scene) {
    const f = config.flashlight;
    this.light = new THREE.SpotLight(f.color, 0, f.range, f.angle, f.penumbra, 1.4);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(1024, 1024);
    this.light.shadow.camera.near = 0.15;
    this.light.shadow.camera.far = f.range;
    this.light.shadow.bias = -0.002;
    this.light.visible = false;
    scene.add(this.light);
    scene.add(this.light.target);
  }

  toggle(): void {
    this.setOn(!this.on);
  }

  setOn(on: boolean): void {
    this.on = on;
    this.light.visible = on && this.level > 0;
  }

  /** Battery fraction 0..1 — scales output, kills the light at 0. */
  setLevel(level: number): void {
    this.level = Math.max(0, Math.min(1, level));
    if (this.level <= 0 && this.on) this.setOn(false);
  }

  setFlickering(flickering: boolean): void {
    this.flickering = flickering;
  }

  get isOn(): boolean {
    return this.on && this.level > 0;
  }

  /** Per-frame: follow the camera with lag; apply dim/flicker. */
  update(dt: number, camera: THREE.PerspectiveCamera): void {
    const f = config.flashlight;
    this.light.position.copy(camera.position);
    // Slightly below the eye, like a handheld torch.
    this.light.position.y -= 0.12;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const idealTarget = camera.position.clone().add(forward.multiplyScalar(8));
    if (!this.initialized) {
      this.smoothedTarget.copy(idealTarget);
      this.initialized = true;
    }
    this.smoothedTarget.lerp(idealTarget, Math.min(1, f.swayLag * dt));
    this.light.target.position.copy(this.smoothedTarget);

    if (!this.isOn) {
      this.light.visible = false;
      return;
    }
    this.light.visible = true;

    // Output: dim with low battery; flicker AND gutter dimmer when warned —
    // a failing bulb, not just a blinking one.
    let out = f.intensity * (0.35 + 0.65 * this.level);
    if (this.flickering) {
      this.flickerPhase -= dt;
      if (this.flickerPhase <= 0) {
        this.flickerPhase = 0.05 + Math.random() * 0.3;
        this.flickerDrop = Math.random() < 0.4 ? 0.15 + Math.random() * 0.4 : 1;
      }
      // Sustained dim (0.55) so the dying light trends darker, plus the random
      // flicker drop on top.
      out *= 0.55 * this.flickerDrop;
    }
    this.light.intensity = out;
  }
}
