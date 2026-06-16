import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  BrainBody,
  BrainContext,
  EnemyBrain,
  clearSearchClaims,
  gazeLingerIntensity,
  awarenessBand,
  stepAwareness,
  headScanOffset,
} from './EnemyBrain';
import { NavGraph } from './NavGraph';
import { canSee, movementNoiseRadius, PlayerSnapshot } from './Perception';
import { DEFAULT_ANIM, DEFAULT_GAMEPLAY, EnemyTuning } from '../enemies/tuningConfig';
import { house } from '../world/houseLayout';
import { PROP_PLACEMENTS } from '../world/Props';
import { HidingSystem } from '../systems/HidingSpot';
import { InteractionSystem } from '../player/Interaction';
import { PlayerController } from '../player/PlayerController';
import { ControlManager } from '../core/Controls';
import { ColliderSet } from '../core/Collision';
import { Rng } from '../core/rng';
import { config } from '../core/config';

const DT = 1 / 60;

function solidCells(): Set<string> {
  const solid = new Set<string>();
  PROP_PLACEMENTS.forEach((p) => {
    if (p.kind !== 'coatRack') solid.add(`${p.pos.floor}:${p.pos.x},${p.pos.z}`);
  });
  house.hidingSpots.forEach((h) => solid.add(`${h.pos.floor}:${h.pos.x},${h.pos.z}`));
  return solid;
}
const nav = new NavGraph(house, solidCells());

function stubBody(x: number, y: number, z: number): BrainBody {
  return {
    position: new THREE.Vector3(x, y, z),
    group: { rotation: { y: 0 } },
    floorIndex: Math.round(y / 3.5),
    isChasing: false,
    setMoveTarget(target, speed = 0) {
      // Teleport-style integration for tests: move a step toward target.
      if (!target) return;
      const to = target.clone().sub(this.position);
      const d = to.length();
      if (d > 1e-3) this.position.addScaledVector(to.normalize(), Math.min(d, speed * DT));
    },
  };
}

function snapshot(over: Partial<PlayerSnapshot> = {}): PlayerSnapshot {
  return {
    position: new THREE.Vector3(15, 3.5, 23),
    floor: 1,
    lightOn: false,
    crouched: false,
    noiseLevel: 0,
    hidden: false,
    ...over,
  };
}

function makeHiding() {
  const camera = new THREE.PerspectiveCamera();
  const player = new PlayerController(camera, new ControlManager(), new ColliderSet());
  const interactions = new InteractionSystem();
  const def = house.hidingSpots[4]; // main-floor living-room wardrobe (1:4,9)
  const worldPos = new THREE.Vector3(9, 3.5, 19);
  const hiding = new HidingSystem(player, interactions, [{ def, worldPos }]);
  return { hiding, player, interactions, worldPos };
}

// Awareness adds a short reaction beat before chase; pump ticks until the
// brain commits (or a cap), reflecting the graduated-awareness entry.
function pumpUntilChase(brain: EnemyBrain, snap: PlayerSnapshot, maxTicks = 40): void {
  for (let i = 0; i < maxTicks && brain.state !== 'chase'; i++) brain.update(DT, snap);
}

function brainWith(
  body: BrainBody,
  hiding: HidingSystem,
  rng: Rng,
  onFoundHidden: BrainContext['onFoundHidden'] = () => {}
) {
  const ctx: BrainContext = { house, nav, hiding, rng, onFoundHidden };
  return new EnemyBrain(body, ctx, body.floorIndex);
}

