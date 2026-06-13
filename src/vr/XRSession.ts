/**
 * Bridges the game's body/collision model to a headset-driven camera. The
 * camera is parented to a rig Group positioned at the player's feet each frame;
 * WebXR's local-floor reference space offsets the headset to physical eye
 * height within the rig, and the headset orientation drives the view. The
 * headset yaw is fed back into player.yaw so left-stick locomotion is
 * head-relative (turning is head-only — the right stick stays unbound).
 */
import * as THREE from 'three';
import type { Engine } from '../core/Engine';
import type { PlayerController } from '../player/PlayerController';
import { config } from '../core/config';

/** Yaw (radians, game convention) of a quaternion's forward (−Z) direction. */
export function yawFromQuaternion(q: THREE.Quaternion): number {
  const f = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
  return Math.atan2(-f.x, -f.z);
}

export class XRSession {
  private rig: THREE.Group;
  private tmpQuat = new THREE.Quaternion();
  private crouchDrop = config.player.eyeHeightStanding - config.player.eyeHeightCrouched;

  constructor(
    private readonly engine: Engine,
    private readonly player: PlayerController
  ) {
    this.rig = new THREE.Group();
    this.rig.add(engine.camera);
    // Parent both controllers to the rig so the renderer keeps their world
    // poses current — without this, getController().getWorldPosition() stays at
    // the origin and the controller-aimed flashlight points nowhere.
    this.rig.add(engine.renderer.xr.getController(0));
    this.rig.add(engine.renderer.xr.getController(1));
    engine.scene.add(this.rig);
    engine.renderer.xr.setReferenceSpaceType('local-floor');
  }

  /** Per-frame: place the rig at the player's feet, feed headset yaw back. */
  sync(): void {
    const p = this.player.position;
    this.rig.position.set(p.x, p.y, p.z);
    // Crouch sinks the whole rig so the world rises around the player.
    if (this.player.isCrouched) this.rig.position.y -= this.crouchDrop;

    const headQuat = this.engine.renderer.xr.getCamera().getWorldQuaternion(this.tmpQuat);
    this.player.yaw = yawFromQuaternion(headQuat);
  }

  /** Tear down on session end: re-orphan the camera so desktop writes resume. */
  dispose(): void {
    this.rig.remove(this.engine.camera);
    this.engine.scene.remove(this.rig);
  }
}
