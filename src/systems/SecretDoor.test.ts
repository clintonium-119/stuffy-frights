import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { buildMansion } from '../world/mansion/index';
import type { SecretDoorRender } from '../world/HouseBuilder';
import { SecretDoorSystem } from './SecretDoor';
import { InteractionSystem } from '../player/Interaction';
import { ColliderSet, aabb, type Aabb } from '../core/Collision';
import { edgeBetween, blocksMovement, blocksSight } from '../world/edges';

// The wine-cellar jib (basement, the only authored secret edge).
const JIB_A = { x: 8, z: 53 };
const JIB_B = { x: 8, z: 54 };
const JIB_FLOOR = 1;

function makeRender(): { render: SecretDoorRender; collider: Aabb } {
  const collider = aabb(0, 0, 0, 1, 3, 1);
  const render: SecretDoorRender = {
    floor: JIB_FLOOR,
    edges: [{ a: { ...JIB_A }, b: { ...JIB_B } }],
    mesh: new THREE.Mesh(),
    collider,
    center: new THREE.Vector3(4, 1.5, 26.5),
  };
  return { render, collider };
}

describe('SecretDoorSystem', () => {
  it('a concealed jib blocks until searched, then opens nav + geometry', () => {
    const house = buildMansion();
    const colliders = new ColliderSet();
    const { render, collider } = makeRender();
    colliders.add(collider);
    const interactions = new InteractionSystem();
    const sys = new SecretDoorSystem(house, [render], colliders, interactions);
    let revealed = 0;
    sys.onReveal = () => revealed++;

    // Before discovery: the edge blocks movement + sight; flush wall + collider.
    expect(edgeBetween(house, JIB_FLOOR, JIB_A, JIB_B)).toBe('secret');
    expect(blocksMovement('secret')).toBe(true);
    expect(blocksSight('secret')).toBe(true);
    expect(colliders.all).toContain(collider);
    expect(render.mesh.visible).toBe(true);

    // Search the wall (player at the panel → interact).
    interactions.update(render.center, new THREE.Vector3(1, 0, 0));
    expect(interactions.interact()).toBe(true);

    // After: a passable doorway; collider dropped; flush panel hidden.
    const opened = edgeBetween(house, JIB_FLOOR, JIB_A, JIB_B);
    expect(opened).toBe('door');
    expect(blocksMovement(opened)).toBe(false);
    expect(blocksSight(opened)).toBe(false);
    expect(colliders.all).not.toContain(collider);
    expect(render.mesh.visible).toBe(false);
    expect(revealed).toBe(1);
    expect(sys.doors[0].revealed).toBe(true);
  });

  it('a revealed door is no longer interactable (idempotent)', () => {
    const house = buildMansion();
    const colliders = new ColliderSet();
    const { render, collider } = makeRender();
    colliders.add(collider);
    const interactions = new InteractionSystem();
    new SecretDoorSystem(house, [render], colliders, interactions);

    interactions.update(render.center, new THREE.Vector3(1, 0, 0));
    expect(interactions.interact()).toBe(true);
    // A second search does nothing — the panel is already open.
    interactions.update(render.center, new THREE.Vector3(1, 0, 0));
    expect(interactions.interact()).toBe(false);
  });
});