describe('perception', () => {
  it('same-floor requirement', () => {
    expect(
      canSee(house, new THREE.Vector3(15, 3.5, 23), 0, 1, snapshot({ floor: 0 }))
    ).toBe(false);
  });

  it('light on extends detection far beyond light off', () => {
    // Enemy in the foyer looking south at the player down the room.
    const enemyPos = new THREE.Vector3(15, 3.5, 19);
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 26) }); // 7 m away
    expect(canSee(house, enemyPos, 0, 1, { ...player, lightOn: true })).toBe(true);
    expect(canSee(house, enemyPos, 0, 1, { ...player, lightOn: false })).toBe(false);
    expect(config.ai.visionLightOff).toBeLessThan(config.ai.visionLightOn);
  });

  it('a per-enemy vision multiplier extends the sight range', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 19);
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 26) }); // 7 m, light off (range 5)
    expect(canSee(house, enemyPos, 0, 1, player)).toBe(false); // baseline: out of range
    expect(canSee(house, enemyPos, 0, 1, player, 2)).toBe(true); // 2× range → seen
  });

  it('crouching shrinks detection range', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 19);
    const at = (d: number) => snapshot({ position: new THREE.Vector3(15, 3.5, 19 + d) });
    const edge = config.ai.visionLightOff * 0.9;
    expect(canSee(house, enemyPos, 0, 1, at(edge))).toBe(true);
    expect(canSee(house, enemyPos, 0, 1, { ...at(edge), crouched: true })).toBe(false);
  });

  it('crouching behind cover shrinks detection further, but only while crouched', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 19);
    // Distance between the crouched-no-cover range and the crouched+cover range.
    const crouchRange = config.ai.visionLightOff * config.ai.visionCrouchFactor;
    const coverRange = crouchRange * config.ai.coverVisionFactor;
    const d = (crouchRange + coverRange) / 2; // inside crouch range, beyond cover range
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 19 + d), crouched: true });
    expect(canSee(house, enemyPos, 0, 1, { ...player, nearCover: false })).toBe(true);
    expect(canSee(house, enemyPos, 0, 1, { ...player, nearCover: true })).toBe(false);
    // Cover does nothing when standing.
    expect(canSee(house, enemyPos, 0, 1, { ...player, crouched: false, nearCover: true })).toBe(true);
  });

  it('outside the forward cone is unseen except at brush distance', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 23);
    // Player BEHIND the enemy (enemy faces +Z south at yaw 0): north of it.
    const behind = snapshot({ position: new THREE.Vector3(15, 3.5, 19.5) });
    expect(canSee(house, enemyPos, 0, 1, behind)).toBe(false);
    const brushing = snapshot({ position: new THREE.Vector3(15, 3.5, 21.6) });
    expect(canSee(house, enemyPos, 0, 1, brushing)).toBe(true); // proximity sense
  });

  it('walls block line of sight', () => {
    // Kitchen (2,2)≈(5,5) vs back hall (7,2)≈(15,5): wall col5 between.
    const enemyPos = new THREE.Vector3(5, 3.5, 5);
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 5), lightOn: true });
    expect(canSee(house, enemyPos, -Math.PI / 2, 1, player)).toBe(false);
  });

  it('a hidden player is never seen', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 21);
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true, hidden: true });
    expect(canSee(house, enemyPos, 0, 1, player)).toBe(false);
  });

  it('noise radii order: crouch < walk < sprint', () => {
    expect(movementNoiseRadius(1)).toBeLessThan(movementNoiseRadius(2));
    expect(movementNoiseRadius(2)).toBeLessThan(movementNoiseRadius(3));
  });
});

