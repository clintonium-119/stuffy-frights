import * as THREE from 'three';
import { config } from '../core/config';
import { Rng } from '../core/rng';
import { CELL_SIZE, House, cellToWorld, floorY } from '../world/layoutTypes';
import { HidingSpot, HidingSystem } from '../systems/HidingSpot';
import { NavGraph, NavNodeId, PathFollower } from './NavGraph';
import { PerceptionMemory, PlayerSnapshot, canSee, movementNoiseRadius } from './Perception';
import { AwarenessLevel, EnemyAttention, createAttention } from './EnemyAttention';
import { SoundResult, propagateSound } from './SoundPropagation';
import {
  PatrolCandidate,
  PatrolWeights,
  bestPatrolCandidate,
  overtakes,
  scorePatrolCandidate,
  selectPatrolTarget,
} from './PatrolUtility';
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
  /** Last pathed-hearing result for the player, cached between recomputes. */
  private lastHearing: SoundResult = { audible: false, intensity: 0, arrivalDir: null };
  /** Ticks since the hearing BFS last ran (throttle: recompute every N ticks). */
  private hearingAge = Infinity;
  /** Non-linear patrol: current target node + per-node last-visit times. */
  private patrolTarget: NavNodeId | null = null;
  private readonly visitTimes = new Map<string, number>();
  /** Hesitation think-pause (s) + double-take re-score countdown (s). */
  private pauseTimer = 0;
  private rescoreTimer = 0;
  /** Forced look (double-take / peek): a held gaze below the sight tier. */
  private forcedGaze: THREE.Vector3 | null = null;
  private forcedGazeTimer = 0;
  /** Expanding-search bookkeeping: spots already checked + how many cold-ends so far. */
  private readonly checkedSpots = new Set<HidingSpot>();
  private coldEnds = 0;
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
    this.lastHearing = { audible: false, intensity: 0, arrivalDir: null };
    this.hearingAge = Infinity;
    this.patrolTarget = null;
    this.visitTimes.clear();
    this.pauseTimer = 0;
    this.rescoreTimer = 0;
    this.forcedGaze = null;
    this.forcedGazeTimer = 0;
    this.checkedSpots.clear();
    this.coldEnds = 0;
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
    const snd = this.audibleAt(pos, radius * (this.enemy.tuning?.gameplay.hearingMult ?? 1));
    if (!snd.audible) return; // walls/closed doors can muffle a one-shot noise away
    this._attention.heardDir = snd.arrivalDir;
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
    this.rescoreTimer -= dt;
    if (this.lungeTimer > 0) this.lungeTimer -= dt;
    if (this.lungeCooldown > 0) this.lungeCooldown -= dt;
    if (this.pauseTimer > 0) this.pauseTimer -= dt;
    if (this.forcedGazeTimer > 0) this.forcedGazeTimer -= dt;

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

    // Continuous movement noise — occlusion-aware (uses the pathed result
    // computed for this tick in updateAttention).
    if (this.lastHearing.audible) {
      if (this.state === 'patrol' || this.state === 'loseInterest') {
        this.memory.lastNoisePos = player.position.clone();
        this.transition('investigate');
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
        // Hesitation: stand and "think" for the rest of a think-pause.
        if (this.pauseTimer > 0) {
          this.enemy.setMoveTarget(null, 0);
          break;
        }
        if (this.follower.done) {
          // Reached a waypoint: record the visit, maybe pause to think, then pick
          // the next target by utility (weighted-random over the top-N) so the
          // route never settles into a predictable loop.
          if (this.patrolTarget) this.visitTimes.set(nodeKey(this.patrolTarget), this.now);
          if (this.ctx.rng.chance(config.ai.patrolPauseChance)) {
            this.pauseTimer =
              config.ai.patrolPauseMin +
              this.ctx.rng.next() * (config.ai.patrolPauseMax - config.ai.patrolPauseMin);
            this.enemy.setMoveTarget(null, 0);
            break;
          }
          this.pickPatrolTarget();
        } else {
          this.maybeDoubleTake();
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
            // Cut off the escape: aim ahead of a fleeing player (speed-gated so
            // it never out-positions a still or slow target). Stays beatable —
            // chaseSpeed < playerSprint is unchanged.
            const aim = interceptPoint(
              player.position,
              this._attention.lastSeenVel,
              config.ai.interceptLead,
              config.ai.interceptMinSpeed
            );
            this.pathTo(aim);
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
            // Trail's end. Check plausible hiding spots near the last-known
            // position first, sweeping wider each time a check comes up empty.
            const lkp = this.memory.lastSeenPos ?? this._attention.lastKnownPos;
            const radius = config.ai.searchRadius + config.ai.searchRadiusGrowth * this.coldEnds;
            const spot = lkp ? this.nearestUncheckedSpot(lkp, radius) : null;
            if (spot) {
              this.searchTarget = spot;
              this.searchResolved = false;
              searchClaims.add(spot);
              this.coldEnds += 1;
              this.transition('searchHiding');
              this.beginPeek(spot.position); // cautious peek before committing
              this.pathTo(spot.position);
              break;
            }
            // Nothing to check: drift to the projected last-known position, but
            // stay on edge — re-arm the awareness ratchet so it doesn't snap back
            // to calm patrol (de-escalates search → suspicious → patrol).
            this.memory.lastNoisePos = this.memory.lastSeenPos;
            this.ctx.onChaseLost?.(this.enemy);
            this.lastAlertAt = this.now;
            this.transition('investigate');
            const guess = projectLkp(
              this._attention.lastKnownPos,
              this._attention.lastSeenVel,
              config.ai.lkpLeadSeconds
            );
            if (guess) this.pathTo(guess);
            break;
          }
          // Recent memory: press toward where the player was heading, not the
          // live position (no cheating) — the last-known point projected forward.
          if (this.repathTimer <= 0) {
            const guess = projectLkp(
              this._attention.lastKnownPos,
              this._attention.lastSeenVel,
              config.ai.lkpLeadSeconds
            );
            if (guess) {
              this.pathTo(guess);
              this.repathTimer = 0.4;
            }
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
        // Cautious peek: hold still and look at the spot before committing.
        if (this.pauseTimer > 0) {
          this.enemy.setMoveTarget(null, 0);
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
            // Nothing here — remember it's checked so the sweep widens elsewhere,
            // and stay on edge (ratchet) rather than relaxing straight away.
            this.checkedSpots.add(spot);
            this.lastAlertAt = this.now;
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
      // Re-acquired: forget the prior search sweep.
      this.checkedSpots.clear();
      this.coldEnds = 0;
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
    // The hearing BFS is too costly per-frame; recompute every N ticks and reuse
    // the cached result between (a sound's audibility changes slowly).
    this.hearingAge += 1;
    if (this.hearingAge >= config.ai.soundRecomputeTicks) {
      this.lastHearing = this.evaluateHearing(player);
      this.hearingAge = 0;
    }
    a.heardDir = this.lastHearing.audible ? this.lastHearing.arrivalDir : null;
    const hearStim = Math.min(config.ai.hearingStimCap, this.lastHearing.intensity);
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

    // Gaze priority: sight (set above, intensity > 0) wins; otherwise glance
    // toward a heard sound when alerted/suspicious; otherwise idly scan around.
    if (a.gazeIntensity <= 0) {
      const p = this.enemy.position;
      if (this.forcedGazeTimer > 0 && this.forcedGaze) {
        // A held look (double-take / peek) outranks ambient glance + idle scan.
        a.gazeTarget = this.forcedGaze;
        a.gazeIntensity = config.ai.glanceIntensity;
      } else if (a.heardDir && a.heardDir.lengthSq() > 1e-6 && a.level !== 'unaware') {
        a.gazeTarget = new THREE.Vector3(p.x + a.heardDir.x * 4, p.y + 1, p.z + a.heardDir.z * 4);
        a.gazeIntensity = config.ai.glanceIntensity;
      } else if (a.level === 'unaware') {
        // Idle look-around: sweep the head about the body facing.
        const yaw =
          this.enemy.group.rotation.y +
          headScanOffset(this.now, config.ai.headScanRate, config.ai.headScanArc);
        a.gazeTarget = new THREE.Vector3(p.x + Math.sin(yaw) * 4, p.y + 1, p.z + Math.cos(yaw) * 4);
        a.gazeIntensity = config.ai.headScanIntensity;
      }
    }
  }

  /**
   * Pathed audibility of the player's movement noise: the noise radius (scaled
   * by the per-enemy hearing multiplier) becomes the propagation budget, so a
   * wall between enemy and player attenuates or blocks the sound and the result
   * carries the direction it arrives from. Inaudible when silent / cross-floor.
   */
  private evaluateHearing(player: PlayerSnapshot): SoundResult {
    if (this.passive || player.noiseLevel <= 0 || player.floor !== this.enemy.floorIndex) {
      return { audible: false, intensity: 0, arrivalDir: null };
    }
    const radius = movementNoiseRadius(player.noiseLevel) * (this.enemy.tuning?.gameplay.hearingMult ?? 1);
    if (radius <= 0) return { audible: false, intensity: 0, arrivalDir: null };
    return propagateSound(this.ctx.nav, this.ctx.house, this.enemy.position, player.position, {
      maxCost: radius / CELL_SIZE,
      doorCost: config.ai.soundDoorCost,
    });
  }

  /** Pathed audibility of a one-shot noise at a world point (NoiseBus events). */
  private audibleAt(pos: THREE.Vector3, radiusMeters: number): SoundResult {
    return propagateSound(this.ctx.nav, this.ctx.house, this.enemy.position, pos, {
      maxCost: radiusMeters / CELL_SIZE,
      doorCost: config.ai.soundDoorCost,
    });
  }

  private patrolWeights(): PatrolWeights {
    return {
      recency: config.ai.patrolRecency,
      curiosity: config.ai.patrolCuriosity,
      jitter: config.ai.patrolJitter,
      recencyFull: config.ai.patrolRecencyFull,
      distanceRef: config.ai.patrolDistanceRef,
      topN: config.ai.patrolTopN,
    };
  }

  /** Pick the next patrol target by utility (weighted-random over the top-N). */
  private pickPatrolTarget(): void {
    const next = selectPatrolTarget(
      this.patrolCandidates(),
      this.enemy.position,
      this.now,
      this.patrolWeights(),
      this.ctx.rng
    );
    if (next) {
      this.patrolTarget = next.node;
      this.pathTo(next.world);
    }
  }

  /**
   * Change of mind: every `patrolRescoreSeconds`, re-score candidates; if some
   * node now clearly (but only marginally, by `patrolOvertakeMargin`) beats the
   * current target's un-jittered utility, abort, snap a glance to it, and repath
   * — a believable second-guess rather than robotic commitment.
   */
  private maybeDoubleTake(): void {
    if (this.rescoreTimer > 0 || !this.patrolTarget) return;
    this.rescoreTimer = config.ai.patrolRescoreSeconds;
    const w = this.patrolWeights();
    const cands = this.patrolCandidates();
    const best = bestPatrolCandidate(cands, this.enemy.position, this.now, w);
    if (!best || nodeKey(best.candidate.node) === nodeKey(this.patrolTarget)) return;
    const cur = cands.find((c) => nodeKey(c.node) === nodeKey(this.patrolTarget!));
    const curScore = cur ? scorePatrolCandidate(cur, this.enemy.position, this.now, w, 0) : -Infinity;
    if (overtakes(best.score, curScore, config.ai.patrolOvertakeMargin)) {
      this.patrolTarget = best.candidate.node;
      this.pathTo(best.candidate.world);
      this.forcedGaze = new THREE.Vector3(
        best.candidate.world.x,
        this.enemy.position.y + 1,
        best.candidate.world.z
      );
      this.forcedGazeTimer = config.ai.doubleTakeGazeTime;
    }
  }

  /** All walkable nodes on the home floor as scoring candidates with visit times. */
  private patrolCandidates(): PatrolCandidate[] {
    return this.ctx.nav.nodesOnFloor(this.homeFloor).map((n) => {
      const w = cellToWorld(n.x, n.z);
      return {
        node: n,
        world: new THREE.Vector3(w.x, floorY(n.floor), w.z),
        lastVisitAt: this.visitTimes.get(nodeKey(n)) ?? -Infinity,
      };
    });
  }

  /** Nearest hiding spot within `radius` of a point that this enemy hasn't yet
   *  checked this sweep and that no other enemy has claimed. */
  private nearestUncheckedSpot(at: THREE.Vector3, radius: number): HidingSpot | null {
    let best: HidingSpot | null = null;
    let bestD = radius;
    for (const spot of this.ctx.hiding.all) {
      if (this.checkedSpots.has(spot) || searchClaims.has(spot)) continue;
      const d = spot.position.distanceTo(at);
      if (d < bestD) {
        bestD = d;
        best = spot;
      }
    }
    return best;
  }

  /** Cautious peek: hold a glance toward a point and stand still briefly. */
  private beginPeek(at: THREE.Vector3): void {
    this.forcedGaze = new THREE.Vector3(at.x, this.enemy.position.y + 1, at.z);
    this.forcedGazeTimer = config.ai.peekHoldSeconds;
    this.pauseTimer = config.ai.peekHoldSeconds;
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

/**
 * Idle head-scan yaw offset (radians, relative to the body facing) at sim time
 * `t`: a smooth sine sweep within ±`arc` at angular speed `rate`. Decoupled
 * from locomotion — the body keeps walking while the head looks around.
 */
export function headScanOffset(t: number, rate: number, arc: number): number {
  return Math.sin(t * rate) * arc;
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

/** Stable per-node key for visit bookkeeping. */
function nodeKey(n: NavNodeId): string {
  return `${n.floor}:${n.x},${n.z}`;
}

/**
 * Project the last-known position one step along the last-seen velocity — where
 * a pursuer guesses the player went, rather than cheating toward the live
 * position. Returns the bare position when velocity is unknown, null when there
 * is no last-known position.
 */
export function projectLkp(
  pos: THREE.Vector3 | null,
  vel: THREE.Vector3 | null,
  lead: number
): THREE.Vector3 | null {
  if (!pos) return null;
  if (!vel) return pos.clone();
  return new THREE.Vector3(pos.x + vel.x * lead, pos.y, pos.z + vel.z * lead);
}

/**
 * A cutoff point ahead of a moving player, for intercepting an escape instead of
 * chasing the tail. Returns the player position unchanged when the tracked speed
 * is below `minSpeed` (no reliable heading) or `lead` is 0.
 */
export function interceptPoint(
  playerPos: THREE.Vector3,
  vel: THREE.Vector3 | null,
  lead: number,
  minSpeed: number
): THREE.Vector3 {
  if (!vel || lead <= 0) return playerPos.clone();
  const speed = Math.hypot(vel.x, vel.z);
  if (speed < minSpeed) return playerPos.clone();
  return new THREE.Vector3(playerPos.x + vel.x * lead, playerPos.y, playerPos.z + vel.z * lead);
}

/** Test hook: clear cross-run claims. */
export function clearSearchClaims(): void {
  searchClaims.clear();
}
