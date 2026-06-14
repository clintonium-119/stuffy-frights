import * as THREE from 'three';
import { config } from '../core/config';
import { solveGaze, solveFootLift, bodyPitchFromFeet } from './articulation';

export type Mood = 'calm' | 'menacing';

/**
 * Pure mood resolution — menacing inside the threat radius or while
 * chasing, with a hold time so the face doesn't flicker at the boundary.
 * Returns the next mood and the updated hold timer.
 */
export function resolveMood(
  distance: number,
  isChasing: boolean,
  prevMood: Mood,
  heldFor: number,
  dt: number
): { mood: Mood; heldFor: number } {
  const wantMenacing = isChasing || distance <= config.enemy.threatRadius;
  const want: Mood = wantMenacing ? 'menacing' : 'calm';
  if (want === prevMood) return { mood: prevMood, heldFor: heldFor + dt };
  if (heldFor < config.enemy.expressionHold) return { mood: prevMood, heldFor: heldFor + dt };
  return { mood: want, heldFor: 0 };
}


/**
 * Shared enemy chassis: owns the model group, face mood swapping with a
 * scale-pop twitch, straight-line movement toward an AI-set target with
 * facing, gait animation hook, and the contact-catch event.
 *
 * One-way dependency: the AI drives this class; this class never imports AI.
 */
export abstract class EnemyBase {
  readonly id: string;
  readonly group = new THREE.Group();
  /** Feet position (group position). */
  get position(): THREE.Vector3 {
    return this.group.position;
  }
  isChasing = false;
  /** Current movement speed (m/s), set with the target. */
  speed = 0;
  /** AI floor tracking. */
  floorIndex = 0;
  mood: Mood = 'calm';
  onCatch: (() => void) | null = null;
  /** Audio hook: gait beats (footfall/hop/giggle) with intensity. */
  onGaitBeat: ((kind: string) => void) | null = null;
  /** Suppresses catching during jumpscare/game-over. */
  catchEnabled = true;
  /**
   * Injected floor-height sampler (world Y under x,z on a floor). When set,
   * legged stuffies place their feet on stairs/slopes. AI/world → body only.
   */
  floorHeightAt: ((x: number, z: number, floorIndex: number) => number) | null = null;

  private lookTarget: THREE.Vector3 | null = null;
  private lookIntensity = 0;
  private aiSetMenacing: ((on: boolean) => void) | null = null;
  private aiHead: { obj: THREE.Object3D; maxYaw: number; maxPitch: number } | null = null;
  private aiLegs: THREE.Object3D[] | null = null;
  private aiArms: THREE.Object3D[] | null = null;
  private static readonly _tmp = new THREE.Vector3();

  private bodyPromise: Promise<void> | null = null;
  private heldFor = 0;
  private twitch = 0;
  private moveTarget: THREE.Vector3 | null = null;
  private gaitT = 0;
  private baseScale = new THREE.Vector3(1, 1, 1);

  constructor(id: string) {
    this.id = id;
  }

  /** Call once after construction. Builds the AI mesh body (async, browser). */
  init(): void {
    this.baseScale.copy(this.group.scale);
    void this.useAiMesh();
  }

  setMoveTarget(target: THREE.Vector3 | null, speed = 0): void {
    this.moveTarget = target ? target.clone() : null;
    this.speed = speed;
  }