describe('EnemyBrain transitions', () => {
  beforeEach(() => clearSearchClaims());

  it('patrol → investigate on noise within radius', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer (a walkable nav cell)
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(15, 3.5, 22), 6); // ~3 m down an open path
    expect(brain.state).toBe('investigate');
  });

  it('noise beyond radius is ignored', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 13);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(40, 3.5, 14), 6);
    expect(brain.state).toBe('patrol');
  });

  it('a per-enemy hearing multiplier widens the heard radius', () => {
    const { hiding } = makeHiding();
    const tuning: EnemyTuning = { anim: DEFAULT_ANIM, height: 1, gameplay: { ...DEFAULT_GAMEPLAY, hearingMult: 2 } };
    // Noise down an open path beyond the 1× budget but inside the 2× budget.
    const far = new THREE.Vector3(15, 3.5, 27);
    const deaf = stubBody(15, 3.5, 19);
    expect(deaf.position.distanceTo(far)).toBeGreaterThan(6);
    const deafBrain = brainWith(deaf, hiding, new Rng(1));
    deafBrain.hearNoise(far, 6);
    expect(deafBrain.state).toBe('patrol'); // 1× can't hear that far
    const sharp = stubBody(15, 3.5, 19);
    sharp.tuning = tuning;
    const brain = brainWith(sharp, hiding, new Rng(1));
    brain.hearNoise(far, 6);
    expect(brain.state).toBe('investigate');
  });

  it('a per-enemy speed multiplier scales the drive speed', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const speeds: number[] = [];
    const base = body.setMoveTarget.bind(body);
    body.setMoveTarget = (t, s = 0) => {
      if (t) speeds.push(s);
      base(t, s);
    };
    body.tuning = { anim: DEFAULT_ANIM, height: 1, gameplay: { ...DEFAULT_GAMEPLAY, speedMult: 2 } };
    const brain = brainWith(body, hiding, new Rng(1));
    const seen = snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true });
    for (let i = 0; i < 40; i++) brain.update(DT, seen);
    expect(brain.state).toBe('chase');
    // Chase drives at chaseSpeed × 2 (≈9), well above the un-multiplied lunge cap.
    expect(Math.max(...speeds)).toBeGreaterThan(config.ai.lungeSpeed);
  });

  it('investigate → chase on sight; chase sets the menacing flag', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer, facing south (yaw 0)
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(15, 3.5, 22), 6);
    expect(brain.state).toBe('investigate');
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    expect(body.isChasing).toBe(true);
  });

  it('witnessed hide → searchHiding → guaranteed find', () => {
    const { hiding, player, interactions, worldPos } = makeHiding();
    const body = stubBody(9, 3.5, 21.5); // living room, near the wardrobe
    let found = 0;
    const brain = brainWith(body, hiding, new Rng(1), () => found++);
    // See the player first (chase), then they hide in view.
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(9, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact(); // hidden now
    brain.notePlayerEnteredHiding(worldPos, true);
    // Player is hidden → not seen → witnessed branch fires.
    const hiddenSnap = snapshot({ position: worldPos.clone(), hidden: true });
    for (let i = 0; i < 6 / DT && found === 0; i++) brain.update(DT, hiddenSnap);
    expect(found).toBe(1);
  });

  it('unwitnessed light-off hide usually survives; light-on usually does not', () => {
    expect(config.ai.searchProbLightOff).toBeLessThan(config.ai.searchProbLightOn);
    // Behavioral check with a forced-failure rng (chance() always false):
    const { hiding, player, interactions, worldPos } = makeHiding();
    const body = stubBody(9, 3.5, 21.5);
    let found = 0;
    const neverRng = new Rng(1);
    neverRng.chance = () => false;
    const brain = brainWith(body, hiding, neverRng, () => found++);
    brain.update(DT, snapshot({ position: new THREE.Vector3(9, 3.5, 23), lightOn: true }));
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact();
    // NOT witnessed — memory stays empty; chase runs cold near the spot.
    const hiddenSnap = snapshot({ position: worldPos.clone(), hidden: true });
    for (let i = 0; i < 8 / DT; i++) brain.update(DT, hiddenSnap);
    expect(found).toBe(0); // failed check → never found
    expect(['investigate', 'loseInterest', 'patrol']).toContain(brain.state);
  });

  it('unseen passage entry is never followed', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
    expect(brain.state).toBe('chase');
    brain.notePlayerEnteredPassage(
      new THREE.Vector3(11, 3.5, 11),
      new THREE.Vector3(13, 3.5, 11),
      false // unwitnessed
    );
    const goneSnap = snapshot({ position: new THREE.Vector3(40, 3.5, 40), floor: 0 });
    for (let i = 0; i < 6 / DT; i++) brain.update(DT, goneSnap);
    expect(brain.state).not.toBe('followPassage');
  });

  it('witnessed passage entry → followPassage', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
    brain.notePlayerEnteredPassage(
      new THREE.Vector3(11, 3.5, 11),
      new THREE.Vector3(13, 3.5, 11),
      true
    );
    const goneSnap = snapshot({ position: new THREE.Vector3(40, 3.5, 40), floor: 0 });
    brain.update(DT, goneSnap);
    expect(brain.state).toBe('followPassage');
  });

  it('chase runs cold → investigate → loseInterest → patrol', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    // Same floor but far + walled off: sight lost without the cross-floor gamble.
    const gone = snapshot({ position: new THREE.Vector3(5, 3.5, 5), floor: 1 });
    const seenStates = new Set<string>();
    for (let i = 0; i < 30 / DT; i++) {
      brain.update(DT, gone);
      seenStates.add(brain.state);
      if (brain.state === 'patrol') break;
    }
    expect(seenStates.has('investigate')).toBe(true);
    expect(brain.state).toBe('patrol');
  });

  it('closes the final gap on a seen player (cornered reach)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer, facing +Z
    const brain = brainWith(body, hiding, new Rng(1));
    // Player just ahead and slightly off cell-center — the kind of spot where
    // a path that stops at the cell center would leave a gap.
    const player = snapshot({ position: new THREE.Vector3(15.7, 3.5, 21.2), lightOn: true });
    pumpUntilChase(brain, player);
    expect(brain.state).toBe('chase');
    for (let i = 0; i < 2 / DT; i++) brain.update(DT, player);
    const gap = Math.hypot(
      player.position.x - body.position.x,
      player.position.z - body.position.z
    );
    expect(gap).toBeLessThan(config.enemy.contactRadius + 0.35); // within catch range
  });

  it('pounces with a burst above sprint speed when close to a seen player', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer, facing +Z
    const brain = brainWith(body, hiding, new Rng(1));
    // Player within lunge range and in view.
    const player = snapshot({ position: new THREE.Vector3(15, 3.5, 20.5), lightOn: true });
    pumpUntilChase(brain, player); // reaction beat → chase
    expect(brain.state).toBe('chase');
    const before = body.position.clone();
    brain.update(DT, player); // final approach within lungeRange → pounce burst
    const moved = Math.hypot(body.position.x - before.x, body.position.z - before.z);
    // A pounce step covers more ground than an ordinary chase step would.
    expect(moved).toBeGreaterThan(config.ai.chaseSpeed * DT + 1e-6);
    // And the pounce genuinely exceeds player sprint (you can't simply out-run it).
    expect(config.ai.lungeSpeed).toBeGreaterThan(config.player.sprintSpeed);
  });

  it('loses interest and returns to patrol soon after sight breaks (escape window)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    // Player gone (same floor, far + walled off, no noise). Should reach patrol
    // within the tuned window: memory + investigateLinger + loseInterest +
    // awareness decay through the alert ratchet (+ slack).
    const gone = snapshot({ position: new THREE.Vector3(5, 3.5, 5), floor: 1, noiseLevel: 0 });
    const window =
      config.ai.memorySeconds +
      config.ai.investigateLinger +
      config.ai.loseInterestSeconds +
      config.ai.awarenessAlertRatchet +
      1;
    let reached = -1;
    for (let i = 0; i < window / DT; i++) {
      brain.update(DT, gone);
      if (brain.state === 'patrol') {
        reached = i * DT;
        break;
      }
    }
    expect(reached).toBeGreaterThan(0);
    expect(reached).toBeLessThanOrEqual(window);
  });

  it('passive (grace/mercy) brains neither see nor hear', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.passive = true;
    brain.hearNoise(new THREE.Vector3(15, 3.5, 20), 10);
    expect(brain.state).toBe('patrol');
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
    expect(brain.state).toBe('patrol');
  });
});

