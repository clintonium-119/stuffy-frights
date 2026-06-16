import * as THREE from 'three';
import { config } from '../core/config';
import { Rng } from '../core/rng';
import { House, cellToWorld, floorY } from '../world/layoutTypes';
import { HidingSpot, HidingSystem } from '../systems/HidingSpot';
import { NavGraph, PathFollower } from './NavGraph';
import { PerceptionMemory, PlayerSnapshot, canSee, movementNoiseRadius } from './Perception';
import { AwarenessLevel, EnemyAttention, createAttention } from './EnemyAttention';
import { EnemyTuning } from '../enemies/tuningConfig';

/** What the brain needs from its body (EnemyBase satisfies this; tests stub it). */
export interface BrainBody {
  position: THREE.Vector3;
  group: { rotation: { y: number } };
  floorIndex: number;
  isChasing: boolean;
  setMoveTarget(target: THREE.Vector3 | null, speed?: number): void;
  /** Per-enemy tuning (optional so test stubs can omit it → neutral defaults). */
  tuning?: EnemyTuning;
}

export type BrainState =
  | 'patrol'
  | 'investigate'
  | 'chase'
  | 'searchHiding'
  | 'followPassage'
  | 'loseInterest';

/** One spot may be searched by one enemy at a time. */
const searchClaims = new Set<HidingSpot>();

/**
 * Within this horizontal distance (m) of a seen player, the chaser drives at
 * the player's real position instead of the path graph's cell-center waypoint —
 * the graph snaps to cell centers, which can leave a cornered player just
 * outside contact reach.
 */
const FINAL_APPROACH_RANGE = 3.0;

export interface BrainContext {
  house: House;
  nav: NavGraph;
  hiding: HidingSystem;
  rng: Rng;
  /** The brain found a hidden player: yank them out and catch. */
  onFoundHidden: (spot: HidingSpot, enemy: BrainBody) => void;
  /** A chase fully ran cold (mercy-pacing hook). */
  onChaseLost?: (enemy: BrainBody) => void;
}

/**
 * The hunting state machine.
 *
 *   patrol → investigate (noise) → chase (sight) → searchHiding/followPassage
 *   (witnessed concealment) → loseInterest → patrol
 *
 * Witnessed entries are certain; unwitnessed hides near a lost chase get a
 * probabilistic check where hiding with the light off pays off.
 */
export class EnemyBrain {
  state: BrainState = 'patrol';
  readonly memory = new PerceptionMemory();
  /** Consolidated perception/intention seam the renderer + later AI read. */
  private readonly _attention = createAttention();
  /** Previous sighting, for the velocity estimate fed into the attention struct. */
  private prevSeenPos: THREE.Vector3 | null = null;
  private prevSeenAt = -Infinity;
  /** Gaze linger after sight breaks: where it last looked + how long ago. */
  private lastSeenEye: THREE.Vector3 | null = null;
  private gazeLostFor = 0;
  /** Awareness integrator state: how long a rising stimulus has been held + last alert. */
  private stimulusHeldFor = 0;
  private lastAlertAt = -Infinity;
  /** Director pacing knobs. */
  passive = false; // grace period / mercy window
  speedFactor = 1;
  homeFloor: number;

  private follower = new PathFollower();
  private stateTimer = 0;
  private repathTimer = 0;
  /** Active-lunge time remaining (s) and time until the next lunge is allowed. */
  private lungeTimer = 0;
  private lungeCooldown = 0;
  private now = 0;
  private searchTarget: HidingSpot | null = null;
  private searchResolved = false;
  private passageExit: THREE.Vector3 | null = null;
  /** Set by Director when displacing a camper. */
  forcedDestination: THREE.Vector3 | null = null;
  /** Latched once per cross-floor flight: whether to follow up/down the stairs. */
  private crossFloorDecision: 'undecided' | 'pursue' | 'giveup' = 'undecided';

  constructor(
    readonly enemy: BrainBody,
    private ctx: BrainContext,
    homeFloor: number
  ) {
    this.homeFloor = homeFloor;
  }

  /** Read-only view of the consolidated perception/intention state. */
  get attention(): Readonly<EnemyAttention> {
    return this._attention;
  }

