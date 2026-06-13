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

/** Dark scuff streaks + a few gouges/stains — wear on a wood floor. */
function scuffs(ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = '#2c2118';
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 6 + Math.random() * 30;
    const a = (Math.random() - 0.5) * 0.5; // mostly along the grain
    ctx.globalAlpha = 0.05 + Math.random() * 0.18;
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  // Occasional dark stain blotches.
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#3a2c1d';
    ctx.globalAlpha = 0.1 + Math.random() * 0.14;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * size,
      Math.random() * size,
      6 + Math.random() * 16,
      5 + Math.random() * 12,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** A peeled/torn wallpaper patch revealing a darker layer beneath. */
function tornPatch(ctx: CanvasRenderingContext2D, size: number, under: string) {
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = 16 + Math.random() * 36;
    const h = 22 + Math.random() * 48;
    ctx.fillStyle = under;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    // Ragged torn edge: a jittered polygon.
    const steps = 10;
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2;
      const rr = 0.5 + Math.random() * 0.5;
      const px = x + Math.cos(t) * w * 0.5 * rr;
      const py = y + Math.sin(t) * h * 0.5 * rr;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    // A curled lighter edge along the top of the tear.
    ctx.strokeStyle = '#9c917c';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function paintConcrete(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#5a5d58';
  ctx.fillRect(0, 0, size, size);
  speckle(ctx, size, '#454843', 900, 3);
  speckle(ctx, size, '#6d706a', 500, 2);
  speckle(ctx, size, '#3a3e3a', 250, 4);
  waterDamage(ctx, size);
}

/** Damp, neglected concrete: dark water blooms, efflorescence rings, drips. */
function waterDamage(ctx: CanvasRenderingContext2D, size: number) {
  // Irregular dark blooms with a slightly darker core.
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 14 + Math.random() * 40;
    const grd = ctx.createRadialGradient(x, y, 1, x, y, r);
    grd.addColorStop(0, 'rgba(38,46,44,0.42)');
    grd.addColorStop(0.6, 'rgba(44,52,50,0.22)');
    grd.addColorStop(1, 'rgba(58,62,58,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // Pale efflorescence ring at the bloom edge.
    ctx.strokeStyle = 'rgba(150,156,148,0.18)';
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r * (0.7 + Math.random() * 0.2), 0, Math.PI * 2);
    ctx.stroke();
  }
  // Vertical drip streaks (read as wall runoff).
  ctx.strokeStyle = 'rgba(34,40,38,0.3)';
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * size;
    const y0 = Math.random() * size * 0.4;
    ctx.lineWidth = 0.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y0 + 20 + Math.random() * 60);
    ctx.stroke();
  }
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
  tornPatch(ctx, size, '#544a3b'); // peeled sections revealing the layer beneath
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
  tornPatch(ctx, size, '#5b5054');
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
  scuffs(ctx, size); // marks + gouges + stains
}

