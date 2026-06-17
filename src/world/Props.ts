import * as THREE from 'three';
import { Aabb, aabb } from '../core/Collision';
import { CELL_SIZE, CellPos, cellToWorld, floorY } from './layoutTypes';
import { pbrMaterial } from './materialLibrary';
import { footprintCells, interiorModelById, INTERIOR_SCALE } from './assets/catalog';
import type { ModelPlacement } from './assets/ModelLibrary';
import type { FurnitureMarker } from './mansion/markers';

export type PropKind =
  | 'wardrobe'
  | 'bed'
  | 'cabinet'
  | 'crates'
  | 'couch'
  | 'table'
  | 'bookshelf'
  | 'washer'
  | 'boiler'
  | 'shelf'
  | 'toyChest'
  | 'dollhouse'
  | 'coatRack'
  | 'closet';

export interface PropPlacement {
  pos: CellPos;
  kind: PropKind;
  /** Rotation around Y in quarter turns. */
  rot?: number;
}

export interface BuiltProp {
  group: THREE.Group;
  colliders: Aabb[];
  /** True when the prop fills its cell for navigation purposes. */
  solid: boolean;
  /** Hinged door pivot (closets only) — the world animates it open on a search. */
  door?: THREE.Object3D;
}

// Furniture surfaces draw from the bundled CC0 PBR library (wood planks, fabric,
// metal), tinted to keep the old colour relationships. Mattress/plastic stay
// flat-shaded (no fitting texture). The albedo tint multiplies the photo texture.
const woodDark = pbrMaterial('woodprop', { color: 0x7a6048, roughness: 0.85 });
const woodMid = pbrMaterial('woodprop', { color: 0xc8b090 });
const woodLight = pbrMaterial('woodprop', { color: 0xe6d2b4 });
const fabric = pbrMaterial('fabric', { color: 0x9a8894 });
const mattress = new THREE.MeshStandardMaterial({ color: 0x9a8f7a, roughness: 1 });
const metal = pbrMaterial('metal', { color: 0xb7bcc0, metalness: 0.6, roughness: 0.5 });
const metalDark = pbrMaterial('metal', { color: 0x7d8488, metalness: 0.5, roughness: 0.6 });
const plastic = new THREE.MeshStandardMaterial({ color: 0x8a4a4a, roughness: 0.7 });

function box(
  g: THREE.Group,
  mat: THREE.Material,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}

/** Builders create the prop centered at origin, on floor level y=0. */
const builders: Record<
  PropKind,
  (g: THREE.Group) => { half: [number, number]; height: number; solid: boolean; door?: THREE.Object3D }