describe('attention struct', () => {
  beforeEach(() => clearSearchClaims());

  it('reflects seen + last-known after a seen tick', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer, facing +Z
    const brain = brainWith(body, hiding, new Rng(1));
    const at = new THREE.Vector3(15, 3.5, 22);
    brain.update(DT, snapshot({ position: at, lightOn: true }));
    expect(brain.attention.seen).toBe(true);
    expect(brain.attention.lastKnownPos?.equals(at)).toBe(true);
    expect(brain.attention.lastSeenAt).toBeCloseTo(DT, 5);
  });

  it('estimates last-seen velocity across successive seen ticks', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22.1), lightOn: true }));
    const vel = brain.attention.lastSeenVel;
    expect(vel).not.toBeNull();
    // Moved +0.1 m in z over one DT → ~6 m/s along +z, ~0 elsewhere.
    expect(vel!.z).toBeGreaterThan(0);
    expect(Math.abs(vel!.x)).toBeLessThan(1e-6);
  });

  it('last-known persists after sight is lost', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    const at = new THREE.Vector3(15, 3.5, 22);
    brain.update(DT, snapshot({ position: at, lightOn: true }));
    brain.update(DT, snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 }));
    expect(brain.attention.seen).toBe(false);
    expect(brain.attention.lastKnownPos?.equals(at)).toBe(true);
  });
});

