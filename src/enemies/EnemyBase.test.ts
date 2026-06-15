import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { resolveMood, Mood, EnemyBase } from './EnemyBase';
import { Jumpscare, JumpscareTarget } from './Jumpscare';
import { config } from '../core/config';

/** Minimal concrete EnemyBase for testing update()/catch (no GLB load). */
class TestEnemy extends EnemyBase {
  constructor() {
    super('test');
  }
}

const HOLD = config.enemy.expressionHold;
const R = config.enemy.threatRadius;
const DT = 1 / 60;

function settle(distance: number, chasing: boolean, mood: Mood, seconds: number) {
  let state = { mood, heldFor: HOLD + 1 };
  for (let i = 0; i < seconds / DT; i++) {
    state = resolveMood(distance, chasing, state.mood, state.heldFor, DT);
  }
  return state.mood;
}

describe('resolveMood', () => {
  it('turns menacing inside the threat radius', () => {
    expect(settle(R - 1, false, 'calm', 1)).toBe('menacing');
  });

  it('stays calm outside the radius when not chasing', () => {
    expect(settle(R + 2, false, 'calm', 1)).toBe('calm');
  });

  it('is menacing while chasing at any distance', () => {
    expect(settle(R * 4, true, 'calm', 1)).toBe('menacing');
  });

  it('a per-enemy threat multiplier widens the menacing radius', () => {
    const d = R + 2; // outside the base radius (stays calm at 1×)
    let s = { mood: 'calm' as Mood, heldFor: HOLD + 1 };
    for (let i = 0; i < 60; i++) s = resolveMood(d, false, s.mood, s.heldFor, DT, 2);
    expect(s.mood).toBe('menacing'); // 2× radius now reaches it
  });

  it('reverts to calm after leaving the radius', () => {
    let mood = settle(R - 1, false, 'calm', 1);
    expect(mood).toBe('menacing');
    expect(settle(R + 3, false, mood, 2)).toBe('calm');
  });

  it('hold time prevents flicker at the boundary', () => {
    // Fresh flip to menacing (heldFor 0): an immediate calm condition
    // cannot flip it back until the hold expires.
    let state = { mood: 'menacing' as Mood, heldFor: 0 };
    state = resolveMood(R + 5, false, state.mood, state.heldFor, DT);
    expect(state.mood).toBe('menacing'); // still held
    // After the hold expires it may flip.
    for (let i = 0; i < (HOLD + 0.1) / DT; i++) {
      state = resolveMood(R + 5, false, state.mood, state.heldFor, DT);
    }
    expect(state.mood).toBe('calm');
  });
});

describe('contact catch', () => {
  const atPlayer = new THREE.Vector3(0, 0, 0); // enemy sits on the player → in range

  it('catches once and disables when onCatch accepts', () => {
    const e = new TestEnemy();
    let calls = 0;
    e.onCatch = () => {
      calls++;
      return true;
    };
    e.update(DT, atPlayer, true);
    expect(calls).toBe(1);
    expect(e.catchEnabled).toBe(false);
  });

  it('keeps catchEnabled when onCatch rejects, so it can still catch later', () => {
    const e = new TestEnemy();
    let calls = 0;
    e.onCatch = () => {
      calls++;
      return false; // game state refused the catch (e.g. already jumpscaring)
    };
    e.update(DT, atPlayer, true);
    expect(e.catchEnabled).toBe(true); // NOT permanently disabled
    e.update(DT, atPlayer, true);
    expect(calls).toBe(2); // still attempts on the next frame
  });

  it('does not attempt a catch when the player is not catchable', () => {
    const e = new TestEnemy();
    let calls = 0;
    e.onCatch = () => {
      calls++;
      return true;
    };
    e.update(DT, atPlayer, false);
    expect(calls).toBe(0);
    expect(e.catchEnabled).toBe(true);
  });
});

