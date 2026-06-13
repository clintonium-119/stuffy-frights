import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { yawFromQuaternion } from './XRSession';

/** Build a quaternion for a pure yaw and confirm we recover it. */
function quatForYaw(yaw: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0, 'YXZ'));
}

describe('yawFromQuaternion', () => {
  it('recovers a zero yaw (looking down −Z)', () => {
    expect(yawFromQuaternion(quatForYaw(0))).toBeCloseTo(0, 6);
  });

  it('recovers a quarter-turn', () => {
    expect(yawFromQuaternion(quatForYaw(Math.PI / 2))).toBeCloseTo(Math.PI / 2, 6);
  });

  it('recovers a negative yaw', () => {
    expect(yawFromQuaternion(quatForYaw(-1.0))).toBeCloseTo(-1.0, 6);
  });

  it('is unaffected by pitch (head tilt does not change yaw)', () => {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.8, 0, 'YXZ'));
    expect(yawFromQuaternion(q)).toBeCloseTo(0.8, 5);
  });
});
