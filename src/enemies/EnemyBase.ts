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
 * Plush-fabric canvas texture: speckled base with mottle patches and a
 * fuzz pass. Shared by every stuffy body.
 */
export function fabricTexture(
  base: string,
  mottle: string,
  fuzz: string,
  fuzzScale = 1,
  mottlePatches = 0
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Large mottle patches (e.g. Fuggie's purple blotches).
  ctx.fillStyle = mottle;
  for (let i = 0; i < mottlePatches; i++) {
    ctx.globalAlpha = 0.5 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * size,
      Math.random() * size,
      14 + Math.random() * 30,
      10 + Math.random() * 24,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Fuzz: thousands of tiny strokes.
  ctx.strokeStyle = fuzz;
  ctx.lineWidth = 1;
  const n = Math.round(2600 * fuzzScale);
  for (let i = 0; i < n; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI * 2;
    const len = 2 + Math.random() * 3 * fuzzScale;
    ctx.globalAlpha = 0.12 + Math.random() * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Render a character's two face textures from its painter. */
function bakeFaces(
  drawFace: (ctx: CanvasRenderingContext2D, size: number, mood: Mood) => void
): Record<Mood, THREE.CanvasTexture> {
  const out = {} as Record<Mood, THREE.CanvasTexture>;
  for (const mood of ['calm', 'menacing'] as Mood[]) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    drawFace(ctx, 256, mood);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    out[mood] = tex;
  }
  return out;
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
  private static readonly _tmp = new THREE.Vector3();

  protected facePlane: THREE.Mesh | null = null;
  private faces: Record<Mood, THREE.CanvasTexture> | null = null;
  private heldFor = 0;
  private twitch = 0;
  private moveTarget: THREE.Vector3 | null = null;
  private gaitT = 0;
  private baseScale = new THREE.Vector3(1, 1, 1);

  constructor(id: string) {
    this.id = id;
  }

  /** Subclasses build the body and return the face plane to manage. */
  protected abstract buildBody(): THREE.Mesh;
  /** Subclasses paint their two expressions. */
  abstract drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void;
  /** Subclasses animate their locomotion. t advances with distance moved. */
  protected abstract animateGait(t: number, speed: number, dt: number): void;

  /** Call once after construction (subclass constructors finish first). */
  init(): void {
    this.facePlane = this.buildBody();
    this.facePlane.name = 'face';
    this.faces = bakeFaces((ctx, size, mood) => this.drawFace(ctx, size, mood));
    const mat = this.facePlane.material as THREE.MeshStandardMaterial;
    mat.map = this.faces.calm;
    mat.transparent = true;
    this.baseScale.copy(this.group.scale);
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
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

  /** Subclasses expose their gaze head group + clamp cones (radians). */
  protected getHead(): { obj: THREE.Object3D; maxYaw: number; maxPitch: number } | null {
    return null;
  }

  /** Subclasses expose hip-pivoted leg groups for stair foot placement. */
  protected getLegs(): THREE.Object3D[] | null {
    return null;
  }

  /** Procedural head-turn gaze + stair foot placement, eased per step. */
  private updateArticulation(dt: number): void {
    const k = Math.min(1, 8 * dt);
    const head = this.getHead();
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

    const legs = this.getLegs();
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

    this.animateGait(this.gaitT, this.isMoving ? this.speed : 0, dt);
    this.updateArticulation(dt);

    // Mood from distance/chase.
    const distance = this.position.distanceTo(playerPos);
    const prev = this.mood;
    const res = resolveMood(distance, this.isChasing, this.mood, this.heldFor, dt);
    this.mood = res.mood;
    this.heldFor = res.heldFor;
    if (this.mood !== prev) {
      const mat = this.facePlane!.material as THREE.MeshStandardMaterial;
      mat.map = this.faces![this.mood];
      mat.needsUpdate = true;
      this.twitch = 0.12;
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
