import * as THREE from 'three';
import { config } from '../core/config';
import { ColliderSet, CylinderBody } from '../core/Collision';
import { Input } from '../core/Input';

export type MoveMode = 'standing' | 'crouched';

/**
 * First-person body: mouse look (yaw on body, pitch on camera), WASD with
 * sprint/crouch, cylinder collision against the world's ColliderSet.
 * Vertical position follows groundHeight (step-up/step-down — stairs work
 * without a physics engine).
 */
export class PlayerController {
  /** Feet position in world space. */
  readonly position = new THREE.Vector3(0, 0, 0);
  /** Yaw around Y (radians). Applied to move direction and camera. */
  yaw = 0;
  /** Pitch (radians), clamped. */
  pitch = 0;

  mode: MoveMode = 'standing';
  sprinting = false;
  /** Stamina 0..1 — sprinting drains it, not-sprinting regenerates it. */
  stamina = 1;
  /** Exhausted: sprint stays disabled until stamina recovers past the threshold. */
  staminaLocked = false;
  private staminaRegenTimer = 0;
  /** External systems (hiding, charging, map, jumpscare) freeze movement. */
  movementLocked = false;
  /** Map overlay locks look as well; charging leaves look free. */
  lookLocked = false;
  /** Forced-crouch volumes (vent tunnels) set this each step. */
  forceCrouch = false;
  /** 0 still, 1 crawl, 2 walk, 3 sprint — consumed by enemy hearing. */
  noiseLevel = 0;
  /** Which floor the player is on — maintained by world floor queries. */
  floorIndex = 1;

  private eyeHeight = config.player.eyeHeightStanding;
  private colliders: ColliderSet;
  private input: Input;
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera, input: Input, colliders: ColliderSet) {
    this.camera = camera;
    this.input = input;
    this.colliders = colliders;
  }

  setColliders(colliders: ColliderSet): void {
    this.colliders = colliders;
  }

  teleport(x: number, y: number, z: number, yaw = 0): void {
    this.position.set(x, y, z);
    this.yaw = yaw;
    this.pitch = 0;
  }

  get isCrouched(): boolean {
    return this.mode === 'crouched' || this.forceCrouch;
  }

  get currentSpeed(): number {
    const p = config.player;
    if (this.isCrouched) return p.crawlSpeed;
    return this.sprinting ? p.sprintSpeed : p.walkSpeed;
  }

  get bodyHeight(): number {
    return this.isCrouched ? config.player.eyeHeightCrouched + 0.15 : config.player.eyeHeightStanding + 0.2;
  }

  update(dt: number): void {
    const p = config.player;

    // Look
    if (!this.lookLocked && this.input.isPointerLocked) {
      this.yaw -= this.input.mouseDx * p.lookSensitivity;
      this.pitch -= this.input.mouseDy * p.lookSensitivity;
      const maxPitch = Math.PI / 2 - 0.05;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    }

    // Crouch toggle
    if (this.input.justPressed('KeyC')) {
      this.mode = this.mode === 'standing' ? 'crouched' : 'standing';
    }
    // Sprint is gated by stamina: held Shift only sprints while stamina lasts
    // and isn't locked out from a prior exhaustion.
    const wantSprint = this.input.isDown('ShiftLeft') || this.input.isDown('ShiftRight');
    const canSprint = !this.staminaLocked && this.stamina > 0 && !this.isCrouched;
    this.sprinting = wantSprint && canSprint;

    // Move
    let moveX = 0;
    let moveZ = 0;
    if (!this.movementLocked) {
      const f = (this.input.isDown('KeyW') ? 1 : 0) - (this.input.isDown('KeyS') ? 1 : 0);
      const s = (this.input.isDown('KeyD') ? 1 : 0) - (this.input.isDown('KeyA') ? 1 : 0);
      if (f !== 0 || s !== 0) {
        const len = Math.hypot(f, s);
        const speed = this.currentSpeed;
        const sin = Math.sin(this.yaw);
        const cos = Math.cos(this.yaw);
        // Forward is -Z in camera space rotated by yaw.
        moveX = ((s * cos - f * sin) / len) * speed * dt;
        moveZ = ((-f * cos - s * sin) / len) * speed * dt;
      }
    }

    const moving = moveX !== 0 || moveZ !== 0;
    this.noiseLevel = !moving ? 0 : this.isCrouched ? 1 : this.sprinting ? 3 : 2;

    // Stamina: drain while actually sprint-moving; otherwise regen after a delay.
    const st = config.player.stamina;
    if (this.sprinting && moving) {
      this.stamina = Math.max(0, this.stamina - dt / st.drainSeconds);
      this.staminaRegenTimer = st.regenDelay;
      if (this.stamina <= 0) {
        this.staminaLocked = true;
        this.sprinting = false;
      }
    } else {
      if (this.staminaRegenTimer > 0) this.staminaRegenTimer -= dt;
      else this.stamina = Math.min(1, this.stamina + dt / st.regenSeconds);
      if (this.staminaLocked && this.stamina >= st.recoverThreshold) this.staminaLocked = false;
    }

    const body: CylinderBody = {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      radius: p.radius,
      height: this.bodyHeight,
    };
    const resolved = this.colliders.moveBody(body, moveX, moveZ, p.stepUpHeight);
    this.position.x = resolved.x;
    this.position.z = resolved.z;
    this.position.y = this.colliders.groundHeight(
      resolved.x,
      resolved.z,
      p.radius,
      this.position.y,
      p.stepUpHeight
    );

    // Eye height + camera
    const targetEye = this.isCrouched ? p.eyeHeightCrouched : p.eyeHeightStanding;
    this.eyeHeight += (targetEye - this.eyeHeight) * Math.min(1, p.crouchLerpSpeed * dt);

    this.camera.position.set(this.position.x, this.position.y + this.eyeHeight, this.position.z);
    this.camera.quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
  }

  /** View direction on the horizontal plane (for interaction facing checks). */
  viewDir(): THREE.Vector3 {
    return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }
}