  /** Restore to a fresh-run patrol state (Director.restart drives this). */
  reset(): void {
    if (this.searchTarget) {
      searchClaims.delete(this.searchTarget);
      this.searchTarget = null;
    }
    this.state = 'patrol';
    this.memory.clear();
    this.passive = false;
    this.speedFactor = 1;
    this.follower.clear();
    this.stateTimer = 0;
    this.repathTimer = 0;
    this.lungeTimer = 0;
    this.lungeCooldown = 0;
    this.now = 0;
    this.searchResolved = false;
    this.passageExit = null;
    this.forcedDestination = null;
    this.crossFloorDecision = 'undecided';
    this.enemy.isChasing = false;
    this.prevSeenPos = null;
    this.prevSeenAt = -Infinity;
    this.lastSeenEye = null;
    this.gazeLostFor = 0;
    this.stimulusHeldFor = 0;
    this.lastAlertAt = -Infinity;
    Object.assign(this._attention, createAttention());
  }

  /** Witness hooks — called by the world when concealment happens in view. */
  notePlayerEnteredHiding(at: THREE.Vector3, witnessed: boolean): void {
    if (witnessed) this.memory.sawEnterHidingAt = at.clone();
  }

  notePlayerEnteredPassage(at: THREE.Vector3, exit: THREE.Vector3, witnessed: boolean): void {
    if (witnessed) {
      this.memory.sawEnterPassageAt = at.clone();
      this.passageExit = exit.clone();
    }
  }

  hearNoise(pos: THREE.Vector3, radius: number): void {
    if (this.passive) return;
    const d = this.enemy.position.distanceTo(pos);
    if (d > radius * (this.enemy.tuning?.gameplay.hearingMult ?? 1)) return;
    if (this.state === 'patrol' || this.state === 'loseInterest') {
      this.memory.lastNoisePos = pos.clone();
      this.transition('investigate');
    } else if (this.state === 'investigate') {
      this.memory.lastNoisePos = pos.clone();
      this.pathTo(pos);
    }
  }

  private transition(next: BrainState): void {
    if (this.state === 'searchHiding' && this.searchTarget) {
      searchClaims.delete(this.searchTarget);
      this.searchTarget = null;
    }
    this.state = next;
    this.stateTimer = 0;
    this.follower.clear();
    this.enemy.isChasing = next === 'chase' || next === 'searchHiding' || next === 'followPassage';
  }

  private pathTo(worldPos: THREE.Vector3, allowPassages = false): boolean {
    const from = this.ctx.nav.nearestNode(this.enemy.position);
    const to = this.ctx.nav.nearestNode(worldPos);
    if (!from || !to) return false;
    const path = this.ctx.nav.findPath(from, to, { allowPassages });
    if (!path) return false;
    this.follower.setPath(this.ctx.nav.toWaypoints(path));
    return true;
  }

  private speed(base: number): number {
    return base * this.speedFactor * (this.enemy.tuning?.gameplay.speedMult ?? 1);
  }

