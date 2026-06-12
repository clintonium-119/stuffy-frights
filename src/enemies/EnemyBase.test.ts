import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { resolveMood, Mood } from './EnemyBase';
import { Jumpscare, JumpscareTarget } from './Jumpscare';
import { config } from '../core/config';

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
    expect(phases).toEqual(['turning', 'lunging', 'blackout', 'done']);
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

  it('total runtime stays within the kid-calibrated budget (≤1.5 s)', () => {
    const total =
      config.enemy.jumpscareTurn + config.enemy.jumpscareLunge + config.enemy.jumpscareBlackout;
    expect(total).toBeLessThanOrEqual(1.5);
  });

  it('blackout alpha reaches 1 before gameOver', () => {
    const js = new Jumpscare();
    const camera = new THREE.PerspectiveCamera();
    let alphaAtOver = -1;
    let alpha = 0;
    js.onBlackout = (a) => (alpha = a);
    js.onGameOver = () => (alphaAtOver = alpha);
    js.trigger(makeTarget(), camera);
    run(js, camera, 3);
    expect(alphaAtOver).toBe(1);
  });
});
