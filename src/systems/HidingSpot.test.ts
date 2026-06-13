import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { HidingSystem, labelFor } from './HidingSpot';
import { InteractionSystem } from '../player/Interaction';
import { PlayerController } from '../player/PlayerController';
import { Input } from '../core/Input';
import { ColliderSet } from '../core/Collision';
import { HidingSpotDef } from '../world/layoutTypes';

function setup(lightOn = false) {
  const camera = new THREE.PerspectiveCamera();
  const input = new Input();
  const colliders = new ColliderSet();
  const player = new PlayerController(camera, input, colliders);
  const interactions = new InteractionSystem();
  const def: HidingSpotDef = { pos: { floor: 1, x: 4, z: 9 }, kind: 'wardrobe' };
  const worldPos = new THREE.Vector3(9, 3.5, 19);
  const hiding = new HidingSystem(player, interactions, [{ def, worldPos }]);
  hiding.isLightOn = () => lightOn;
  return { player, interactions, hiding, worldPos };
}

describe('HidingSystem', () => {
  it('enters on interact: occupied, movement locked, player tucked inside', () => {
    const { player, interactions, hiding, worldPos } = setup();
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    expect(interactions.interact()).toBe(true);
    expect(hiding.active).not.toBeNull();
    expect(hiding.active!.occupied).toBe(true);
    expect(player.movementLocked).toBe(true);
    expect(player.position.x).toBeCloseTo(worldPos.x);
  });

  it('records light state at the entry moment', () => {
    const on = setup(true);
    on.player.teleport(8, 3.5, 19);
    on.interactions.update(on.player.position, { x: 1, y: 0, z: 0 });
    on.interactions.interact();
    expect(on.hiding.active!.enteredWithLightOff).toBe(false);

    const off = setup(false);
    off.player.teleport(8, 3.5, 19);
    off.interactions.update(off.player.position, { x: 1, y: 0, z: 0 });
    off.interactions.interact();
    expect(off.hiding.active!.enteredWithLightOff).toBe(true);
  });

  it('forces the light off on entry', () => {
    const { player, interactions, hiding } = setup(true);
    let forced = false;
    hiding.forceLightOff = () => {
      forced = true;
    };
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact();
    expect(forced).toBe(true);
  });

  it('exit restores the entry position and unlocks movement', () => {
    const { player, interactions, hiding } = setup();
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact();
    expect(hiding.exit()).toBe(true);
    expect(hiding.active).toBeNull();
    expect(player.movementLocked).toBe(false);
    expect(player.position.x).toBeCloseTo(8);
  });

  it('occupied spot is not re-enterable while hidden', () => {
    const { player, interactions, hiding } = setup();
    player.teleport(8, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact();
    // While hidden, the spot's interactable is disabled.
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    expect(interactions.activeTarget).toBeNull();
    expect(hiding.active).not.toBeNull();
  });

  it('exit with nothing active returns false', () => {
    const { hiding } = setup();
    expect(hiding.exit()).toBe(false);
  });

  it('a closet has its own label and is an upright (non-crouch) hide', () => {
    expect(labelFor('closet')).toBe('Hide in the closet');
    const camera = new THREE.PerspectiveCamera();
    const input = new Input();
    const player = new PlayerController(camera, input, new ColliderSet());
    const interactions = new InteractionSystem();
    const def: HidingSpotDef = { pos: { floor: 1, x: 10, z: 9 }, kind: 'closet' };
    const hiding = new HidingSystem(player, interactions, [
      { def, worldPos: new THREE.Vector3(21, 3.5, 19) },
    ]);
    player.teleport(20, 3.5, 19);
    interactions.update(player.position, { x: 1, y: 0, z: 0 });
    interactions.interact();
    expect(hiding.active!.kind).toBe('closet');
    expect(player.forceCrouch).toBe(false); // upright, unlike cabinet/under-bed
  });
});
