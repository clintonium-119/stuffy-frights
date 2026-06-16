import * as THREE from 'three';
import { ColliderSet, aabb } from '../core/Collision';
import {
  CELL_SIZE,
  FLOOR_SPACING,
  WALL_HEIGHT,
  House,
  CellKind,
  EdgeState,
  Stair,
  Chute,
  cellToWorld,
  floorY,
  worldToCell,
  isWalkable,
} from './layoutTypes';
import { UPSCALE } from './houseLayout';
import { PROP_PLACEMENTS, buildProp, hidingHostKind } from './Props';
import { pbrMaterial } from './materialLibrary';
import { config } from '../core/config';

const SLAB_THICKNESS = 0.25;
const VENT_CLEARANCE = 1.1; // crawl height under a bored wall
const DOOR_HEADER = 2.2; // lintel underside
const STEP_RISE = 0.25;
/** Thin wall thickness, centred on the cell boundary so both adjacent cells keep
 *  full floor area. Runs are extended half this at each end so perpendicular runs
 *  overlap at corners (no gap, no coplanar z-fighting). */
const WALL_THICKNESS = 0.15;
/** World metres per PBR texture tile. Tiling is baked into per-mesh UVs so one
 *  shared material tiles correctly across merged runs of any size. */
const TILE = 2.5;

/**
 * Scale a box geometry's UVs so its bundled PBR texture tiles at world scale
 * (su tiles across the seen face's width, sv across its height/depth). All maps —
 * including AO — share this primary UV set (see materialLibrary aoMap.channel).
 * Returns the same geometry for chaining.
 */
function tileBox(geo: THREE.BoxGeometry, su: number, sv: number): THREE.BoxGeometry {
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  uv.needsUpdate = true;
  return geo;
}

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

/** Base self-glow of a window pane in the dark (a faint stormy beacon). */
/** The window "outside" view, unlit: dark rainy night, blazing on a lightning flash. */
const WINDOW_NIGHT = new THREE.Color(0x0c1424);
const WINDOW_FLASH = new THREE.Color(0xbcc8e6);

/** Translucent rain streaks (transparent background) scrolled down the glass. */
function paintRain(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(178,198,228,1)';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 7 + Math.random() * 22;
    ctx.globalAlpha = 0.1 + Math.random() * 0.28;
    ctx.lineWidth = 0.5 + Math.random() * 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 2.5, y + len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** A faint distant skyline (rooftops + a few trees) silhouetted along the bottom,
 *  transparent above the horizon — the dark "outside" seen through the window. */
function paintSkyline(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const horizon = size * 0.62;
  ctx.fillStyle = '#04060c';
  // Blocky rooftops of varying height down to the bottom edge.
  let x = -size * 0.05;
  while (x < size) {
    const w = size * 0.05 + Math.random() * size * 0.11;
    const h = size * 0.06 + Math.random() * size * 0.26;
    ctx.fillRect(x, horizon - h, w + 1, size - (horizon - h));
    x += w + size * 0.006;
  }
  // A couple of spiky conifer silhouettes breaking the roofline.
  for (let t = 0; t < 3; t++) {
    const tx = size * (0.15 + Math.random() * 0.7);
    const th = size * 0.16 + Math.random() * size * 0.14;
    const tw = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(tx - tw, horizon);
    ctx.lineTo(tx, horizon - th);
    ctx.lineTo(tx + tw, horizon);
    ctx.closePath();
    ctx.fill();
  }
  // A few faint warm-lit windows dotted in the far rooftops (a little life).
  ctx.fillStyle = 'rgba(190,150,80,0.4)';
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(Math.random() * size, horizon - Math.random() * size * 0.18, 2, 3);
  }
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
  // Bundled CC0 PBR materials (see materialLibrary + public/textures/CREDITS.md).
  // Tiling is baked into per-mesh UVs (see tileBox), so each material uses the
  // default repeat and is shared across every floor that references it.
  const plaster = pbrMaterial('plaster');
  const woodFloor = pbrMaterial('woodfloor');
  const ceiling = pbrMaterial('ceiling', { roughness: 1 });
  const concreteWall = pbrMaterial('concretewall');
  const concreteFloor = pbrMaterial('concretefloor');
  const atticWood = pbrMaterial('woodprop');
  // Upstairs reads a touch cooler/lighter than the main floor to keep rooms distinct.
  const plasterUp = pbrMaterial('plaster', { color: 0xcdd2d6 });

  return [
    { wall: concreteWall, floor: concreteFloor, ceiling: concreteWall }, // basement
    { wall: plaster, floor: woodFloor, ceiling }, // main
    { wall: plasterUp, floor: woodFloor, ceiling }, // upstairs
    { wall: atticWood, floor: atticWood, ceiling: atticWood }, // attic (raw timber)
  ];
}

