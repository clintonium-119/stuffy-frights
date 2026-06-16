import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { canSee, PlayerSnapshot } from './Perception';
import { house } from '../world/houseLayout';

function snapshot(over: Partial<PlayerSnapshot> = {}): PlayerSnapshot {
  return {
    position: new THREE.Vector3(15, 3.5, 23),
    floor: 1,
    lightOn: true,
    crouched: false,
    noiseLevel: 0,
    hidden: false,
    ...over,
  };
}

describe('canSee — undetectable cheat', () => {
  it('a clearly-visible player is seen normally', () => {
    const enemy = new THREE.Vector3(15, 3.5, 19); // foyer, facing the player
    expect(canSee(house, enemy, 0, 1, snapshot())).toBe(true);
  });

  it('the same player is never seen when undetectable', () => {
    const enemy = new THREE.Vector3(15, 3.5, 19);
    expect(canSee(house, enemy, 0, 1, snapshot({ undetectable: true }))).toBe(false);
  });
});
