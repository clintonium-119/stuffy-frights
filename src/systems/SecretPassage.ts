import * as THREE from 'three';
import { Aabb, ColliderSet, aabb } from '../core/Collision';
import { config } from '../core/config';
import { InteractionSystem } from '../player/Interaction';
import { PlayerController } from '../player/PlayerController';
import {
  CELL_SIZE,
  Chute,
  House,
  Vent,
  cellToWorld,
  floorY,
  worldToCell,
} from '../world/layoutTypes';

/**
 * Secret passages: bidirectional vent bores (crawl through a wall) and
 * one-way drop chutes (floor hatches). Both start sealed by a grate/hatch
 * collider; one interact opens them for the rest of the run. They stay off
 * the map even after discovery — the player's secret knowledge.
 */
export interface PassageState {
  id: string;
  opened: boolean;
  discovered: boolean;
  /** Snapshot of light state when the player last entered. */
  enteredWithLightOff: boolean;
}

interface TrackedVent extends PassageState {
  vent: Vent;
  blockers: Aabb[];
  grateMeshes: THREE.Object3D[];
  /** Fold-open progress 0 (closed/vertical) → 1 (folded up to the ceiling). */
  foldT: number;
}

interface TrackedChute extends PassageState {
  chute: Chute;
  blocker: Aabb | null;
  lidMesh: THREE.Object3D | null;
}

/** Crawl-opening dimensions for a vent grille. */
const GRILLE_W = 0.92;
const GRILLE_H = 1.0;
const GRILLE_D = 0.06;
/** Fold-open angle: the grille hinges at its top edge and swings up toward the ceiling. */
const VENT_OPEN_ANGLE = -Math.PI * 0.52;

/**
 * A louvred vent grille covering one bore cell's crawl opening. The returned
 * `group` is positioned + oriented in the world (hinge point at the top of the
 * opening); the `leaf` holds the slatted panel and rotates about its local X to
 * fold the grille up to the ceiling when the vent is pried open.
 */
function makeVentGrille(
  mat: THREE.Material,
  alongX: boolean,
  x: number,
  y0: number,
  z: number
): { group: THREE.Group; leaf: THREE.Group } {
  const group = new THREE.Group();
  group.position.set(x, y0 + GRILLE_H, z); // hinge at the top of the crawl opening
  if (!alongX) group.rotation.y = Math.PI / 2; // face the bore's open (through) axis
  const leaf = new THREE.Group();
  group.add(leaf);

  // Frame: two stiles + top/bottom rails, hanging from the hinge (y=0) down to -H.
  const stile = (sx: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, GRILLE_H, GRILLE_D), mat);
    m.position.set(sx, -GRILLE_H / 2, 0);
    m.castShadow = true;
    leaf.add(m);
  };
  stile(-GRILLE_W / 2);
  stile(GRILLE_W / 2);
  const rail = (ry: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(GRILLE_W, 0.07, GRILLE_D), mat);
    m.position.set(0, ry, 0);
    m.castShadow = true;
    leaf.add(m);
  };
  rail(-0.04);
  rail(-GRILLE_H + 0.04);

  // Angled louvre slats across the opening.
  const slats = 6;
  const span = GRILLE_H - 0.22;
  const step = span / (slats - 1);
  for (let i = 0; i < slats; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(GRILLE_W - 0.1, 0.085, 0.03), mat);
    s.position.set(0, -0.11 - i * step, 0.006);
    s.rotation.x = -0.5; // tilted louvre
    s.castShadow = true;
    leaf.add(s);
  }
  return { group, leaf };
}

export class PassageSystem {
  vents: TrackedVent[] = [];
  chutes: TrackedChute[] = [];
  /** Hook: is the flashlight on? */
  isLightOn: () => boolean = () => false;
  /** Event for AI: player entered a passage (witnessable). */
  onPlayerEnter: ((passage: PassageState) => void) | null = null;
  /** Fired when a grate/hatch is opened (audible creak hook). */
  onOpen: ((passage: PassageState) => void) | null = null;

  private playerWasInside = new Set<string>();