/**
 * A merged run of collinear, same-state renderable edges (`wall | door |
 * secret`). `axis:'v'` runs along Z on the vertical boundary east of column `b`
 * (between columns `b` and `b+1`); `axis:'h'` runs along X on the horizontal
 * boundary south of row `b`. `i0..i1` is the inclusive cell-index span along the
 * run (z for `v`, x for `h`).
 */
export interface EdgeRun {
  axis: 'v' | 'h';
  b: number;
  i0: number;
  i1: number;
  state: EdgeState;
}

const RENDERABLE_EDGE = (e: EdgeState): boolean =>
  e === 'wall' || e === 'door' || e === 'secret';

/**
 * Merge a floor's renderable edges (`wall`/`door`/`secret`) into collinear
 * same-state runs for thin geometry. Only edges that border at least one
 * walkable cell are emitted: the authored mansion has no wall cells, so every
 * such edge already faces floor; the transitional legacy house has block-thick
 * wall regions whose interior edges face no walkable cell and are skipped,
 * leaving just the room-facing faces. A run breaks where the edge state changes
 * or an edge isn't renderable (so a wall→door→wall line splits into three runs).
 */
export function edgeRuns(
  edgesV: EdgeState[][],
  edgesH: EdgeState[][],
  grid: CellKind[][],
  width: number,
  depth: number
): EdgeRun[] {
  const runs: EdgeRun[] = [];
  // Vertical boundaries (between columns x and x+1): merge along z.
  for (let x = 0; x < width - 1; x++) {
    let cur: EdgeState = 'none';
    let start = -1;
    for (let z = 0; z <= depth; z++) {
      const e =
        z < depth && (isWalkable(grid[z][x]) || isWalkable(grid[z][x + 1]))
          ? edgesV[z][x]
          : 'none';
      const on = RENDERABLE_EDGE(e);
      if (start >= 0 && (!on || e !== cur)) {
        runs.push({ axis: 'v', b: x, i0: start, i1: z - 1, state: cur });
        start = -1;
      }
      if (on && start < 0) {
        cur = e;
        start = z;
      }
    }
  }
  // Horizontal boundaries (between rows z and z+1): merge along x.
  for (let z = 0; z < depth - 1; z++) {
    let cur: EdgeState = 'none';
    let start = -1;
    for (let x = 0; x <= width; x++) {
      const e =
        x < width && (isWalkable(grid[z][x]) || isWalkable(grid[z + 1][x]))
          ? edgesH[z][x]
          : 'none';
      const on = RENDERABLE_EDGE(e);
      if (start >= 0 && (!on || e !== cur)) {
        runs.push({ axis: 'h', b: z, i0: start, i1: x - 1, state: cur });
        start = -1;
      }
      if (on && start < 0) {
        cur = e;
        start = x;
      }
    }
  }
  return runs;
}

/**
 * Cells whose floor slab is punched out, one set per floor (`"x,z"` keys). A
 * stair run opens the UPPER floor's slab (the stairwell opening you can see and
 * fall through); a chute mouth opens its own floor's slab. Sized to the house's
 * floor count, so it scales to any number of levels.
 */