describe('gaze gating', () => {
  beforeEach(() => clearSearchClaims());

  it('linger intensity ramps linearly from 1 to 0 and clamps', () => {
    expect(gazeLingerIntensity(0, 0.8)).toBe(1);
    expect(gazeLingerIntensity(0.4, 0.8)).toBeCloseTo(0.5, 5);
    expect(gazeLingerIntensity(0.8, 0.8)).toBe(0);
    expect(gazeLingerIntensity(2, 0.8)).toBe(0); // past the linger → clamped
    expect(gazeLingerIntensity(0.1, 0)).toBe(0); // non-positive linger → released
  });

  it('gaze is full strength on the eye point while the player is seen', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    const eye = new THREE.Vector3(15, 4.6, 22);
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), eyePosition: eye, lightOn: true }));
    expect(brain.attention.gazeIntensity).toBe(1);
    expect(brain.attention.gazeTarget?.equals(eye)).toBe(true);
  });

  it('sight gaze decays monotonically while locked on the last-seen spot, then releases', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    const seen = snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true });
    brain.update(DT, seen);
    expect(brain.attention.gazeIntensity).toBe(1);
    const eye = seen.position; // no eyePosition → gaze targets position
    expect(brain.attention.gazeTarget?.equals(eye)).toBe(true);
    const gone = snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 });
    let prev = 1;
    let released = false;
    for (let i = 0; i < Math.ceil(config.ai.gazeLingerSeconds / DT) + 5; i++) {
      brain.update(DT, gone);
      const t = brain.attention.gazeTarget;
      if (t && t.equals(eye)) {
        expect(brain.attention.gazeIntensity).toBeLessThanOrEqual(prev + 1e-9); // never rises
        prev = brain.attention.gazeIntensity;
      } else {
        released = true; // sight lock dropped; head moved off the last-seen spot
        break;
      }
    }
    expect(released).toBe(true);
    expect(prev).toBeLessThan(1); // it decayed before releasing
  });

  it('after the sight linger an unaware enemy resumes idle looking-around', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    const seen = snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true });
    brain.update(DT, seen);
    const gone = snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 });
    for (let i = 0; i < Math.ceil(config.ai.gazeLingerSeconds / DT) + 5; i++) {
      brain.update(DT, gone);
    }
    // No longer sight-locked on the last-seen spot; head is idly scanning.
    expect(brain.attention.gazeTarget?.equals(seen.position)).toBe(false);
    expect(brain.attention.gazeIntensity).toBe(config.ai.headScanIntensity);
  });

  it('never sight-locks a player it has only heard (no line of sight)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(15, 3.5, 22), 6);
    expect(brain.state).toBe('investigate');
    // Player behind the enemy (it faces +Z) and far: heard, never in view.
    const heard = snapshot({ position: new THREE.Vector3(15, 3.5, 5) });
    brain.update(DT, heard);
    expect(brain.attention.seen).toBe(false);
    // It may glance/scan, but it never tracks the player at full sight strength.
    expect(brain.attention.gazeIntensity).toBeLessThan(1);
    expect(brain.attention.gazeTarget?.equals(heard.position)).not.toBe(true);
  });
});

