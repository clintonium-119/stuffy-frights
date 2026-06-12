import * as THREE from 'three';
import { ColliderSet, aabb } from '../core/Collision';
import {
  CELL_SIZE,
  FLOOR_SPACING,
  WALL_HEIGHT,
  House,
  cellToWorld,
  floorY,
  worldToCell,
} from './layoutTypes';
import { PROP_PLACEMENTS, buildProp, hidingHostKind } from './Props';

const SLAB_THICKNESS = 0.25;
const VENT_CLEARANCE = 1.1; // crawl height under a bored wall
const DOOR_HEADER = 2.2; // lintel underside
const STEP_RISE = 0.25;

/** Small tileable canvas texture from a painter callback. */
function canvasTexture(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function speckle(ctx: CanvasRenderingContext2D, size: number, color: string, n: number, r = 2) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * r + 0.5;
    ctx.globalAlpha = 0.08 + Math.random() * 0.25;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function paintConcrete(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#5a5d58';
  ctx.fillRect(0, 0, size, size);
  speckle(ctx, size, '#454843', 900, 3);
  speckle(ctx, size, '#6d706a', 500, 2);
  speckle(ctx, size, '#3a3e3a', 250, 4);
}

function paintMainWallpaper(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#7a7160';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#6b6253';
  for (let x = 0; x < size; x += 32) ctx.fillRect(x, 0, 14, size);
  ctx.strokeStyle = '#564e41';
  ctx.lineWidth = 2;
  for (let x = 7; x < size; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  speckle(ctx, size, '#3f3a30', 350, 5); // grime
}

function paintBedroomWallpaper(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#8a7d80';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#796d72';
  for (let y = 0; y < size; y += 28) {
    for (let x = (y / 28) % 2 === 0 ? 0 : 14; x < size; x += 28) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  speckle(ctx, size, '#4d4347', 300, 4);
}

function paintPlanks(ctx: CanvasRenderingContext2D, size: number, base: string, gap: string) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = gap;
  for (let y = 0; y < size; y += 24) ctx.fillRect(0, y, size, 2);
  for (let y = 0; y < size; y += 24) {
    const off = Math.random() * size;
    ctx.fillRect(off, y, 2, 24);
  }
  speckle(ctx, size, gap, 400, 2);
}

interface FloorMaterials {
  wall: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
}

function makeMaterials(): FloorMaterials[] {
  const mat = (tex: THREE.CanvasTexture, rough = 0.95) =>
    new THREE.MeshStandardMaterial({ map: tex, roughness: rough, metalness: 0 });

  const concreteWall = mat(canvasTexture(256, paintConcrete, 2, 1.5));
  const concreteFloor = mat(canvasTexture(256, paintConcrete, 8, 8));
  const mainWall = mat(canvasTexture(256, paintMainWallpaper, 2, 1.5));
  const woodFloor = mat(
    canvasTexture(256, (c, s) => paintPlanks(c, s, '#6e5840', '#4a3a28'), 8, 8)
  );
  const bedWall = mat(canvasTexture(256, paintBedroomWallpaper, 2, 1.5));
  const woodFloor2 = mat(
    canvasTexture(256, (c, s) => paintPlanks(c, s, '#75604a', '#503f2d'), 8, 8)
  );
  const atticWall = mat(canvasTexture(256, (c, s) => paintPlanks(c, s, '#5c4a36', '#3c2f21'), 2, 1.5));
  const atticFloor = mat(
    canvasTexture(256, (c, s) => paintPlanks(c, s, '#544433', '#382c1f'), 8, 8)
  );
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b2622, roughness: 1 });

  return [
    { wall: concreteWall, floor: concreteFloor, ceiling: dark },
    { wall: mainWall, floor: woodFloor, ceiling: dark },
    { wall: bedWall, floor: woodFloor2, ceiling: dark },
    { wall: atticWall, floor: atticFloor, ceiling: dark },
  ];
}

export interface BuiltWorld {
  group: THREE.Group;
  colliders: ColliderSet;
  /** Cells with a hole in this floor's slab (stair runs above, chute mouths). */
  slabHoles: Set<string>[];
  /** "floor:x,z" cells filled by solid props — excluded from enemy navigation. */
  solidCells: Set<string>;
  windowPanes: THREE.Mesh[];
  markerWorld(pos: { floor: number; x: number; z: number }, height?: number): THREE.Vector3;
  floorIndexOfY(y: number): number;
}