  /**
   * AI/player → body push: where the stuffy should look + how strongly (0..1).
   * Drives the procedural head-turn gaze (incl. looking down at a low/crouched
   * player). The body never reads AI; the AI calls this.
   */
  setLookContext(target: THREE.Vector3 | null, intensity: number): void {
    this.lookTarget = target ? target.clone() : null;
    this.lookIntensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Build + mount the AI-generated textured + rigged mesh body (browser-only;
   * loaded async, sized from ENEMY_HEIGHT). Idempotent — init calls it; extra
   * calls are no-ops. Routes the articulation onto the rig bones (gaze head,
   * stair/walk legs, arm-walk) and the menacing red-flush onto the body.
   */
  useAiMesh(): Promise<void> {
    if (!this.bodyPromise) this.bodyPromise = this.buildAiBody();
    return this.bodyPromise;
  }

  private async buildAiBody(): Promise<void> {
    const { buildMeshBody } = await import('./MeshBody');
    const body = await buildMeshBody(this.id);
    if (!body) return;
    this.group.add(body.group);
    body.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
    this.aiSetMenacing = body.setMenacing;
    this.aiSetMenacing(this.mood === 'menacing');
    if (body.bones.head) this.aiHead = { obj: body.bones.head, maxYaw: 0.7, maxPitch: 0.7 };
    const legs = ['legFL', 'legFR', 'legHL', 'legHR'].map((n) => body.bones[n]).filter(Boolean);
    if (legs.length) this.aiLegs = legs;
    const arms = ['armL', 'armR'].map((n) => body.bones[n]).filter(Boolean);
    if (arms.length >= 2) this.aiArms = arms;
  }

  /** Rig-bone head-turn gaze + stair foot placement, eased per step. */
  private updateArticulation(dt: number): void {
    const k = Math.min(1, 8 * dt);
    const head = this.aiHead;
    if (head) {
      let yaw = 0;
      let pitch = 0;
      if (this.lookTarget && this.lookIntensity > 0) {
        const w = head.obj.getWorldPosition(EnemyBase._tmp);
        const g = solveGaze({
          headX: w.x,
          headY: w.y,
          headZ: w.z,
          targetX: this.lookTarget.x,
          targetY: this.lookTarget.y,
          targetZ: this.lookTarget.z,
          bodyYaw: this.group.rotation.y,
          maxYaw: head.maxYaw,
          maxPitch: head.maxPitch,
        });
        yaw = g.yaw * this.lookIntensity;
        pitch = g.pitch * this.lookIntensity;
      }
      head.obj.rotation.y += (yaw - head.obj.rotation.y) * k;
      head.obj.rotation.x += (pitch - head.obj.rotation.x) * k;
    }

    const legs = this.aiLegs;
    // AI rig walk: swing the leg bones in diagonal pairs while moving.
    if (this.aiLegs && this.aiLegs.length >= 4 && this.isMoving) {
      const phase = this.gaitT * 2.6;
      const sw = 0.45;
      this.aiLegs[0].rotation.x = Math.sin(phase) * sw;
      this.aiLegs[3].rotation.x = Math.sin(phase) * sw;
      this.aiLegs[1].rotation.x = Math.sin(phase + Math.PI) * sw;
      this.aiLegs[2].rotation.x = Math.sin(phase + Math.PI) * sw;
    }
    // AI rig arm-walk (e.g. the gorilla): the long arms swing fore/aft in
    // opposition as he hauls himself along, easing back to rest when stopped.
    // Only rotation.x is touched, so the splay baked into rotation.z is kept.
    if (this.aiArms && this.aiArms.length >= 2) {
      // Arms extend sideways (along X), so fore/aft hauling is a yaw (Y) swing.
      if (this.isMoving) {
        const sw = Math.sin(this.gaitT * 2.6) * 0.5;
        this.aiArms[0].rotation.y = sw;
        this.aiArms[1].rotation.y = -sw;
      } else {
        this.aiArms[0].rotation.y += (0 - this.aiArms[0].rotation.y) * k;
        this.aiArms[1].rotation.y += (0 - this.aiArms[1].rotation.y) * k;
      }
    }
    if (legs && this.floorHeightAt) {
      const bodyGround = this.floorHeightAt(this.position.x, this.position.z, this.floorIndex);
      let frontLift = 0;
      let frontN = 0;
      let backLift = 0;
      let backN = 0;
      for (const leg of legs) {
        const w = leg.getWorldPosition(EnemyBase._tmp);
        const ground = this.floorHeightAt(w.x, w.z, this.floorIndex);
        const lift = solveFootLift({ groundUnderFoot: ground, groundUnderBody: bodyGround, maxLift: 0.4 });
        const data = leg.userData as { baseY?: number };
        if (data.baseY === undefined) data.baseY = leg.position.y;
        leg.position.y += (data.baseY + lift - leg.position.y) * k;
        // Front/back foot lift drives the body pitch on slopes (+Z is front).
        if (leg.position.z > 0.05) {
          frontLift += lift;
          frontN++;
        } else if (leg.position.z < -0.05) {
          backLift += lift;
          backN++;
        }
      }
      // Tip the whole body with the stairs (nose-up ascending, nose-down
      // descending) — pitch is the X axis, independent of the facing yaw.
      if (frontN > 0 && backN > 0) {
        const pitch = bodyPitchFromFeet(frontLift / frontN, backLift / backN, 0.6);
        const target = Math.max(-0.16, Math.min(0.16, -pitch));
        this.group.rotation.x += (target - this.group.rotation.x) * k;
      }
    }
  }

  get isMoving(): boolean {
    return this.moveTarget !== null && this.speed > 0;
  }

  /** Per fixed step. playerPos drives mood + catch. */
  update(dt: number, playerPos: THREE.Vector3, playerCatchable: boolean): void {
    // Movement toward the AI's target (waypoints come from the AI layer).
    // Drop a degenerate target rather than propagate NaN into the position.
    if (this.moveTarget && !isVecFinite(this.moveTarget)) {
      this.moveTarget = null;
    }
    if (this.moveTarget && isVecFinite(this.position)) {
      const to = this.moveTarget.clone().sub(this.position);
      const dy3 = to.y;
      to.y = 0;
      const dist = to.length();
      if (dist > 0.05 || Math.abs(dy3) > 0.1) {
        const step = Math.min(dist, this.speed * dt);
        if (dist > 1e-6) {
          to.normalize();
          this.position.addScaledVector(to, step);
          // Face movement direction (lerped).
          const targetYaw = Math.atan2(-to.x, -to.z) + Math.PI;
          const dyaw = wrapAngle(targetYaw - this.group.rotation.y);
          this.group.rotation.y += dyaw * Math.min(1, 8 * dt);
        }
        // Vertical follow: climb stairs at a bounded rate; drops are fast.
        const climbRate = dy3 < 0 ? 9 : 3.2;
        const vStep = Math.sign(dy3) * Math.min(Math.abs(dy3), climbRate * dt);
        this.position.y += vStep;
        this.gaitT += step;
      } else {
        this.moveTarget = null;
      }
    }

    this.updateArticulation(dt);

    // Mood from distance/chase.
    const distance = this.position.distanceTo(playerPos);
    const prev = this.mood;
    const res = resolveMood(distance, this.isChasing, this.mood, this.heldFor, dt);
    this.mood = res.mood;
    this.heldFor = res.heldFor;
    if (this.mood !== prev) {
      this.twitch = 0.12; // a scale-pop on the body when the mood flips
      this.aiSetMenacing?.(this.mood === 'menacing'); // red-flush the AI body
    }
    if (this.twitch > 0) {
      this.twitch -= dt;
      const s = 1 + Math.sin((this.twitch / 0.12) * Math.PI) * 0.07;
      this.group.scale.set(this.baseScale.x * s, this.baseScale.y * s, this.baseScale.z * s);
    } else {
      this.group.scale.copy(this.baseScale);
    }

    // Catch on contact.
    if (
      this.catchEnabled &&
      playerCatchable &&
      distance <= config.enemy.contactRadius + 0.35 // + player radius
    ) {
      this.catchEnabled = false;
      this.onCatch?.();
    }
  }
}

function wrapAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function isVecFinite(v: THREE.Vector3): boolean {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}