describe('graduated awareness', () => {
  beforeEach(() => clearSearchClaims());

  it('awarenessBand maps value to the right band', () => {
    expect(awarenessBand(0.1, 0.4, 0.8)).toBe('unaware');
    expect(awarenessBand(0.5, 0.4, 0.8)).toBe('suspicious');
    expect(awarenessBand(0.9, 0.4, 0.8)).toBe('alert');
  });

  it('stepAwareness holds during the reaction delay, then rises at the capped rate', () => {
    // Held only 0.05s < 0.08s delay → no rise yet.
    expect(stepAwareness(0, 1, 0.05, DT, 0.08, 7, 1.2)).toBe(0);
    // Past the delay → rises by riseRate*dt.
    const risen = stepAwareness(0, 1, 0.1, DT, 0.08, 7, 1.2);
    expect(risen).toBeCloseTo(7 * DT, 5);
    // Never overshoots the drive.
    expect(stepAwareness(0.99, 1, 1, DT, 0.08, 7, 1.2)).toBe(1);
  });

  it('stepAwareness decays gradually toward the (lower) drive', () => {
    const decayed = stepAwareness(1, 0, 0, DT, 0.08, 7, 1.2);
    expect(decayed).toBeCloseTo(1 - 1.2 * DT, 5);
    expect(decayed).toBeLessThan(1);
    expect(stepAwareness(0.01, 0, 0, DT, 0.08, 7, 1.2)).toBe(0); // clamps at the drive
  });

  it('sight dominates: a clear sighting reaches alert (chase) after a brief beat', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    const seen = snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true });
    brain.update(DT, seen);
    expect(brain.attention.awareness).toBeLessThan(config.ai.awarenessAlert); // not instant
    pumpUntilChase(brain, seen);
    expect(brain.state).toBe('chase');
    expect(brain.attention.level).toBe('alert');
  });

  it('hearing alone never reaches alert (investigates, never chases)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    // Noisy but hidden (never seeable): isolates the hearing stimulus, which is
    // capped below the alert threshold, no matter how long it persists.
    const heard = snapshot({ position: new THREE.Vector3(15, 3.5, 16), noiseLevel: 3, hidden: true });
    for (let i = 0; i < 60; i++) brain.update(DT, heard);
    expect(brain.attention.awareness).toBeLessThanOrEqual(config.ai.hearingStimCap + 1e-6);
    expect(brain.attention.awareness).toBeLessThan(config.ai.awarenessAlert);
    expect(brain.state).not.toBe('chase');
  });

  it('the alert ratchet holds awareness in the suspicious band briefly after alert', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
    // Sight lost: within the ratchet window awareness can't fall below suspicious.
    const gone = snapshot({ position: new THREE.Vector3(5, 3.5, 5), floor: 1 });
    brain.update(DT, gone);
    expect(brain.attention.awareness).toBeGreaterThanOrEqual(config.ai.awarenessSuspicious);
    // Well past the ratchet → free to decay below suspicious.
    for (let i = 0; i < (config.ai.awarenessAlertRatchet + 1) / DT; i++) brain.update(DT, gone);
    expect(brain.attention.awareness).toBeLessThan(config.ai.awarenessSuspicious);
  });
});

describe('attention behaviors', () => {
  beforeEach(() => clearSearchClaims());

  it('headScanOffset is a bounded sine sweep within ±arc', () => {
    expect(headScanOffset(0, 1.1, 0.7)).toBeCloseTo(0, 6);
    for (let t = 0; t < 20; t += 0.13) {
      expect(Math.abs(headScanOffset(t, 1.1, 0.7))).toBeLessThanOrEqual(0.7 + 1e-9);
    }
  });

  it('idle: an unaware enemy idly scans (head sweeps, low intensity)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.update(DT, snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 })); // nothing sensed
    expect(brain.attention.level).toBe('unaware');
    expect(brain.attention.gazeIntensity).toBe(config.ai.headScanIntensity);
    expect(brain.attention.gazeTarget).not.toBeNull();
  });

  it('glance: a heard-but-unseen sound turns the head toward it (below sight strength)', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    // Hidden, noisy, on an open path ahead (+z): heard, never seen.
    const noisy = snapshot({ position: new THREE.Vector3(15, 3.5, 22), noiseLevel: 3, hidden: true });
    for (let i = 0; i < 30; i++) brain.update(DT, noisy);
    expect(brain.attention.seen).toBe(false);
    expect(brain.attention.level).toBe('suspicious');
    expect(brain.attention.gazeIntensity).toBe(config.ai.glanceIntensity);
    // Gaze points toward the sound (ahead, +z from the enemy at z=19).
    expect(brain.attention.gazeTarget!.z).toBeGreaterThan(body.position.z);
  });

  it('priority: sight overrides both glance and idle scan', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    // Seen AND noisy: sight wins at full strength.
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true, noiseLevel: 3 }));
    expect(brain.attention.seen).toBe(true);
    expect(brain.attention.gazeIntensity).toBe(1);
  });
});