export function slabHoleSet(floorCount: number, stairs: Stair[], chutes: Chute[]): Set<string>[] {
  const holes: Set<string>[] = Array.from({ length: floorCount }, () => new Set<string>());
  for (const stair of stairs) {
    for (const c of stair.cells) holes[stair.upper].add(`${c.x},${c.z}`);
  }
  for (const chute of chutes) {
    holes[chute.from.floor].add(`${chute.from.x},${chute.from.z}`);
  }
  return holes;
}

export interface BuiltWorld {
  group: THREE.Group;
  colliders: ColliderSet;
  /** Cells with a hole in this floor's slab (stair runs above, chute mouths). */
  slabHoles: Set<string>[];
  /** "floor:x,z" cells filled by solid props — excluded from enemy navigation. */
  solidCells: Set<string>;
  windowPanes: THREE.Mesh[];
  /** World positions of every window (for rain-proximity audio). */
  windowWorldPositions: THREE.Vector3[];
  /** Flickering fixture bulbs + closet-door swings: call per frame. */
  updateFixtures(dt: number): void;
  /** Scroll the rain on the glass and blaze the panes on a lightning flash (0..1). */
  updateWindows(dt: number, flash: number): void;
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
    const windowWorldPositions: THREE.Vector3[] = [];
    const windowLights: THREE.PointLight[] = []; // per-window lightning spill
    // Shared scrolling rain texture + overlay material for all window glass.
    const rainTex = canvasTexture(128, paintRain, 1, 2);
    const rainMat = new THREE.MeshBasicMaterial({
      map: rainTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    // Shared faint skyline silhouette behind the rain (the dark outside view).
    const skylineMat = new THREE.MeshBasicMaterial({
      map: canvasTexture(256, paintSkyline, 1, 1),
      transparent: true,
      depthWrite: false,
    });

    // ---- Slab holes per floor (stair runs open the UPPER floor's slab;
    // chute mouths open their own floor's slab).
    const slabHoles = slabHoleSet(house.grids.length, house.stairs, house.chutes);

    house.grids.forEach((grid, f) => {
      const y0 = floorY(f);
      const floorGroup = new THREE.Group();
      floorGroup.name = `floor-${f}`;
      // Floors beyond the named legacy themes reuse the topmost (attic) theme,
      // so any floor count renders without an out-of-range material.
      const m = mats[Math.min(f, mats.length - 1)];

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
              tileBox(new THREE.BoxGeometry(x1 - x0, SLAB_THICKNESS, z1 - z0), (x1 - x0) / TILE, (z1 - z0) / TILE),
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
              tileBox(new THREE.BoxGeometry(x1 - x0, 0.1, CELL_SIZE), (x1 - x0) / TILE, CELL_SIZE / TILE),
              m.ceiling
            );
            mesh.position.set((x0 + x1) / 2, y0 + WALL_HEIGHT + 0.05, (z + 0.5) * CELL_SIZE);
            floorGroup.add(mesh);
            runStart = -1;
          }
        }
      }

      // ---- Walls / doors / secret doors: thin segments on the cell edges
      // (walls-as-edges), collinear same-state runs merged into one slab each,
      // centred on the boundary. A `wall`/`secret` run is a full-height slab (a
      // secret door is flush wall material — indistinguishable until discovered);
      // a `door` run is just the header above the opening, leaving the doorway
      // clear below. Runs are extended half a thickness at each end so
      // perpendicular runs join cleanly at corners.
      const t = WALL_THICKNESS;
      for (const run of edgeRuns(house.edgesV[f], house.edgesH[f], grid, house.width, house.depth)) {
        let cx: number, cz: number, w: number, d: number, len: number;
        if (run.axis === 'v') {
          const bx = (run.b + 1) * CELL_SIZE; // boundary plane
          const za = run.i0 * CELL_SIZE - t / 2;
          const zb = (run.i1 + 1) * CELL_SIZE + t / 2;
          len = (run.i1 - run.i0 + 1) * CELL_SIZE;
          cx = bx;
          cz = (za + zb) / 2;
          w = t;
          d = zb - za;
        } else {
          const bz = (run.b + 1) * CELL_SIZE;
          const xa = run.i0 * CELL_SIZE - t / 2;
          const xb = (run.i1 + 1) * CELL_SIZE + t / 2;
          len = (run.i1 - run.i0 + 1) * CELL_SIZE;
          cx = (xa + xb) / 2;
          cz = bz;
          w = xb - xa;
          d = t;
        }
        // Doors render only the header; walls/secret span the full height.
        const yBase = run.state === 'door' ? y0 + DOOR_HEADER : y0;
        const height = run.state === 'door' ? WALL_HEIGHT - DOOR_HEADER : WALL_HEIGHT;
        const mesh = new THREE.Mesh(
          tileBox(new THREE.BoxGeometry(w, height, d), len / TILE, height / TILE),
          m.wall
        );
        mesh.position.set(cx, yBase + height / 2, cz);
        mesh.castShadow = mesh.receiveShadow = true;
        floorGroup.add(mesh);
        colliders.add(aabb(cx - w / 2, yBase, cz - d / 2, cx + w / 2, yBase + height, cz + d / 2));
      }