  update(dt: number, player: PlayerSnapshot): void {
    this.now += dt;
    this.stateTimer += dt;
    this.repathTimer -= dt;
    if (this.lungeTimer > 0) this.lungeTimer -= dt;
    if (this.lungeCooldown > 0) this.lungeCooldown -= dt;

    const seen =
      !this.passive &&
      canSee(
        this.ctx.house,
        this.enemy.position,
        this.enemy.group.rotation.y,
        this.enemy.floorIndex,
        player,
        this.enemy.tuning?.gameplay.visionMult ?? 1
      );
    if (seen) this.memory.recordSeen(player.position, this.now);
    this.updateAttention(dt, seen, player);

    // Continuous movement noise.
    if (!this.passive && player.noiseLevel > 0 && player.floor === this.enemy.floorIndex) {
      const radius = movementNoiseRadius(player.noiseLevel);
      if (this.enemy.position.distanceTo(player.position) <= radius) {
        if (this.state === 'patrol' || this.state === 'loseInterest') {
          this.memory.lastNoisePos = player.position.clone();
          this.transition('investigate');
        }
      }
    }

    // Chase/investigate entry is gated on graduated awareness, not the raw
    // instant sight test — a clear sighting crosses alert in ~0.2s (a reaction
    // beat), hearing only reaches suspicious.
    const aware = this._attention.awareness;
    const alert = aware >= config.ai.awarenessAlert;
    const suspicious = aware >= config.ai.awarenessSuspicious;

    switch (this.state) {
      case 'patrol': {
        if (alert) {
          this.transition('chase');
          break;
        }
        if (suspicious) {
          this.transition('investigate');
          break;
        }
        if (this.forcedDestination) {
          this.pathTo(this.forcedDestination);
          this.forcedDestination = null;
        }
        if (this.follower.done) {
          const node = this.ctx.nav.randomNodeOnFloor(this.homeFloor, this.ctx.rng);
          if (node) {
            const w = cellToWorld(node.x, node.z);
            this.pathTo(new THREE.Vector3(w.x, floorY(node.floor), w.z));
          }
        }
        this.follower.drive(this.enemy, this.speed(config.ai.patrolSpeed));
        break;
      }

      case 'investigate': {
        if (alert) {
          this.transition('chase');
          break;
        }
        const target = this.memory.lastNoisePos ?? this.memory.lastSeenPos;
        if (target && this.follower.done && this.stateTimer < 0.1) this.pathTo(target);
        this.follower.drive(this.enemy, this.speed(config.ai.investigateSpeed));
        if (this.follower.done && this.stateTimer > config.ai.investigateLinger) {
          this.transition('loseInterest');
        }
        break;
      }

      case 'chase': {
        const toPlayer = Math.hypot(
          player.position.x - this.enemy.position.x,
          player.position.z - this.enemy.position.z
        );
        // A fresh sighting (always same-floor) re-arms the cross-floor decision.
        if (seen) this.crossFloorDecision = 'undecided';
        if (seen && toPlayer < FINAL_APPROACH_RANGE) {
          // Close the last gap directly so a cornered player can't sit just
          // beyond the cell-center waypoint and out of contact range.
          this.follower.clear();
          // Decisive pounce: inside lungeRange, commit a brief burst above
          // sprint speed (then cool down) so the kill actually lands instead of
          // the player jogging away at the edge of contact.
          if (this.lungeTimer <= 0 && this.lungeCooldown <= 0 && toPlayer < config.ai.lungeRange) {
            this.lungeTimer = config.ai.lungeDuration;
            this.lungeCooldown = config.ai.lungeCooldown;
          }
          const lungeSpeed = this.lungeTimer > 0 ? config.ai.lungeSpeed : config.ai.chaseSpeed;
          this.enemy.setMoveTarget(player.position, this.speed(lungeSpeed));
          break;
        }
        if (seen) {
          if (this.repathTimer <= 0) {
            this.pathTo(player.position);
            this.repathTimer = 0.4;
          }
        } else {
          // Lost sight. Witnessed concealment beats everything.
          if (this.memory.sawEnterHidingAt) {
            const spot = this.nearestSpot(this.memory.sawEnterHidingAt);
            if (spot && !searchClaims.has(spot)) {
              this.searchTarget = spot;
              this.searchResolved = false;
              searchClaims.add(spot);
              this.transition('searchHiding');
              this.pathTo(spot.position);
              break;
            }
          }
          if (this.memory.sawEnterPassageAt && this.passageExit) {
            this.transition('followPassage');
            this.pathTo(this.passageExit, true);
            break;
          }
          // The player fled to another floor. Decide once whether to commit to
          // the stairs (difficulty-scaled) or give up at the threshold.
          if (player.floor !== this.enemy.floorIndex) {
            if (this.crossFloorDecision === 'undecided') {
              this.crossFloorDecision = this.ctx.rng.chance(config.ai.crossFloorPursuit)
                ? 'pursue'
                : 'giveup';
            }
            if (this.crossFloorDecision === 'pursue') {
              if (this.repathTimer <= 0) {
                this.pathTo(player.position); // A* routes across the stair edges
                this.repathTimer = 0.5;
              }
              this.follower.drive(this.enemy, this.speed(config.ai.chaseSpeed));
              break; // stay committed in chase across the floor boundary
            }
            // giveup → fall through to the memory / lose-interest logic below
          }
          if (this.now - this.memory.lastSeenAt > config.ai.memorySeconds) {
            // Reached the trail's end. A hidden player nearby gets a
            // probabilistic check (unwitnessed).
            if (player.hidden && this.ctx.hiding.active) {
              const spot = this.ctx.hiding.active;
              if (
                this.enemy.position.distanceTo(spot.position) < 6 &&
                !searchClaims.has(spot)
              ) {
                this.searchTarget = spot;
                this.searchResolved = false;
                searchClaims.add(spot);
                this.transition('searchHiding');
                this.pathTo(spot.position);
                break;
              }
            }
            this.memory.lastNoisePos = this.memory.lastSeenPos;
            this.ctx.onChaseLost?.(this.enemy);
            this.transition('investigate');
            if (this.memory.lastSeenPos) this.pathTo(this.memory.lastSeenPos);
            break;
          }
          // Recent memory: keep pressing the last seen position.
          if (this.repathTimer <= 0 && this.memory.lastSeenPos) {
            this.pathTo(this.memory.lastSeenPos);
            this.repathTimer = 0.4;
          }
        }
        this.follower.drive(this.enemy, this.speed(config.ai.chaseSpeed));
        break;
      }

      case 'searchHiding': {
        const spot = this.searchTarget;
        if (!spot) {
          this.transition('loseInterest');
          break;
        }
        this.follower.drive(this.enemy, this.speed(config.ai.investigateSpeed));
        // Within reach of the furniture (its own cell is nav-solid, so the
        // path ends a cell away — 2.2 m covers cell center to cell center).
        const arrived = this.enemy.position.distanceTo(spot.position) < 2.2;
        if (arrived && !this.searchResolved && this.stateTimer > 0.8) {
          this.searchResolved = true;
          const witnessed = this.memory.sawEnterHidingAt !== null;
          const occupied = spot.occupied;
          const p = witnessed
            ? 1
            : spot.enteredWithLightOff
              ? config.ai.searchProbLightOff
              : config.ai.searchProbLightOn;
          if (occupied && this.ctx.rng.chance(p)) {
            this.ctx.onFoundHidden(spot, this.enemy);
            this.memory.forgetWitnessed();
            this.transition('chase');
          } else {
            // Nothing (found or missed) — linger then move on.
            this.memory.forgetWitnessed();
            this.transition('loseInterest');
          }
        }
        break;
      }

      case 'followPassage': {
        this.follower.drive(this.enemy, this.speed(config.ai.investigateSpeed));
        if (alert) {
          this.memory.forgetWitnessed();
          this.transition('chase');
        } else if (this.follower.done) {
          this.memory.forgetWitnessed();
          this.memory.lastNoisePos = this.passageExit;
          this.transition('investigate');
        }
        break;
      }

      case 'loseInterest': {
        this.enemy.setMoveTarget(null);
        if (alert) {
          this.transition('chase');
        } else if (suspicious) {
          this.transition('investigate');
        } else if (this.stateTimer > config.ai.loseInterestSeconds) {
          this.transition('patrol');
        }
        break;
      }
    }
  }