export class HouseBuilder {
  static build(house: House): BuiltWorld {
    const group = new THREE.Group();
    const colliders = new ColliderSet();
    const mats = makeMaterials();
    const windowPanes: THREE.Mesh[] = [];

    // ---- Slab holes per floor (stair runs open the UPPER floor's slab;
    // chute mouths open their own floor's slab).
    const slabHoles: Set<string>[] = house.grids.map(() => new Set<string>());
    for (const stair of house.stairs) {
      for (const c of stair.cells) slabHoles[stair.upper].add(`${c.x},${c.z}`);
    }
    for (const chute of house.chutes) {
      slabHoles[chute.from.floor].add(`${chute.from.x},${chute.from.z}`);
    }

    house.grids.forEach((grid, f) => {
      const y0 = floorY(f);
      const floorGroup = new THREE.Group();
      floorGroup.name = `floor-${f}`;
      const m = mats[f];

      // ---- Floor slabs: merge horizontal runs of non-void, non-hole cells.
      for (let z = 0; z < house.depth; z++) {
        let runStart = -1;
        for (let x = 0; x <= house.width; x++) {
          const inRun =
            x < house.width && grid[z][x] !== 'void' && !slabHoles[f].has(`${x},${z}`);
          if (inRun && runStart < 0) runStart = x;
          if (!inRun && runStart >= 0) {
            const x0 = runStart * CELL_SIZE;
            const x1 = x * CELL_SIZE;
            const z0 = z * CELL_SIZE;
            const z1 = (z + 1) * CELL_SIZE;
            const mesh = new THREE.Mesh(
              new THREE.BoxGeometry(x1 - x0, SLAB_THICKNESS, z1 - z0),
              m.floor
            );
            mesh.position.set((x0 + x1) / 2, y0 - SLAB_THICKNESS / 2, (z0 + z1) / 2);
            mesh.receiveShadow = true;
            floorGroup.add(mesh);
            colliders.add(aabb(x0, y0 - SLAB_THICKNESS, z0, x1, y0, z1));
            runStart = -1;
          }
        }
      }

      // ---- Ceilings (visual only): full footprint, skipping holes of the floor above.
      const above = f + 1 < house.grids.length ? slabHoles[f + 1] : null;
      for (let z = 0; z < house.depth; z++) {
        let runStart = -1;
        for (let x = 0; x <= house.width; x++) {
          const hole = above?.has(`${x},${z}`) ?? false;
          const inRun = x < house.width && grid[z][x] !== 'void' && !hole;
          if (inRun && runStart < 0) runStart = x;
          if (!inRun && runStart >= 0) {
            const x0 = runStart * CELL_SIZE;
            const x1 = x * CELL_SIZE;
            const mesh = new THREE.Mesh(
              new THREE.BoxGeometry(x1 - x0, 0.1, CELL_SIZE),
              m.ceiling
            );
            mesh.position.set((x0 + x1) / 2, y0 + WALL_HEIGHT + 0.05, (z + 0.5) * CELL_SIZE);
            floorGroup.add(mesh);
            runStart = -1;
          }
        }
      }

      // ---- Walls: merge horizontal runs of plain wall cells. Door, vent and
      // lone cells handled separately.
      for (let z = 0; z < house.depth; z++) {
        let runStart = -1;
        for (let x = 0; x <= house.width; x++) {
          const isWall = x < house.width && grid[z][x] === 'wall';
          if (isWall && runStart < 0) runStart = x;
          if (!isWall && runStart >= 0) {
            const x0 = runStart * CELL_SIZE;
            const x1 = x * CELL_SIZE;
            const z0 = z * CELL_SIZE;
            const z1 = (z + 1) * CELL_SIZE;
            const mesh = new THREE.Mesh(
              new THREE.BoxGeometry(x1 - x0, WALL_HEIGHT, z1 - z0),
              m.wall
            );
            mesh.position.set((x0 + x1) / 2, y0 + WALL_HEIGHT / 2, (z0 + z1) / 2);
            mesh.castShadow = mesh.receiveShadow = true;
            floorGroup.add(mesh);
            colliders.add(aabb(x0, y0, z0, x1, y0 + WALL_HEIGHT, z1));
            runStart = -1;
          }
        }
      }

      // ---- Door lintels and vent bores (cells inside wall lines).
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          const kind = grid[z][x];
          const { x: wx, z: wz } = cellToWorld(x, z);
          if (kind === 'door') {
            const lintel = new THREE.Mesh(
              new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT - DOOR_HEADER, CELL_SIZE),
              m.wall
            );
            lintel.position.set(wx, y0 + DOOR_HEADER + (WALL_HEIGHT - DOOR_HEADER) / 2, wz);
            lintel.castShadow = true;
            floorGroup.add(lintel);
            colliders.add(
              aabb(
                x * CELL_SIZE,
                y0 + DOOR_HEADER,
                z * CELL_SIZE,
                (x + 1) * CELL_SIZE,
                y0 + WALL_HEIGHT,
                (z + 1) * CELL_SIZE
              )
            );
          } else if (kind === 'vent') {
            // Wall above the crawl gap; grate look comes from the prop pass.
            const upper = new THREE.Mesh(
              new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT - VENT_CLEARANCE, CELL_SIZE),
              m.wall
            );
            upper.position.set(wx, y0 + VENT_CLEARANCE + (WALL_HEIGHT - VENT_CLEARANCE) / 2, wz);
            upper.castShadow = true;
            floorGroup.add(upper);
            colliders.add(
              aabb(
                x * CELL_SIZE,
                y0 + VENT_CLEARANCE,
                z * CELL_SIZE,
                (x + 1) * CELL_SIZE,
                y0 + WALL_HEIGHT,
                (z + 1) * CELL_SIZE
              )
            );
          }
        }
      }

      // ---- Windows: dim moonlit panes on exterior walls (main + upstairs).
      if (f === 1 || f === 2) {
        const paneMat = new THREE.MeshStandardMaterial({
          color: 0x33405e,
          emissive: 0x22304d,
          emissiveIntensity: 0.9,
          roughness: 0.4,
        });
        for (let x = 2; x < house.width - 2; x += 4) {
          for (const [z, dz] of [
            [0, 1],
            [house.depth - 1, -1],
          ] as const) {
            if (grid[z][x] !== 'wall') continue;
            const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.2), paneMat);
            const { x: wx, z: wz } = cellToWorld(x, z);
            pane.position.set(wx, y0 + 1.7, wz + dz * (CELL_SIZE / 2 + 0.02));
            if (dz < 0) pane.rotation.y = Math.PI;
            floorGroup.add(pane);
            windowPanes.push(pane);
          }
        }
      }

      group.add(floorGroup);
    });

    // ---- Stairs: the run's first cell is a flat landing at the lower floor
    // level (so the climb is enterable from its side cells); the remaining
    // cells carry the step boxes up to the upper floor.
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x4f3f2e, roughness: 0.9 });
    for (const stair of house.stairs) {
      const yLow = floorY(stair.lower);
      const rise = FLOOR_SPACING;
      const steps = Math.ceil(rise / STEP_RISE); // 14
      const first = stair.cells[1];
      const last = stair.cells[stair.cells.length - 1];
      const a = cellToWorld(first.x, first.z);
      const b = cellToWorld(last.x, last.z);
      // Run direction and span (cells are colinear).
      const dirX = Math.sign(b.x - a.x);
      const dirZ = Math.sign(b.z - a.z);
      const runLen = CELL_SIZE * (stair.cells.length - 1);
      const depth = runLen / steps;
      const startX = a.x - (dirX * CELL_SIZE) / 2;
      const startZ = a.z - (dirZ * CELL_SIZE) / 2;
      for (let i = 0; i < steps; i++) {
        const h = (i + 1) * STEP_RISE;
        const cx = startX + dirX * depth * (i + 0.5);
        const cz = startZ + dirZ * depth * (i + 0.5);
        // Narrow tread: keeps climbers centered in the stairwell hole so a
        // standing head never clips the slab edge beside the well.
        const w = dirX !== 0 ? depth : CELL_SIZE * 0.7;
        const d = dirZ !== 0 ? depth : CELL_SIZE * 0.7;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stepMat);
        mesh.position.set(cx, yLow + h / 2, cz);
        mesh.castShadow = mesh.receiveShadow = true;
        group.add(mesh);
        colliders.add(aabb(cx - w / 2, yLow, cz - d / 2, cx + w / 2, yLow + h, cz + d / 2));
      }
    }

    // ---- Stairwell railings: on the upper floor, every run cell except the
    // top landing rails off adjacent walkable cells so nobody strolls into
    // the open well from the side.
    const railMat = new THREE.MeshStandardMaterial({ color: 0x4a3828, roughness: 0.8 });
    for (const stair of house.stairs) {
      const upperGrid = house.grids[stair.upper];
      const yTop = floorY(stair.upper);
      const runKey = new Set(stair.cells.map((c) => `${c.x},${c.z}`));
      const last = stair.cells[stair.cells.length - 1];
      for (const c of stair.cells) {
        if (c.x === last.x && c.z === last.z) continue; // top landing stays open
        for (const [dx, dz] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nx = c.x + dx;
          const nz = c.z + dz;
          if (nx < 0 || nz < 0 || nx >= house.width || nz >= house.depth) continue;
          if (runKey.has(`${nx},${nz}`)) continue;
          const nKind = upperGrid[nz][nx];
          if (nKind === 'wall' || nKind === 'void') continue;
          // Railing along the shared edge.
          const { x: wx, z: wz } = cellToWorld(c.x, c.z);
          const ex = wx + (dx * CELL_SIZE) / 2;
          const ez = wz + (dz * CELL_SIZE) / 2;
          const w = dx !== 0 ? 0.08 : CELL_SIZE;
          const d = dz !== 0 ? 0.08 : CELL_SIZE;
          const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 1.0, d), railMat);
          rail.position.set(ex, yTop + 0.5, ez);
          rail.castShadow = true;
          group.add(rail);
          colliders.add(
            aabb(ex - w / 2, yTop, ez - d / 2, ex + w / 2, yTop + 1.0, ez + d / 2)
          );
        }
      }
    }

    // ---- Chute mouths: visible rim so the hole reads as a hatch.
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.6, metalness: 0.4 });
    for (const chute of house.chutes) {
      const { x: wx, z: wz } = cellToWorld(chute.from.x, chute.from.z);
      const y0 = floorY(chute.from.floor);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(CELL_SIZE, 0.12, CELL_SIZE), rimMat);
      // Frame look: shrink inner by leaving 4 edge bars.
      rim.scale.set(1, 1, 0.12);
      rim.position.set(wx, y0 + 0.06, wz - CELL_SIZE / 2 + 0.12);
      group.add(rim.clone());
      const rim2 = rim.clone();
      rim2.position.set(wx, y0 + 0.06, wz + CELL_SIZE / 2 - 0.12);
      group.add(rim2);
      const rim3 = rim.clone();
      rim3.rotation.y = Math.PI / 2;
      rim3.position.set(wx - CELL_SIZE / 2 + 0.12, y0 + 0.06, wz);
      group.add(rim3);
      const rim4 = rim.clone();
      rim4.rotation.y = Math.PI / 2;
      rim4.position.set(wx + CELL_SIZE / 2 - 0.12, y0 + 0.06, wz);
      group.add(rim4);
    }

    // ---- Props: landmark placements + hiding-host furniture from markers.
    const solidCells = new Set<string>();
    const placements = [
      ...PROP_PLACEMENTS,
      ...house.hidingSpots.map((h) => ({ pos: h.pos, kind: hidingHostKind(h.kind), rot: 0 })),
    ];
    for (const placement of placements) {
      const built = buildProp(placement);
      group.add(built.group);
      colliders.addAll(built.colliders);
      if (built.solid) {
        solidCells.add(`${placement.pos.floor}:${placement.pos.x},${placement.pos.z}`);
      }
    }

    // ---- Vent grates: visual slatted frames at each bore cell's open faces.
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x55584f, roughness: 0.5, metalness: 0.5 });
    for (const vent of house.vents) {
      for (const c of vent.cells) {
        const { x: wx, z: wz } = cellToWorld(c.x, c.z);
        const y0 = floorY(vent.floor);
        const frame = new THREE.Group();
        for (let i = 0; i < 4; i++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.04), grateMat);
          slat.position.set(0, 0.25 + i * 0.22, 0);
          frame.add(slat);
        }
        // Orient the grate across the bore (wall runs along one axis; the
        // open faces are along the other — detect from neighbor walls).
        const grid = house.grids[vent.floor];
        const wallEastWest =
          grid[c.z][c.x - 1] === 'wall' || grid[c.z][c.x + 1] === 'wall';
        if (!wallEastWest) frame.rotation.y = Math.PI / 2;
        frame.position.set(wx, y0, wz);
        group.add(frame);
      }
    }

    return {
      group,
      colliders,
      slabHoles,
      solidCells,
      windowPanes,
      markerWorld(pos, height = 0) {
        const { x, z } = cellToWorld(pos.x, pos.z);
        return new THREE.Vector3(x, floorY(pos.floor) + height, z);
      },
      floorIndexOfY(y: number) {
        return Math.max(0, Math.min(3, Math.round(y / FLOOR_SPACING)));
      },
    };
  }
}

export { worldToCell };
