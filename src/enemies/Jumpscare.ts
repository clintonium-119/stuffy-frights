import * as THREE from 'three';
import { config } from '../core/config';

export type JumpscarePhase = 'idle' | 'turning' | 'lunging' | 'blackout' | 'done';

/** What the jumpscare needs from an enemy (EnemyBase satisfies this). */
export interface JumpscareTarget {
  id: string;
  position: THREE.Vector3;
  group: THREE.Object3D;
  isChasing: boolean;
}

/**
 * The catch moment, kid-calibrated: input cuts, the camera snaps to the
 * catcher, the menacing face lunges to fill the view with a shake, then a
 * fast cut to black and a single gameOver event. No gore — startle only.
 * Total runtime ≈ turn + lunge + blackout beats from config (~1.4 s).
 */
export class Jumpscare {
  phase: JumpscarePhase = 'idle';
  /** The enemy that got the player (id reaches the game-over screen). */
  target: JumpscareTarget | null = null;
  onGameOver: ((enemyId: string) => void) | null = null;
  /** Audio sting hook, fired at lunge start. */
  onSting: (() => void) | null = null;
  /** Blackout fade 0..1 — main wires this to an overlay div. */
  onBlackout: ((alpha: number) => void) | null = null;

  private timer = 0;
  private emitted = false;
  private startQuat = new THREE.Quaternion();
  private targetQuat = new THREE.Quaternion();
  private lungeFrom = new THREE.Vector3();

  /** Returns false if a scare is already running (latched until reset). */
  trigger(target: JumpscareTarget, camera: THREE.PerspectiveCamera): boolean {
    if (this.phase !== 'idle') return false;
    this.phase = 'turning';
    this.timer = 0;
    this.target = target;
    this.emitted = false;
    target.isChasing = true; // force the menacing face

    // Snap-turn destination: look at the enemy's face height.
    this.startQuat.copy(camera.quaternion);
    const face = target.position.clone().add(new THREE.Vector3(0, 1.1, 0));
    const m = new THREE.Matrix4().lookAt(camera.position, face, new THREE.Vector3(0, 1, 0));
    this.targetQuat.setFromRotationMatrix(m);
    this.lungeFrom.copy(target.position);
    return true;
  }

  get running(): boolean {
    return this.phase !== 'idle' && this.phase !== 'done';
  }

  reset(): void {
    this.phase = 'idle';
    this.target = null;
    this.onBlackout?.(0);
  }

  update(dt: number, camera: THREE.PerspectiveCamera): void {
    if (!this.running || !this.target) return;
    const cfg = config.enemy;
    this.timer += dt;

    if (this.phase === 'turning') {
      const t = Math.min(1, this.timer / cfg.jumpscareTurn);
      camera.quaternion.slerpQuaternions(this.startQuat, this.targetQuat, t);
      if (t >= 1) {
        this.phase = 'lunging';
        this.timer = 0;
        this.onSting?.();
      }
    } else if (this.phase === 'lunging') {
      const t = Math.min(1, this.timer / cfg.jumpscareLunge);
      // The enemy face rushes the camera with an accelerating ease.
      const ease = t * t;
      const toCamera = camera.position
        .clone()
        .sub(this.lungeFrom)
        .multiplyScalar(ease * 0.82);
      toCamera.y = 0;
      this.target.position.copy(this.lungeFrom.clone().add(toCamera));
      // Shake.
      const shake = 0.035 * (0.3 + t);
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      if (t >= 1) {
        this.phase = 'blackout';
        this.timer = 0;
      }
    } else if (this.phase === 'blackout') {
      const t = Math.min(1, this.timer / cfg.jumpscareBlackout);
      this.onBlackout?.(t);
      if (t >= 1) {
        this.phase = 'done';
        if (!this.emitted) {
          this.emitted = true;
          this.onGameOver?.(this.target.id);
        }
      }
    }
  }
}