> = {
  wardrobe(g) {
    box(g, woodDark, 1.5, 2.2, 0.8, 0, 0, 0);
    box(g, woodMid, 0.66, 2.0, 0.05, -0.36, 0.1, 0.42); // doors
    box(g, woodMid, 0.66, 2.0, 0.05, 0.36, 0.1, 0.42);
    box(g, woodLight, 0.06, 0.3, 0.06, -0.06, 1.0, 0.46); // handles
    box(g, woodLight, 0.06, 0.3, 0.06, 0.06, 1.0, 0.46);
    return { half: [0.78, 0.45], height: 2.2, solid: true };
  },
  bed(g) {
    box(g, woodDark, 1.2, 0.25, 2.0, 0, 0.2, 0); // frame on legs
    box(g, mattress, 1.1, 0.25, 1.9, 0, 0.45, 0);
    box(g, fabric, 1.0, 0.12, 0.5, 0, 0.7, -0.65); // pillow
    box(g, woodDark, 1.2, 0.9, 0.08, 0, 0, -1.0); // headboard
    for (const [lx, lz] of [[-0.55, -0.9], [0.55, -0.9], [-0.55, 0.9], [0.55, 0.9]]) {
      box(g, woodDark, 0.1, 0.2, 0.1, lx, 0, lz);
    }
    return { half: [0.62, 1.02], height: 1.0, solid: true };
  },
  cabinet(g) {
    box(g, woodMid, 1.2, 1.1, 0.6, 0, 0, 0);
    box(g, woodLight, 0.55, 0.95, 0.04, -0.3, 0.07, 0.31);
    box(g, woodLight, 0.55, 0.95, 0.04, 0.3, 0.07, 0.31);
    return { half: [0.62, 0.32], height: 1.1, solid: true };
  },
  crates(g) {
    box(g, woodLight, 0.9, 0.9, 0.9, -0.35, 0, -0.2);
    box(g, woodMid, 0.7, 0.7, 0.7, 0.45, 0, 0.25);
    box(g, woodLight, 0.6, 0.6, 0.6, -0.15, 0.9, -0.15);
    return { half: [0.85, 0.7], height: 1.6, solid: true };
  },
  couch(g) {
    box(g, fabric, 2.0, 0.45, 0.9, 0, 0, 0);
    box(g, fabric, 2.0, 0.6, 0.25, 0, 0.45, -0.32);
    box(g, fabric, 0.25, 0.35, 0.9, -0.88, 0.45, 0);
    box(g, fabric, 0.25, 0.35, 0.9, 0.88, 0.45, 0);
    return { half: [1.02, 0.47], height: 1.05, solid: true };
  },
  table(g) {
    box(g, woodMid, 1.8, 0.08, 1.0, 0, 0.72, 0);
    for (const [lx, lz] of [[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]]) {
      box(g, woodDark, 0.09, 0.72, 0.09, lx, 0, lz);
    }
    return { half: [0.92, 0.52], height: 0.8, solid: true };
  },
  bookshelf(g) {
    box(g, woodDark, 1.6, 2.1, 0.4, 0, 0, 0);
    for (let i = 0; i < 4; i++) {
      box(g, woodLight, 1.45, 0.04, 0.34, 0, 0.35 + i * 0.5, 0.02);
      // books: a few colored slabs per shelf
      for (let b = 0; b < 5; b++) {
        const m = new THREE.MeshStandardMaterial({
          color: [0x6a3c3c, 0x3c5a6a, 0x5a6a3c, 0x6a5a3c, 0x4a3c6a][b],
          roughness: 0.9,
        });
        box(g, m, 0.12, 0.34, 0.22, -0.6 + b * 0.28, 0.39 + i * 0.5, 0.04);
      }
    }
    return { half: [0.82, 0.22], height: 2.1, solid: true };
  },
  washer(g) {
    box(g, metal, 0.85, 1.0, 0.8, 0, 0, 0);
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.06, 20),
      metalDark
    );
    drum.rotation.x = Math.PI / 2;
    drum.position.set(0, 0.55, 0.41);
    g.add(drum);
    return { half: [0.45, 0.42], height: 1.0, solid: true };
  },
  boiler(g) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.9, 16), metalDark);
    tank.position.y = 0.95;
    tank.castShadow = true;
    g.add(tank);
    box(g, metal, 0.08, 1.2, 0.08, 0.45, 1.0, 0.3); // pipe
    box(g, metal, 0.08, 1.6, 0.08, -0.4, 0.6, -0.25);
    return { half: [0.55, 0.55], height: 2.2, solid: true };
  },
  shelf(g) {
    box(g, metal, 1.8, 1.9, 0.5, 0, 0, 0);
    box(g, woodLight, 0.5, 0.4, 0.4, -0.5, 0.2, 0);
    box(g, woodMid, 0.4, 0.3, 0.35, 0.4, 0.95, 0);
    box(g, plastic, 0.35, 0.3, 0.3, -0.3, 1.5, 0);
    return { half: [0.92, 0.27], height: 1.9, solid: true };
  },
  toyChest(g) {
    box(g, plastic, 1.3, 0.7, 0.7, 0, 0, 0);
    box(g, woodLight, 1.34, 0.1, 0.74, 0, 0.7, 0);
    // a toy poking out
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xcc8833, roughness: 0.6 })
    );
    ball.position.set(0.3, 0.85, 0);
    g.add(ball);
    return { half: [0.68, 0.38], height: 0.95, solid: true };
  },
  dollhouse(g) {
    box(g, plastic, 1.1, 0.9, 0.7, 0, 0, 0);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.5, 4), woodMid);
    roof.position.y = 1.15;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);
    box(g, woodLight, 0.2, 0.3, 0.02, 0, 0.2, 0.36); // tiny door
    return { half: [0.58, 0.38], height: 1.4, solid: true };
  },
  coatRack(g) {
    box(g, woodDark, 0.08, 1.8, 0.08, 0, 0, 0);
    box(g, woodDark, 0.5, 0.06, 0.5, 0, 0, 0);
    box(g, woodMid, 0.6, 0.06, 0.06, 0, 1.6, 0);
    box(g, fabric, 0.35, 0.8, 0.18, 0.15, 0.85, 0); // hanging coat
    return { half: [0.3, 0.3], height: 1.85, solid: false };
  },
  closet(g) {
    // Shallow recessed cabinet with a single hinged door facing +Z. The door
    // hangs on a pivot at its left edge so it can swing open when searched.
    box(g, woodDark, 1.1, 2.2, 0.7, 0, 0, -0.12); // carcass (open front at +z)
    box(g, woodMid, 1.0, 2.05, 0.5, 0, 0.05, -0.14); // dark interior recess
    const pivot = new THREE.Group();
    pivot.position.set(-0.5, 0, 0.22); // hinge at the left front edge
    const door = box(pivot, woodMid, 0.96, 2.0, 0.06, 0.48, 0.1, 0); // door centered right of hinge
    door.castShadow = true;
    box(pivot, woodLight, 0.05, 0.28, 0.05, 0.9, 1.0, 0.05); // handle
    g.add(pivot);
    return { half: [0.56, 0.42], height: 2.2, solid: true, door: pivot };
  },
};

