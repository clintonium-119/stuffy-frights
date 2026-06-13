import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { Input } from '../core/Input';
import { ColliderSet } from '../core/Collision';
import { config } from '../core/config';

const DT = 1 / 60;

function setup() {
  const input = new Input();
  const player = new PlayerController(new THREE.PerspectiveCamera(), input, new ColliderSet());
  const down = (input as unknown as { down: Set<string> }).down;
  return { input, player, down };
}

function step(player: PlayerController, seconds: number) {
  for (let i = 0; i < Math.round(seconds / DT); i++) player.update(DT);
}

describe('PlayerController stamina', () => {
  it('sprinting drains stamina to empty, then locks sprint to walk speed', () => {
    const { player, down } = setup();
    down.add('ShiftLeft');
    down.add('KeyW');
    step(player, config.player.stamina.drainSeconds + 0.5);
    expect(player.stamina).toBe(0);
    expect(player.staminaLocked).toBe(true);
    expect(player.sprinting).toBe(false);
    expect(player.currentSpeed).toBe(config.player.walkSpeed); // gated to walk
  });

  it('regenerates after a delay and re-enables sprint only past the threshold', () => {
    const { player, down } = setup();
    down.add('ShiftLeft');
    down.add('KeyW');
    step(player, config.player.stamina.drainSeconds + 0.5); // exhaust
    expect(player.staminaLocked).toBe(true);
    // Stop moving/sprinting and recover.
    down.delete('ShiftLeft');
    down.delete('KeyW');
    // Just past the delay + enough to cross the recover threshold.
    const s = config.player.stamina;
    step(player, s.regenDelay + s.regenSeconds * s.recoverThreshold + 0.5);
    expect(player.staminaLocked).toBe(false);
    expect(player.stamina).toBeGreaterThanOrEqual(s.recoverThreshold);
  });

  it('walking never drains stamina', () => {
    const { player, down } = setup();
    down.add('KeyW'); // walk, no shift
    step(player, 5);
    expect(player.stamina).toBe(1);
    expect(player.sprinting).toBe(false);
  });

  it('a regen delay holds right after a sprint burst before refilling', () => {
    const { player, down } = setup();
    down.add('ShiftLeft');
    down.add('KeyW');
    step(player, 2); // partial burst, not exhausted
    expect(player.stamina).toBeGreaterThan(0);
    expect(player.stamina).toBeLessThan(1);
    down.delete('ShiftLeft');
    down.delete('KeyW');
    const before = player.stamina;
    step(player, config.player.stamina.regenDelay * 0.5); // within the delay
    expect(player.stamina).toBeCloseTo(before, 5); // no regen yet
    step(player, config.player.stamina.regenDelay + 1); // past the delay
    expect(player.stamina).toBeGreaterThan(before); // now regenerating
  });
});