  constructor(
    house: House,
    private colliders: ColliderSet,
    private player: PlayerController,
    interactions: InteractionSystem,
    sceneGroup: THREE.Group
  ) {
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x4f4a42,
      roughness: 0.7,
      metalness: 0.3,
    });

    house.vents.forEach((vent, i) => {
      const id = `vent-${i}`;
      const y0 = floorY(vent.floor);
      const grid = house.grids[vent.floor];
      const blockers: Aabb[] = [];
      const meshes: THREE.Object3D[] = [];
      // Seal every cell of the (possibly multi-cell) bore until pried. While
      // sealed nobody is inside, so interior blocking is harmless; prying
      // removes all blockers and the whole tunnel becomes crawlable.
      for (const cell of vent.cells) {
        const { x, z } = cellToWorld(cell.x, cell.z);
        const alongX = grid[cell.z][cell.x - 1] === 'wall' || grid[cell.z][cell.x + 1] === 'wall';
        const blocker = alongX
          ? aabb(x - CELL_SIZE / 2, y0, z - 0.06, x + CELL_SIZE / 2, y0 + 1.1, z + 0.06)
          : aabb(x - 0.06, y0, z - CELL_SIZE / 2, x + 0.06, y0 + 1.1, z + CELL_SIZE / 2);
        this.colliders.add(blocker);
        blockers.push(blocker);
        // One louvred grille per bore cell, hinged at the top to fold up to the
        // ceiling when pried. `meshes` tracks the folding leaves for animation.
        const { group: grilleGroup, leaf } = makeVentGrille(lidMat, alongX, x, y0, z);
        sceneGroup.add(grilleGroup);
        meshes.push(leaf);
      }

      const tracked: TrackedVent = {
        id,
        vent,
        opened: false,
        discovered: false,
        enteredWithLightOff: true,
        blockers,
        grateMeshes: meshes,
        foldT: 0,
      };
      this.vents.push(tracked);

      const mouth = cellToWorld(vent.cells[0].x, vent.cells[0].z);
      interactions.add({
        position: new THREE.Vector3(mouth.x, y0 + 0.6, mouth.z),
        radius: 1.8,
        label: () => (tracked.opened ? '' : 'Pry the vent open'),
        enabled: () => !tracked.opened,
        onInteract: () => this.openVent(tracked),
      });
    });

    house.chutes.forEach((chute, i) => {
      const id = `chute-${i}`;
      const { x, z } = cellToWorld(chute.from.x, chute.from.z);
      const y0 = floorY(chute.from.floor);
      // Closed hatch lid: walkable cover over the hole.
      const blocker = aabb(
        chute.from.x * CELL_SIZE,
        y0 - 0.12,
        chute.from.z * CELL_SIZE,
        (chute.from.x + 1) * CELL_SIZE,
        y0,
        (chute.from.z + 1) * CELL_SIZE
      );
      this.colliders.add(blocker);
      const lid = new THREE.Mesh(
        new THREE.BoxGeometry(CELL_SIZE - 0.3, 0.08, CELL_SIZE - 0.3),
        lidMat
      );
      lid.position.set(x, y0 - 0.04, z);
      sceneGroup.add(lid);

      const tracked: TrackedChute = {
        id,
        chute,
        opened: false,
        discovered: false,
        enteredWithLightOff: true,
        blocker,
        lidMesh: lid,
      };
      this.chutes.push(tracked);

      interactions.add({
        position: new THREE.Vector3(x, y0 + 0.3, z),
        radius: 1.8,
        label: () => (tracked.opened ? '' : 'Open the hatch'),
        enabled: () => !tracked.opened,
        onInteract: () => this.openChute(tracked),
      });
    });
  }

  private openVent(v: TrackedVent): void {
    v.opened = true;
    // Clear the bore immediately so the crawl is usable as the grilles swing up;
    // the visual fold itself eases over the next frames in update().
    for (const b of v.blockers) this.colliders.remove(b);
    this.onOpen?.(v);
  }

  private openChute(c: TrackedChute): void {
    c.opened = true;
    if (c.blocker) this.colliders.remove(c.blocker);
    if (c.lidMesh) {
      c.lidMesh.rotation.z = Math.PI * 0.55;
      c.lidMesh.position.y += 0.4;
      c.lidMesh.position.x += 0.9;
    }
    this.onOpen?.(c);
  }

  /** Per fixed step: ease open vent grilles, then track bore traversal + chute drops. */
  update(dt: number): void {
    // Fold any opening grilles up toward the ceiling (eased).
    const foldRate = dt / Math.max(1e-4, config.passage.ventFoldSeconds);
    for (const v of this.vents) {
      if (!v.opened || v.foldT >= 1) continue;
      v.foldT = Math.min(1, v.foldT + foldRate);
      const e = 1 - Math.pow(1 - v.foldT, 3); // easeOutCubic
      const angle = e * VENT_OPEN_ANGLE;
      for (const leaf of v.grateMeshes) leaf.rotation.x = angle;
    }

    const p = this.player;
    const cell = worldToCell(p.position.x, p.position.z);

    for (const v of this.vents) {
      const inCell = v.vent.cells.some((c) => cell.x === c.x && cell.z === c.z);
      const inside = p.floorIndex === v.vent.floor && inCell && v.opened;
      const wasInside = this.playerWasInside.has(v.id);
      if (inside && !wasInside) {
        v.enteredWithLightOff = !this.isLightOn();
        this.playerWasInside.add(v.id);
        this.onPlayerEnter?.(v);
      } else if (!inside && wasInside) {
        // Left the tunnel (any cell) — counts as traversed/discovered.
        v.discovered = true;
        this.playerWasInside.delete(v.id);
      }
    }

    for (const ch of this.chutes) {
      const from = ch.chute.from;
      const atMouthCell = cell.x === from.x && cell.z === from.z;
      const falling = atMouthCell && ch.opened && p.position.y < floorY(from.floor) - 0.4;
      if (falling && !this.playerWasInside.has(ch.id)) {
        ch.enteredWithLightOff = !this.isLightOn();
        ch.discovered = true;
        this.playerWasInside.add(ch.id);
        this.onPlayerEnter?.(ch);
      } else if (!atMouthCell) {
        this.playerWasInside.delete(ch.id);
      }
    }
  }
}
