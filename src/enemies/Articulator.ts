import * as THREE from 'three';
import { solveGaze, solveFootLift, bodyPitchFromFeet } from './articulation';

/**
 * Body-level locomotion style per enemy. 'hop' = bounce + squash-stretch (Pou),
 * 'shuffle' = short-limb waddle + bob (Fuggie), 'trot' = subtle bob while four
 * legs swing (NewYama), 'haul' = subtle rock while arms swing (Charles).
 */
export type GaitStyle = 'hop' | 'shuffle' | 'trot' | 'haul';

/** Rig bones the driver poses (any may be absent for a given creature). */
export interface ArticulatorBones {
  head?: THREE.Object3D | null;
  legs?: THREE.Object3D[] | null;
  arms?: THREE.Object3D[] | null;
}

/** Per-frame articulation context pushed in by the owner (EnemyBase / rig editor). */
export interface ArticulationFrame {
  dt: number;
  /** Whether the body is moving (drives gait swing vs. ease-to-rest). */
  moving: boolean;
  /** Accumulated gait phase (distance-driven); the swing reads off this. */
  gaitT: number;
  /** World look target + strength (0..1) for the head gaze; null = no gaze. */
  lookTarget: THREE.Vector3 | null;
  lookIntensity: number;
  /** Body centre + floor index for the per-foot ground sampler. */
  position: THREE.Vector3;
  floorIndex: number;
  /** Injected floor-height sampler (world Y under x,z). null = flat. */
  floorHeightAt: ((x: number, z: number, floorIndex: number) => number) | null;
}

/**
 * Shared procedural-articulation driver: given a creature's rig bones, its
 * body-anim wrapper, and a per-frame context, it poses the head gaze, swings the
 * legs/arms for the gait, places feet on slopes (tipping the body), and bobs /
 * squashes the body per gait style. Extracted from EnemyBase so the dev rig
 * editor can drive the same motion live while authoring rigs. The pure angle /
 * offset math stays in articulation.ts; this composes it onto Three.js bones.
 *
 * The constants here (swing amplitudes, gait rates, head cone, ease rates) are
 * the values the body previously inlined; they become per-enemy tunables later.
 */
export class Articulator {
  private static readonly HEAD_MAX_YAW = 0.7;
  private static readonly HEAD_MAX_PITCH = 0.7;
  private static readonly _tmp = new THREE.Vector3();

  constructor(
    private readonly bones: ArticulatorBones,
    /** Logical body root: yaw is read from rotation.y, slope pitch written to rotation.x. */
    private readonly bodyRoot: THREE.Object3D,
    /** Wrapper bobbed / squashed by the gait. */
    private readonly bodyAnim: THREE.Object3D,
    private readonly gaitStyle: GaitStyle,
    private readonly bodyHeight: number,
    private readonly onGaitBeat?: (kind: string) => void
  ) {}