  /**
   * Fold this tick's sight result into the consolidated attention struct.
   * Sight gates the head-gaze (eye contact while seen, a brief decaying linger
   * on the last-seen spot after), so the enemy never stares through walls.
   */
  private updateAttention(dt: number, seen: boolean, player: PlayerSnapshot): void {
    const a = this._attention;
    a.seen = seen;
    if (seen) {
      if (this.prevSeenPos) {
        const gap = this.now - this.prevSeenAt;
        if (gap > 1e-4) {
          a.lastSeenVel = player.position.clone().sub(this.prevSeenPos).divideScalar(gap);
        }
      }
      a.lastKnownPos = player.position.clone();
      a.lastSeenAt = this.now;
      this.prevSeenPos = player.position.clone();
      this.prevSeenAt = this.now;
      // Eye contact: track the player's eye point at full strength.
      this.lastSeenEye = (player.eyePosition ?? player.position).clone();
      this.gazeLostFor = 0;
      a.gazeTarget = this.lastSeenEye;
      a.gazeIntensity = 1;
    } else {
      // Lost sight: hold the last-seen eye point and fade out over the linger.
      this.gazeLostFor += dt;
      const intensity = gazeLingerIntensity(this.gazeLostFor, config.ai.gazeLingerSeconds);
      if (intensity > 0 && this.lastSeenEye) {
        a.gazeTarget = this.lastSeenEye;
        a.gazeIntensity = intensity;
      } else {
        a.gazeTarget = null;
        a.gazeIntensity = 0;
        this.lastSeenEye = null;
      }
    }

    // Graduated awareness pulse: dominance-select sight vs hearing, integrate
    // with a reaction-delayed bounded rise + a gradual decay, then ratchet so a
    // freshly-alert enemy can't drop straight back to oblivious.
    const sightStim = seen ? (player.lightOn ? 1 : config.ai.sightStimDarkFactor) : 0;
    const hearStim = this.hearingStimulus(player);
    const drive = Math.max(sightStim, hearStim);
    if (drive > a.awareness) this.stimulusHeldFor += dt;
    else this.stimulusHeldFor = 0;
    a.awareness = stepAwareness(
      a.awareness,
      drive,
      this.stimulusHeldFor,
      dt,
      config.ai.awarenessRiseDelay,
      config.ai.awarenessRiseRate,
      config.ai.awarenessDecayRate
    );
    if (a.awareness >= config.ai.awarenessAlert) this.lastAlertAt = this.now;
    if (this.now - this.lastAlertAt < config.ai.awarenessAlertRatchet) {
      a.awareness = Math.max(a.awareness, config.ai.awarenessSuspicious);
    }
    a.level = awarenessBand(a.awareness, config.ai.awarenessSuspicious, config.ai.awarenessAlert);
  }

