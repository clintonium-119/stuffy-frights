import * as THREE from 'three';
import { Aabb, ColliderSet, aabb } from '../core/Collision';
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
}

interface TrackedChute extends PassageState {
  chute: Chute;
  blocker: Aabb | null;
  lidMesh: THREE.Object3D | null;
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
        for (const side of [-1, 1]) {
          const cover = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.0, 0.05), lidMat);
          if (alongX) cover.position.set(x, y0 + 0.55, z + side * 0.1);
          else {
            cover.rotation.y = Math.PI / 2;
            cover.position.set(x + side * 0.1, y0 + 0.55, z);
          }
          cover.castShadow = true;
          sceneGroup.add(cover);
          meshes.push(cover);
        }
      }

      const tracked: TrackedVent = {
        id,
        vent,
        opened: false,
        discovered: false,
        enteredWithLightOff: true,
        blockers,
        grateMeshes: meshes,
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
    for (const b of v.blockers) this.colliders.remove(b);
    for (const m of v.grateMeshes) {
      m.rotation.x = -Math.PI * 0.45; // swung open
      m.position.y += 0.35;
    }
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

  /** Per fixed step: track bore traversal + chute drops for discovery state. */
  update(): void {
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
