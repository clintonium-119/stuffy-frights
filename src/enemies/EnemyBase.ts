import * as THREE from 'three';
import { config } from '../core/config';
import { Articulator, GaitStyle, ArticulatorBones } from './Articulator';
import { ENEMY_TUNING, DEFAULT_ANIM, EnemyAnimTuning } from './tuningConfig';

export type Mood = 'calm' | 'menacing';

/**
 * Body-level locomotion style per enemy id. 'hop' = bounce + squash-stretch
 * (Pou), 'shuffle' = short-limb waddle + bob (Fuggie), 'trot' = subtle bob while
 * the four legs swing (NewYama), 'haul' = subtle rock while the arms swing
 * (Charles). Limbed gaits also swing their rig bones.
 */
const GAIT: Record<string, GaitStyle> = {
  poo: 'hop',
  fuggie: 'shuffle',
  newYama: 'trot',
  charles: 'haul',
};

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
  /**
   * Contact-catch handler. Returns `false` if the catch was NOT accepted (e.g.
   * the game state can't transition to caught — another enemy already triggered
   * the jumpscare this frame), so the enemy keeps `catchEnabled` and can still
   * catch on a later frame. Returning truthy / void means the catch took.
   */
  onCatch: (() => boolean | void) | null = null;
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
  /** Shared procedural-articulation driver, built once the AI body mounts. */
  private articulator: Articulator | null = null;
  /**
   * Optional animation-tuning override (dev viewer injects an editable clone so
   * its sliders drive the live gait). Null → the shipped ENEMY_TUNING entry.
   * Set before the AI body finishes building.
   */
  animTuning: EnemyAnimTuning | null = null;

  /** Body-level locomotion style, by enemy id. Limbed ones also swing bones. */
  private gaitStyle: GaitStyle = 'trot';
  private bodyHeight = 1;
  private bodyPromise: Promise<void> | null = null;
  private heldFor = 0;
  private twitch = 0;
  private moveTarget: THREE.Vector3 | null = null;
  private gaitT = 0;
  private baseScale = new THREE.Vector3(1, 1, 1);

  constructor(id: string) {
    this.id = id;
    this.gaitStyle = GAIT[id] ?? 'trot';
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
    const { buildMeshBody, ENEMY_HEIGHT } = await import('./MeshBody');
    const body = await buildMeshBody(this.id);
    if (!body) return;
    this.bodyHeight = ENEMY_HEIGHT[this.id] ?? 1;
    // Wrap the sized body in an anim group the gait bobs/squashes — keeps the
    // logical position (this.group) and the sizing (body.group) untouched.
    const anim = new THREE.Group();
    anim.add(body.group);
    this.group.add(anim);
    body.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
    this.aiSetMenacing = body.setMenacing;
    this.aiSetMenacing(this.mood === 'menacing');
    const bones: ArticulatorBones = {};
    if (body.bones.head) bones.head = body.bones.head;
    const legs = ['legFL', 'legFR', 'legHL', 'legHR'].map((n) => body.bones[n]).filter(Boolean);
    if (legs.length) bones.legs = legs;
    const arms = ['armL', 'armR'].map((n) => body.bones[n]).filter(Boolean);
    if (arms.length >= 2) bones.arms = arms;
    const tuning = this.animTuning ?? ENEMY_TUNING[this.id]?.anim ?? DEFAULT_ANIM;
    this.articulator = new Articulator(
      bones,
      this.group,
      anim,
      this.gaitStyle,
      this.bodyHeight,
      tuning,
      (kind) => this.onGaitBeat?.(kind)
    );
  }

  /** Rig-bone head gaze, gait swing, stair foot placement + body bob/squash. */
  private updateArticulation(dt: number): void {
    this.articulator?.pose({
      dt,
      moving: this.isMoving,
      gaitT: this.gaitT,
      lookTarget: this.lookTarget,
      lookIntensity: this.lookIntensity,
      position: this.position,
      floorIndex: this.floorIndex,
      floorHeightAt: this.floorHeightAt,
    });
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

    // Catch on contact. Only consume catchEnabled when the catch is ACCEPTED —
    // if onCatch returns false (e.g. the game already entered the jumpscare from
    // another enemy this frame), keep catchEnabled so this enemy can still catch
    // later. Consuming it unconditionally permanently disabled the enemy, so it
    // could sit inside the player without ever catching.
    if (
      this.catchEnabled &&
      playerCatchable &&
      distance <= config.enemy.contactRadius + 0.35 // + player radius
    ) {
      const took = this.onCatch ? this.onCatch() : false;
      if (took !== false) this.catchEnabled = false;
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