describe('Jumpscare', () => {
  function makeTarget(): JumpscareTarget {
    return {
      id: 'fuggie',
      position: new THREE.Vector3(2, 0, 0),
      group: new THREE.Object3D(),
      isChasing: false,
    };
  }

  function run(js: Jumpscare, camera: THREE.PerspectiveCamera, seconds: number) {
    for (let i = 0; i < seconds / DT; i++) js.update(DT, camera);
  }

  it('walks the phase order and emits gameOver exactly once', () => {
    const js = new Jumpscare();
    const camera = new THREE.PerspectiveCamera();
    const phases: string[] = [];
    const overs: string[] = [];
    js.onGameOver = (id) => overs.push(id);
    expect(js.trigger(makeTarget(), camera)).toBe(true);
    let last = '';
    for (let i = 0; i < 3 / DT; i++) {
      js.update(DT, camera);
      if (js.phase !== last) {
        phases.push(js.phase);
        last = js.phase;
      }
    }
    expect(phases).toEqual(['turning', 'lunging', 'redFade', 'blackout', 'done']);
    expect(overs).toEqual(['fuggie']);
    // Extra updates never re-emit.
    run(js, camera, 1);
    expect(overs).toHaveLength(1);
  });

  it('forces the menacing face on the catcher', () => {
    const js = new Jumpscare();
    const target = makeTarget();
    js.trigger(target, new THREE.PerspectiveCamera());
    expect(target.isChasing).toBe(true);
  });

  it('refuses re-trigger until reset', () => {
    const js = new Jumpscare();
    const camera = new THREE.PerspectiveCamera();
    expect(js.trigger(makeTarget(), camera)).toBe(true);
    expect(js.trigger(makeTarget(), camera)).toBe(false);
    run(js, camera, 3);
    expect(js.phase).toBe('done');
    expect(js.trigger(makeTarget(), camera)).toBe(false); // still latched
    js.reset();
    expect(js.trigger(makeTarget(), camera)).toBe(true);
  });

  it('locks the camera onto the closing enemy face (eye contact beats a fixed aim)', () => {
    const js = new Jumpscare();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 1.6, 0);
    const target = makeTarget();
    target.position.set(0, 0, 4); // enemy 4 m ahead; it rushes in along -Z
    js.trigger(target, camera);
    let heldAim: THREE.Quaternion | null = null;
    let tracked = 0;
    let held = 0;
    let samples = 0;
    const limit = (config.enemy.jumpscareTurn + config.enemy.jumpscareLunge) / DT;
    for (let i = 0; i < limit; i++) {
      js.update(DT, camera);
      if (js.phase === 'lunging') {
        // The aim a non-tracking jumpscare would freeze at (post-turn).
        if (!heldAim) heldAim = camera.quaternion.clone();
        const face = target.position.clone().add(new THREE.Vector3(0, 1.1, 0));
        const toFace = face.clone().sub(camera.position).normalize();
        tracked = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).angleTo(toFace);
        held = new THREE.Vector3(0, 0, -1).applyQuaternion(heldAim).angleTo(toFace);
        samples++;
      }
    }
    expect(samples).toBeGreaterThan(0);
    // By the end of the lunge the live re-aim holds eye contact far better than
    // a frozen aim would, and stays close to dead-centre.
    expect(tracked).toBeLessThan(held);
    expect(tracked).toBeLessThan(0.5);
  });

  it('total runtime stays within the kid-calibrated budget (≤2 s)', () => {
    const total =
      config.enemy.jumpscareTurn +
      config.enemy.jumpscareLunge +
      config.enemy.jumpscareRedFade +
      config.enemy.jumpscareBlackout;
    expect(total).toBeLessThanOrEqual(2);
  });

  it('washes red then black, with both reaching full before gameOver', () => {
    const js = new Jumpscare();
    const camera = new THREE.PerspectiveCamera();
    let redAtOver = -1;
    let blackAtOver = -1;
    let red = 0;
    let black = 0;
    js.onRedFade = (a) => (red = a);
    js.onBlackout = (a) => (black = a);
    js.onGameOver = () => {
      redAtOver = red;
      blackAtOver = black;
    };
    js.trigger(makeTarget(), camera);
    run(js, camera, 3);
    expect(redAtOver).toBe(1); // red wash held under the black
    expect(blackAtOver).toBe(1);
  });
});
