import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { PassageSystem } from './SecretPassage';
import { ColliderSet } from '../core/Collision';
import { house } from '../world/houseLayout';

interface Interactable {
  onInteract: () => void;
}

function makeSystem() {
  const colliders = new ColliderSet();
  const inters: Interactable[] = [];
  const interactions = { add: (o: Interactable) => inters.push(o) } as never;
  const sceneGroup = new THREE.Group();
  const player = { position: new THREE.Vector3(), floorIndex: 0 } as never;
  const sys = new PassageSystem(house, colliders, player, interactions, sceneGroup);
  return { sys, colliders, inters };
}

describe('vent grilles', () => {
  it('builds one openable grille and one blocker per vent bore cell', () => {
    const { sys, colliders } = makeSystem();
    expect(sys.vents.length).toBe(house.vents.length);
    let cells = 0;
    for (const v of sys.vents) {
      expect(v.blockers.length).toBe(v.vent.cells.length);
      expect(v.grateMeshes.length).toBe(v.vent.cells.length);
      cells += v.vent.cells.length;
    }
    // Every vent blocker plus each chute lid is registered as a collider.
    expect(colliders.all.length).toBe(cells + house.chutes.length);
  });

  it('every grille starts closed (vertical) and sealing the bore', () => {
    const { sys } = makeSystem();
    for (const v of sys.vents) {
      expect(v.opened).toBe(false);
      for (const leaf of v.grateMeshes) expect(leaf.rotation.x).toBe(0);
    }
  });

  it('prying a vent clears its bore at once and eases the grilles up over time', () => {
    const { sys, colliders, inters } = makeSystem();
    const before = colliders.all.length;
    const v0 = sys.vents[0];
    inters[0].onInteract(); // first registered interaction is vent 0's pry action
    expect(v0.opened).toBe(true);
    // Bore is cleared immediately so the crawl is usable as the grilles swing up.
    for (const b of v0.blockers) expect(colliders.all.includes(b)).toBe(false);
    expect(colliders.all.length).toBe(before - v0.blockers.length);
    // Grilles have not snapped — they ease open only as update() advances.
    expect(v0.foldT).toBe(0);
    for (const leaf of v0.grateMeshes) expect(leaf.rotation.x).toBe(0);
    // A partial step folds them part-way (eased, not instant).
    sys.update(0.1);
    expect(v0.foldT).toBeGreaterThan(0);
    expect(v0.foldT).toBeLessThan(1);
    // Enough steps complete the fold to fully open.
    for (let i = 0; i < 60; i++) sys.update(1 / 60);
    expect(v0.foldT).toBe(1);
    for (const leaf of v0.grateMeshes) expect(leaf.rotation.x).not.toBe(0);
  });
});