      // ---- Vent bores (cells inside wall lines). Doors are rendered as `door`
      // edge headers above (walls-as-edges); only the crawl-vent geometry is
      // cell-based, since a vent is a 1-cell tunnel through a wall.
      for (let z = 0; z < house.depth; z++) {
        for (let x = 0; x < house.width; x++) {
          const kind = grid[z][x];
          const { x: wx, z: wz } = cellToWorld(x, z);
          if (kind === 'vent') {
            // Wall above the crawl gap; grate look comes from the prop pass.
            const upper = new THREE.Mesh(
              tileBox(new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT - VENT_CLEARANCE, CELL_SIZE), CELL_SIZE / TILE, (WALL_HEIGHT - VENT_CLEARANCE) / TILE),
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

      group.add(floorGroup);
    });

    // ---- Windows (data-driven, any floor): a separate UNLIT "night view" — a
    // dark, opaque pane that ignores the interior flashlight and occludes the
    // wall behind, so it reads as looking out at a rainy night (not a translucent
    // panel on a lit wall). Rain streaks scroll in front; the view blazes on a
    // lightning flash (colour, not lighting). Each window sits on an exterior
    // wall edge and faces whichever side is walkable (the room). See `house.windows`.
    const WIN_W = 1.0;
    const WIN_H = 1.2;
    for (const win of house.windows) {
      const grid = house.grids[win.floor];
      if (!grid) continue;
      const y = floorY(win.floor) + 1.7;
      // Boundary plane (bx,bz) + inward unit normal (nx,nz) toward the room.
      let bx: number, bz: number, nx: number, nz: number, rotY: number;
      if (win.edge === 'h') {
        const roomOnPlus = isWalkable(grid[win.z + 1]?.[win.x] ?? 'void');
        bx = (win.x + 0.5) * CELL_SIZE;
        bz = (win.z + 1) * CELL_SIZE;
        nx = 0;
        nz = roomOnPlus ? 1 : -1;
        rotY = roomOnPlus ? 0 : Math.PI;
      } else {
        const roomOnPlus = isWalkable(grid[win.z]?.[win.x + 1] ?? 'void');
        bx = (win.x + 1) * CELL_SIZE;
        bz = (win.z + 0.5) * CELL_SIZE;
        nx = roomOnPlus ? 1 : -1;
        nz = 0;
        rotY = roomOnPlus ? Math.PI / 2 : -Math.PI / 2;
      }
      // Each window owns its own unlit material so it can flash independently.
      const paneMat = new THREE.MeshBasicMaterial({ color: WINDOW_NIGHT.clone() });
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), paneMat);
      pane.position.set(bx + nx * 0.02, y, bz + nz * 0.02); // hides the wall
      pane.rotation.y = rotY;
      group.add(pane);
      windowPanes.push(pane);
      windowWorldPositions.push(pane.position.clone());
      // Faint skyline silhouette between the dark sky and the rain — the distant
      // outside, backlit when lightning flashes the sky behind it.
      const skyline = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), skylineMat);
      skyline.position.set(bx + nx * 0.035, y, bz + nz * 0.035);
      skyline.rotation.y = rotY;
      group.add(skyline);
      // Rain in front of the dark view — streaks against the night.
      const rain = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), rainMat);
      rain.position.set(bx + nx * 0.05, y, bz + nz * 0.05);
      rain.rotation.y = rotY;
      group.add(rain);
      // A short-range flash light just inside the room — lightning spills in
      // through THIS window only, falling off fast (windowless rooms stay dark).
      const flashLight = new THREE.PointLight(0xcfe0ff, 0, 7, 2.2);
      flashLight.position.set(bx + nx * 1.2, y, bz + nz * 1.2);
      group.add(flashLight);
      windowLights.push(flashLight);
    }

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
    // Coords below are authored against the legacy 2 m grid; scale by UPSCALE to
    // land at the same physical spots on the upscaled engine grid.
    for (const s of webSpots) {
      const web = new THREE.Mesh(new THREE.PlaneGeometry(s.size, s.size), webMat);
      const wx = s.x * UPSCALE * CELL_SIZE;
      const wz = s.z * UPSCALE * CELL_SIZE;
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
      if (m.floor >= house.grids.length) continue; // skip floors this house lacks
      // Faint cool pool — just enough to make a window a dim orientation beacon,
      // not enough to light the room. The flashlight is the only real light.
      const light = new THREE.PointLight(0x4a5d8a, 0.6, 7, 1.8);
      const { x, z } = cellToWorld(m.x * UPSCALE, Math.round(m.z * UPSCALE));
      light.position.set(x, floorY(m.floor) + 2.0, m.z < 7 ? z + 1 : z - 1);
      group.add(light);
    }

    // ---- Flickering fixtures: bare bulbs in basement hall and attic. A faint,
    // failing glow (the flashlight stays the dominant light).
    const FIXTURE_INTENSITY = 1.2;
    const fixtures: { light: THREE.PointLight; bulb: THREE.Mesh; phase: number; drop: number }[] =
      [];
    const fixtureSpots = [
      { floor: 0, x: 7, z: 5 },
      { floor: 3, x: 7, z: 6 },
    ];
    for (const spot of fixtureSpots) {
      if (spot.floor >= house.grids.length) continue; // skip floors this house lacks
      const { x, z } = cellToWorld(spot.x * UPSCALE, spot.z * UPSCALE);
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
      const light = new THREE.PointLight(0xcc9944, FIXTURE_INTENSITY, 9, 1.6);
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
      windowWorldPositions,
      updateWindows(dt: number, flash: number) {
        // Rain falls DOWN the view (increasing offset.y scrolls streaks downward).
        rainTex.offset.y = (rainTex.offset.y + dt * 0.55) % 1;
        rainMat.opacity = 0.5 + flash * 0.45;
        // The night view blazes toward a bright sky-flash on a lightning strike.
        for (const pane of windowPanes) {
          (pane.material as THREE.MeshBasicMaterial).color.copy(WINDOW_NIGHT).lerp(WINDOW_FLASH, flash);
        }
        // Lightning also spills through each window into the nearby room only.
        const lightIntensity = flash * config.weather.flashIntensity;
        for (const wl of windowLights) wl.intensity = lightIntensity;
      },
      updateFixtures(dt: number) {
        for (const fx of fixtures) {
          fx.phase -= dt;
          if (fx.phase <= 0) {
            fx.phase = 0.08 + Math.random() * 0.7;
            fx.drop = Math.random() < 0.25 ? 0.1 + Math.random() * 0.5 : 1;
          }
          fx.light.intensity = FIXTURE_INTENSITY * fx.drop;
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
        return Math.max(0, Math.min(house.grids.length - 1, Math.round(y / FLOOR_SPACING)));
      },
      openCloset(pos) {
        const d = closetDoors.get(`${pos.floor}:${pos.x},${pos.z}`);
        if (d) d.target = Math.PI * 0.62; // swing wide open
      },
    };
  }
}

export { worldToCell };