describe('non-linear patrol', () => {
  beforeEach(() => clearSearchClaims());

  // Drive a long patrol with nothing sensed; capture the move targets issued.
  function patrolTargets(ticks: number): { targets: (THREE.Vector3 | null)[] } {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const targets: (THREE.Vector3 | null)[] = [];
    const base = body.setMoveTarget.bind(body);
    body.setMoveTarget = (t, s = 0) => {
      targets.push(t ? t.clone() : null);
      base(t, s);
    };
    const brain = brainWith(body, hiding, new Rng(3));
    const nothing = snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 });
    for (let i = 0; i < ticks; i++) brain.update(DT, nothing);
    return { targets };
  }

  it('wanders to several distinct destinations (not a fixed loop)', () => {
    const { targets } = patrolTargets(2400);
    const distinct = new Set(
      targets.filter(Boolean).map((t) => `${Math.round(t!.x)},${Math.round(t!.z)}`)
    );
    expect(distinct.size).toBeGreaterThan(2);
  });

  it('hesitates: a think-pause holds the body still (null move target) at a waypoint', () => {
    const prev = config.ai.patrolPauseChance;
    config.ai.patrolPauseChance = 1; // force a pause at the first waypoint reached
    try {
      const { targets } = patrolTargets(1200);
      expect(targets.some((t) => t === null)).toBe(true);
    } finally {
      config.ai.patrolPauseChance = prev;
    }
  });

  it('stays in patrol the whole time when nothing is sensed', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(3));
    const nothing = snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 });
    for (let i = 0; i < 600; i++) brain.update(DT, nothing);
    expect(brain.state).toBe('patrol');
  });
});

describe('hearing throttle', () => {
  beforeEach(() => clearSearchClaims());

  it('reuses the cached pathed-hearing result between recomputes', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19);
    const brain = brainWith(body, hiding, new Rng(1));
    // Hidden but noisy: pure hearing, never seen, so the enemy can't move into sight.
    const noisy = snapshot({ position: new THREE.Vector3(15, 3.5, 22), noiseLevel: 3, hidden: true });
    brain.update(DT, noisy); // first tick recomputes (age was Infinity)
    const cached = brain.attention.heardDir;
    expect(cached).not.toBeNull();
    // Within the cadence the same result object is reused, not recomputed.
    brain.update(DT, noisy);
    expect(brain.attention.heardDir).toBe(cached);
    // After a full cadence interval it recomputes (a fresh result object).
    for (let i = 0; i < config.ai.soundRecomputeTicks; i++) brain.update(DT, noisy);
    expect(brain.attention.heardDir).not.toBe(cached);
  });
});

describe('cross-floor pursuit', () => {
  beforeEach(() => clearSearchClaims());

  // Drive a chase, then make the player flee to another floor and run frames.
  function chaseThenFlee(pursuit: number): EnemyBrain {
    const prev = config.ai.crossFloorPursuit;
    config.ai.crossFloorPursuit = pursuit;
    try {
      const { hiding } = makeHiding();
      const body = stubBody(15, 3.5, 19); // foyer (floor 1), facing south
      const brain = brainWith(body, hiding, new Rng(1));
      pumpUntilChase(brain, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
      expect(brain.state).toBe('chase');
      // Player vanishes downstairs (floor 0): canSee is false across floors.
      const fled = snapshot({ position: new THREE.Vector3(15, 0, 13), floor: 0 });
      for (let i = 0; i < Math.ceil((config.ai.memorySeconds + 1) / DT); i++) {
        brain.update(DT, fled);
      }
      return brain;
    } finally {
      config.ai.crossFloorPursuit = prev;
    }
  }

  it('at pursuit=1 the chaser commits across the stairs (stays in chase)', () => {
    expect(chaseThenFlee(1).state).toBe('chase');
  });

  it('at pursuit=0 the chaser gives up at the floor boundary', () => {
    expect(chaseThenFlee(0).state).not.toBe('chase');
  });
});

describe('balance invariants', () => {
  it('escapes are possible: chase speed < player sprint', () => {
    expect(config.ai.chaseSpeed).toBeLessThan(config.player.sprintSpeed);
  });
  it('darkness is the player friend: lightOff range ≪ lightOn', () => {
    expect(config.ai.visionLightOff * 2).toBeLessThanOrEqual(config.ai.visionLightOn);
  });
  it('the run starts with a grace window', () => {
    expect(config.ai.gracePeriod).toBeGreaterThan(0);
  });
  it('hiding dark is meaningfully safer', () => {
    expect(config.ai.searchProbLightOff).toBeLessThanOrEqual(0.35);
    expect(config.ai.searchProbLightOn).toBeGreaterThanOrEqual(0.6);
  });
});