export function buildProp(placement: PropPlacement): BuiltProp {
  const group = new THREE.Group();
  const spec = builders[placement.kind](group);
  const rot = ((placement.rot ?? 0) % 4) * (Math.PI / 2);
  group.rotation.y = rot;

  const { x, z } = cellToWorld(placement.pos.x, placement.pos.z);
  const y = floorY(placement.pos.floor);
  group.position.set(x, y, z);

  // Collider: rotated half-extents (quarter turns swap axes).
  const swap = (placement.rot ?? 0) % 2 === 1;
  const hx = swap ? spec.half[1] : spec.half[0];
  const hz = swap ? spec.half[0] : spec.half[1];
  const colliders = spec.solid
    ? [aabb(x - hx, y, z - hz, x + hx, y + spec.height, z + hz)]
    : [];

  return { group, colliders, solid: spec.solid, door: spec.door };
}

/** Hiding markers host their own furniture. */
export function hidingHostKind(
  kind: 'wardrobe' | 'underBed' | 'cabinet' | 'boxFort' | 'closet'
): PropKind {
  switch (kind) {
    case 'wardrobe':
      return 'wardrobe';
    case 'underBed':
      return 'bed';
    case 'cabinet':
      return 'cabinet';
    case 'boxFort':
      return 'crates';
    case 'closet':
      return 'closet';
  }
}

const PROP_KINDS: ReadonlySet<string> = new Set<PropKind>(
  Object.keys(builders) as PropKind[]
);

/** A marker `model` that isn't a catalog id falls back to a procedural prop:
 *  the same string if it names a `PropKind`, else a generic crate. */
function fallbackKind(model: string): PropKind {
  return PROP_KINDS.has(model) ? (model as PropKind) : 'crates';
}

/**
 * The cells a furniture footprint covers, centred on its marker cell. The
 * catalog footprint is in cells (from the model's x/z bounding box); a quarter
 * turn (odd `rot`) swaps the two extents. Cells are clamped to the envelope.
 */
export function furnitureFootprint(
  marker: FurnitureMarker,
  fx: number,
  fz: number,
  width: number,
  depth: number
): { x: number; z: number }[] {
  const swap = (marker.rot ?? 0) % 2 === 1;
  const cx = swap ? fz : fx;
  const cz = swap ? fx : fz;
  const x0 = marker.pos.x - Math.floor((cx - 1) / 2);
  const z0 = marker.pos.z - Math.floor((cz - 1) / 2);
  const out: { x: number; z: number }[] = [];
  for (let dz = 0; dz < cz; dz++) {
    for (let dx = 0; dx < cx; dx++) {
      const x = x0 + dx;
      const z = z0 + dz;
      if (x >= 0 && z >= 0 && x < width && z < depth) out.push({ x, z });
    }
  }
  return out;
}

/** Authored furniture resolved against the interior catalog. */
export interface ResolvedFurniture {
  /** Catalog-instanced placements (loaded + batched into `InstancedMesh` later). */
  instanced: ModelPlacement[];
  /** Markers with no catalog match — built as procedural fallback props. */
  fallback: PropPlacement[];
  /** `"floor:x,z"` cells filled by furniture footprints (enemy-nav exclusion). */
  solidCells: Set<string>;
}

/**
 * Resolve furniture markers: a catalog id becomes a floor-seated `ModelPlacement`
 * (the model's own normalization/seating is applied at instancing time); a
 * non-catalog id becomes a procedural fallback prop. Either way the footprint
 * cells (from the catalog box, or 1×1 for a fallback) are reported solid so the
 * nav graph routes enemies around the furniture.
 */
export function resolveFurniture(
  markers: readonly FurnitureMarker[],
  width: number,
  depth: number
): ResolvedFurniture {
  const instanced: ModelPlacement[] = [];
  const fallback: PropPlacement[] = [];
  const solidCells = new Set<string>();
  for (const marker of markers) {
    const model = interiorModelById(marker.model);
    const { x: wx, z: wz } = cellToWorld(marker.pos.x, marker.pos.z);
    const y = floorY(marker.pos.floor);
    if (model) {
      const matrix = new THREE.Matrix4()
        .makeTranslation(wx, y, wz)
        .multiply(new THREE.Matrix4().makeRotationY(((marker.rot ?? 0) % 4) * (Math.PI / 2)));
      instanced.push({ id: model.id, matrix });
      // Footprint at the rendered (normalized) size — the catalog primitive is
      // pure, so the global scale is folded into the cell size it's asked about.
      // Floor-flat decor (rugs) is walked over, so it never blocks nav.
      if (model.category !== 'Carpet') {
        const fp = footprintCells(model, CELL_SIZE / INTERIOR_SCALE);
        for (const c of furnitureFootprint(marker, fp.x, fp.z, width, depth)) {
          solidCells.add(`${marker.pos.floor}:${c.x},${c.z}`);
        }
      }
    } else {
      fallback.push({ pos: marker.pos, kind: fallbackKind(marker.model), rot: marker.rot });
      solidCells.add(`${marker.pos.floor}:${marker.pos.x},${marker.pos.z}`);
    }
  }
  return { instanced, fallback, solidCells };
}