/** A radial spider-web (transparent background) for attic cobwebs. */
function paintCobweb(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const c = size / 2;
  ctx.strokeStyle = 'rgba(228,228,222,0.55)';
  ctx.lineWidth = 1.2;
  const spokes = 9;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(a) * c, c + Math.sin(a) * c);
    ctx.stroke();
  }
  for (let r = c * 0.18; r < c; r += c * 0.16) {
    ctx.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const a = (i / spokes) * Math.PI * 2;
      const jr = r * (0.9 + Math.random() * 0.16);
      const px = c + Math.cos(a) * jr;
      const py = c + Math.sin(a) * jr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
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
  /** Flickering fixture bulbs + closet-door swings: call per frame. */
  updateFixtures(dt: number): void;
  markerWorld(pos: { floor: number; x: number; z: number }, height?: number): THREE.Vector3;
  floorIndexOfY(y: number): number;
  /** Swing a closet door open (a hunting enemy checking the closet). */
  openCloset(pos: { floor: number; x: number; z: number }): void;
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
    const closetDoors = new Map<string, { pivot: THREE.Object3D; angle: number; target: number }>();
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
      if (built.door) {
        closetDoors.set(`${placement.pos.floor}:${placement.pos.x},${placement.pos.z}`, {
          pivot: built.door,
          angle: 0,
          target: 0,
        });
      }
    }

    // Vent grilles (the louvred, openable fold-up covers) are owned by the
    // passage system — see SecretPassage.ts — so each bore cell's grille is the
    // same object that animates open. No static grate frames are built here.

    // ---- Attic cobwebs: translucent webs tucked into ceiling corners and
    // rafters. Purely decorative — no colliders, never block pathing/sight.
    const atticFloorIdx = house.grids.length - 1;
    const webTex = canvasTexture(128, paintCobweb);
    const webMat = new THREE.MeshBasicMaterial({
      map: webTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const atticY = floorY(atticFloorIdx);
    const ceil = atticY + WALL_HEIGHT;
    const centerX = (house.width / 2) * CELL_SIZE;
    const centerZ = (house.depth / 2) * CELL_SIZE;
    // Corner webs (cell coords) angled across the wall/ceiling junction to face
    // the room, plus a couple smaller rafter webs.
    const webSpots: { x: number; z: number; size: number }[] = [
      { x: 1.4, z: 1.4, size: 1.6 },
      { x: 13.6, z: 1.4, size: 1.5 },
      { x: 1.4, z: 13.6, size: 1.4 },
      { x: 13.6, z: 13.6, size: 1.7 },
      { x: 7, z: 2, size: 1.0 },
      { x: 4.5, z: 8, size: 0.9 },
      { x: 10.5, z: 11, size: 1.2 },
    ];
    for (const s of webSpots) {
      const web = new THREE.Mesh(new THREE.PlaneGeometry(s.size, s.size), webMat);
      const wx = s.x * CELL_SIZE;
      const wz = s.z * CELL_SIZE;
      // Face the room center, tucked high and tilted down like a hanging web.
      web.position.set(wx, ceil - 0.5, wz);
      web.rotation.y = Math.atan2(centerX - wx, centerZ - wz);
      web.rotation.x = 0.5; // tilt the top back into the corner
      group.add(web);
    }

    // ---- Moonlight pools: small cool lights at a few windows (no shadows).
    const moonPositions = [
      { floor: 1, x: 6, z: 0.6 }, // back hall window
      { floor: 1, x: 6, z: 13.4 }, // foyer-side front window
      { floor: 2, x: 10, z: 0.6 }, // master window
      { floor: 2, x: 10, z: 13.4 }, // playroom window
    ];
    for (const m of moonPositions) {
      const light = new THREE.PointLight(0x4a5d8a, 3.2, 7, 1.8);
      const { x, z } = cellToWorld(m.x, Math.round(m.z));
      light.position.set(x, floorY(m.floor) + 2.0, m.z < 7 ? z + 1 : z - 1);
      group.add(light);
    }

    // ---- Flickering fixtures: bare bulbs in basement hall and attic.
    const fixtures: { light: THREE.PointLight; bulb: THREE.Mesh; phase: number; drop: number }[] =
      [];
    const fixtureSpots = [
      { floor: 0, x: 7, z: 5 },
      { floor: 3, x: 7, z: 6 },
    ];
    for (const spot of fixtureSpots) {
      const { x, z } = cellToWorld(spot.x, spot.z);
      const y = floorY(spot.floor) + WALL_HEIGHT - 0.35;
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0x886622,
        emissive: 0xcc9944,
        emissiveIntensity: 1.4,
      });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), bulbMat);
      bulb.position.set(x, y, z);
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
      );
      cord.position.set(x, y + 0.2, z);
      const light = new THREE.PointLight(0xcc9944, 4.5, 9, 1.6);
      light.position.set(x, y - 0.1, z);
      group.add(bulb, cord, light);
      fixtures.push({ light, bulb, phase: 0, drop: 1 });
    }

    return {
      group,
      colliders,
      slabHoles,
      solidCells,
      windowPanes,
      updateFixtures(dt: number) {
        for (const fx of fixtures) {
          fx.phase -= dt;
          if (fx.phase <= 0) {
            fx.phase = 0.08 + Math.random() * 0.7;
            fx.drop = Math.random() < 0.25 ? 0.1 + Math.random() * 0.5 : 1;
          }
          fx.light.intensity = 4.5 * fx.drop;
          (fx.bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4 * fx.drop;
        }
        // Closet doors ease toward their target swing angle.
        for (const d of closetDoors.values()) {
          if (Math.abs(d.target - d.angle) < 0.001) continue;
          d.angle += (d.target - d.angle) * Math.min(1, 10 * dt);
          d.pivot.rotation.y = d.angle;
        }
      },
      markerWorld(pos, height = 0) {
        const { x, z } = cellToWorld(pos.x, pos.z);
        return new THREE.Vector3(x, floorY(pos.floor) + height, z);
      },
      floorIndexOfY(y: number) {
        return Math.max(0, Math.min(3, Math.round(y / FLOOR_SPACING)));
      },
      openCloset(pos) {
        const d = closetDoors.get(`${pos.floor}:${pos.x},${pos.z}`);
        if (d) d.target = Math.PI * 0.62; // swing wide open
      },
    };
  }
}

export { worldToCell };
