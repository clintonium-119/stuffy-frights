import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { BrainBody, BrainContext, EnemyBrain, clearSearchClaims } from './EnemyBrain';
import { NavGraph } from './NavGraph';
import { canSee, movementNoiseRadius, PlayerSnapshot } from './Perception';
import { house } from '../world/houseLayout';
import { PROP_PLACEMENTS } from '../world/Props';
import { HidingSystem } from '../systems/HidingSpot';
import { InteractionSystem } from '../player/Interaction';
import { PlayerController } from '../player/PlayerController';
import { Input } from '../core/Input';
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
  const input = new Input();
  const player = new PlayerController(camera, input, new ColliderSet());
  const interactions = new InteractionSystem();
  const def = house.hidingSpots[4]; // main-floor living-room wardrobe (1:4,9)
  const worldPos = new THREE.Vector3(9, 3.5, 19);
  const hiding = new HidingSystem(player, interactions, [{ def, worldPos }]);
  return { hiding, player, interactions, worldPos };
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

  it('crouching shrinks detection range', () => {
    const enemyPos = new THREE.Vector3(15, 3.5, 19);
    const at = (d: number) => snapshot({ position: new THREE.Vector3(15, 3.5, 19 + d) });
    const edge = config.ai.visionLightOff * 0.9;
    expect(canSee(house, enemyPos, 0, 1, at(edge))).toBe(true);
    expect(canSee(house, enemyPos, 0, 1, { ...at(edge), crouched: true })).toBe(false);
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
    const body = stubBody(15, 3.5, 13);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(16, 3.5, 14), 6);
    expect(brain.state).toBe('investigate');
  });

  it('noise beyond radius is ignored', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 13);
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(40, 3.5, 14), 6);
    expect(brain.state).toBe('patrol');
  });

  it('investigate → chase on sight; chase sets the menacing flag', () => {
    const { hiding } = makeHiding();
    const body = stubBody(15, 3.5, 19); // foyer, facing south (yaw 0)
    const brain = brainWith(body, hiding, new Rng(1));
    brain.hearNoise(new THREE.Vector3(15, 3.5, 22), 6);
    expect(brain.state).toBe('investigate');
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    expect(body.isChasing).toBe(true);
  });

  it('witnessed hide → searchHiding → guaranteed find', () => {
    const { hiding, player, interactions, worldPos } = makeHiding();
    const body = stubBody(9, 3.5, 21.5); // living room, near the wardrobe
    let found = 0;
    const brain = brainWith(body, hiding, new Rng(1), () => found++);
    // See the player first (chase), then they hide in view.
    brain.update(DT, snapshot({ position: new THREE.Vector3(9, 3.5, 23), lightOn: true }));
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
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
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
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 22), lightOn: true }));
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
    brain.update(DT, snapshot({ position: new THREE.Vector3(15, 3.5, 23), lightOn: true }));
    expect(brain.state).toBe('chase');
    const gone = snapshot({ position: new THREE.Vector3(5, 0, 5), floor: 0 });
    const seen = new Set<string>();
    for (let i = 0; i < 30 / DT; i++) {
      brain.update(DT, gone);
      seen.add(brain.state);
      if (brain.state === 'patrol') break;
    }
    expect(seen.has('investigate')).toBe(true);
    expect(brain.state).toBe('patrol');
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