  /** Per-tick hearing stimulus [0..hearingStimCap] from the player's movement noise. */
  private hearingStimulus(player: PlayerSnapshot): number {
    if (this.passive || player.noiseLevel <= 0 || player.floor !== this.enemy.floorIndex) return 0;
    const radius = movementNoiseRadius(player.noiseLevel) * (this.enemy.tuning?.gameplay.hearingMult ?? 1);
    if (radius <= 0) return 0;
    const dist = this.enemy.position.distanceTo(player.position);
    if (dist >= radius) return 0;
    return Math.min(config.ai.hearingStimCap, 1 - dist / radius);
  }

  private nearestSpot(at: THREE.Vector3): HidingSpot | null {
    let best: HidingSpot | null = null;
    let bestD = 4; // the witnessed entry must be near an actual spot
    for (const spot of this.ctx.hiding.all) {
      const d = spot.position.distanceTo(at);
      if (d < bestD) {
        bestD = d;
        best = spot;
      }
    }
    return best;
  }
}

/**
 * Gaze strength during the post-sight linger: a linear ramp from 1 down to 0
 * over `lingerSeconds`. `elapsed` is seconds since sight broke. Returns 0 once
 * the linger is spent (or immediately if linger is non-positive).
 */
export function gazeLingerIntensity(elapsed: number, lingerSeconds: number): number {
  if (lingerSeconds <= 0) return 0;
  return Math.max(0, 1 - elapsed / lingerSeconds);
}

/** Map an awareness value to its band given the suspicious / alert thresholds. */
export function awarenessBand(
  awareness: number,
  suspicious: number,
  alert: number
): AwarenessLevel {
  if (awareness >= alert) return 'alert';
  if (awareness >= suspicious) return 'suspicious';
  return 'unaware';
}

/**
 * One integration step of the awareness pulse. Toward a higher `drive` the
 * value rises at `riseRate`/s, but only once the stimulus has been held for
 * `riseDelay` seconds (the reaction beat) — never an instant snap. Toward a
 * lower drive it decays at `decayRate`/s down to the drive (0 when the stimulus
 * is gone). `heldFor` is seconds the rising stimulus has been continuously present.
 */
export function stepAwareness(
  current: number,
  drive: number,
  heldFor: number,
  dt: number,
  riseDelay: number,
  riseRate: number,
  decayRate: number
): number {
  if (drive > current) {
    if (heldFor < riseDelay) return current; // still within the reaction delay
    return Math.min(drive, current + riseRate * dt);
  }
  return Math.max(drive, current - decayRate * dt);
}

/** Test hook: clear cross-run claims. */
export function clearSearchClaims(): void {
  searchClaims.clear();
}
