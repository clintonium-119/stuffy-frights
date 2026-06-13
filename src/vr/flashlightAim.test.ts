import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Flashlight } from '../player/Flashlight';

function makeFlashlight() {
  return new Flashlight(new THREE.Scene());
}

describe('Flashlight controller aim (VR)', () => {
  it('positions the light at the controller and aims along its forward', () => {
    const fl = makeFlashlight();
    const camera = new THREE.PerspectiveCamera();
    const position = new THREE.Vector3(1, 2, 3);
    const forward = new THREE.Vector3(0, 0, -1);
    fl.update(1 / 60, camera, { position, forward });
    expect(fl.light.position.distanceTo(position)).toBeLessThan(1e-6);
    const expectedTarget = position.clone().add(forward.clone().multiplyScalar(8));
    expect(fl.light.target.position.distanceTo(expectedTarget)).toBeLessThan(1e-6);
  });

  it('snaps to the aim with no sway lag (1:1 hand tracking)', () => {
    const fl = makeFlashlight();
    const camera = new THREE.PerspectiveCamera();
    fl.update(1 / 60, camera, { position: new THREE.Vector3(0, 0, 0), forward: new THREE.Vector3(0, 0, -1) });
    // A large jump in one frame is followed exactly (no smoothing).
    const p2 = new THREE.Vector3(5, 0, 0);
    fl.update(1 / 60, camera, { position: p2, forward: new THREE.Vector3(1, 0, 0) });
    expect(fl.light.position.distanceTo(p2)).toBeLessThan(1e-6);
    expect(fl.light.target.position.distanceTo(new THREE.Vector3(13, 0, 0))).toBeLessThan(1e-6);
  });

  it('without aim, still follows the camera (desktop path unchanged)', () => {
    const fl = makeFlashlight();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 1.6, 0);
    camera.quaternion.identity(); // looking down −Z
    fl.update(1 / 60, camera);
    // First frame initializes the smoothed target exactly to the ideal.
    const expected = new THREE.Vector3(0, 1.6, -8);
    expect(fl.light.target.position.distanceTo(expected)).toBeLessThan(1e-6);
    expect(fl.light.position.y).toBeCloseTo(1.6 - 0.12, 6);
  });
});