  /** Pose all driven bones + the body for this frame. */
  pose(f: ArticulationFrame): void {
    const k = Math.min(1, 8 * f.dt);

    const head = this.bones.head;
    if (head) {
      let yaw = 0;
      let pitch = 0;
      if (f.lookTarget && f.lookIntensity > 0) {
        const w = head.getWorldPosition(Articulator._tmp);
        const g = solveGaze({
          headX: w.x,
          headY: w.y,
          headZ: w.z,
          targetX: f.lookTarget.x,
          targetY: f.lookTarget.y,
          targetZ: f.lookTarget.z,
          bodyYaw: this.bodyRoot.rotation.y,
          maxYaw: Articulator.HEAD_MAX_YAW,
          maxPitch: Articulator.HEAD_MAX_PITCH,
        });
        yaw = g.yaw * f.lookIntensity;
        pitch = g.pitch * f.lookIntensity;
      }
      head.rotation.y += (yaw - head.rotation.y) * k;
      head.rotation.x += (pitch - head.rotation.x) * k;
    }

    const legs = this.bones.legs;
    // AI rig walk: swing the leg bones fore/aft while moving — quadrupeds in
    // diagonal pairs (FL+HR / FR+HL), bipeds in simple alternation. Eased back
    // to rest when stopped.
    if (legs && legs.length >= 2) {
      const moving = f.moving;
      const phase = f.gaitT * 2.6;
      const sw = 0.45;
      const quad = legs.length >= 4;
      const target = (i: number): number => {
        if (!moving) return 0;
        const back = quad ? i === 1 || i === 2 : i % 2 === 1; // which legs lag a half-cycle
        return Math.sin(phase + (back ? Math.PI : 0)) * sw;
      };
      legs.forEach((leg, i) => {
        leg.rotation.x = moving ? target(i) : leg.rotation.x + (0 - leg.rotation.x) * k;
      });
    }

    // AI rig arm-walk (e.g. the gorilla): long arms swing fore/aft in opposition.
    // Arms extend sideways (X), so fore/aft hauling is a yaw (Y) swing; only
    // rotation.y is touched so any baked splay (rotation.z) is kept.
    const arms = this.bones.arms;
    if (arms && arms.length >= 2) {
      if (f.moving) {
        const sw = Math.sin(f.gaitT * 2.6) * 0.5;
        arms[0].rotation.y = sw;
        arms[1].rotation.y = -sw;
      } else {
        arms[0].rotation.y += (0 - arms[0].rotation.y) * k;
        arms[1].rotation.y += (0 - arms[1].rotation.y) * k;
      }
    }

    if (legs && f.floorHeightAt) {
      const bodyGround = f.floorHeightAt(f.position.x, f.position.z, f.floorIndex);
      let frontLift = 0;
      let frontN = 0;
      let backLift = 0;
      let backN = 0;
      for (const leg of legs) {
        const w = leg.getWorldPosition(Articulator._tmp);
        const ground = f.floorHeightAt(w.x, w.z, f.floorIndex);
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
        this.bodyRoot.rotation.x += (target - this.bodyRoot.rotation.x) * k;
      }
    }

    this.animateBody(f.dt, f.moving, f.gaitT);
  }

  /**
   * Body-level locomotion on the anim wrapper: hop bounces + squishes/stretches;
   * shuffle side-rocks + bobs; trot/haul get a subtle bob while their bones do
   * the work. Eased back to neutral when idle.
   */
  private animateBody(dt: number, moving: boolean, gaitT: number): void {
    const a = this.bodyAnim;
    const k = Math.min(1, 12 * dt);
    const h = this.bodyHeight;
    if (moving) {
      if (this.gaitStyle === 'hop') {
        const ph = gaitT * 3.2;
        const hop = Math.abs(Math.sin(ph)); // 0 at ground, 1 at apex
        a.position.y = hop * 0.18 * h;
        // squish down at the bottom, stretch up at the top (volume-preserving)
        const st = 1 + (hop - 0.5) * 0.28;
        a.scale.set(1 / Math.sqrt(st), st, 1 / Math.sqrt(st));
        a.rotation.z = 0;
        if (hop < 0.06 && dt > 0) this.onGaitBeat?.('fwump');
      } else if (this.gaitStyle === 'shuffle') {
        const ph = gaitT * 3.6;
        a.position.y = Math.abs(Math.sin(ph)) * 0.05 * h;
        a.rotation.z = Math.sin(ph) * 0.07; // short-limb side rock
        a.scale.set(1, 1, 1);
        if (Math.abs(Math.sin(ph)) < 0.06 && dt > 0) this.onGaitBeat?.('shuffle');
      } else {
        a.position.y = Math.abs(Math.sin(gaitT * 2.6)) * 0.03 * h;
        a.rotation.z = 0;
        a.scale.set(1, 1, 1);
      }
    } else {
      a.position.y += (0 - a.position.y) * k;
      a.rotation.z += (0 - a.rotation.z) * k;
      a.scale.x += (1 - a.scale.x) * k;
      a.scale.y += (1 - a.scale.y) * k;
      a.scale.z += (1 - a.scale.z) * k;
    }
  }
}
