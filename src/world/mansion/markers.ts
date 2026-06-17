/**
 * Hand-authored marker data for the mansion: where furniture sits and (below)
 * where the gameplay markers live. Furniture references the interior catalog by
 * model id (`assets/catalog.data.ts`); an id that is not in the catalog is built
 * as a procedural fallback prop (a marker may name a `PropKind` directly — e.g.
 * `boiler`, `crates` — to keep a procedural-only landmark). Coordinates are mansion
 * cells (`layout.ts` envelope, 0.5 m pitch); each placement should sit a couple of
 * cells inside its room so its footprint clears the walls and doorways.
 *
 * Density here is deliberately representative, not exhaustive — the spatial read
 * ("does each room's purpose show?") is tuned in the in-browser playtest.
 */
import { FLOOR } from './layout';
import type { CellPos, EnemySpawnDef, ExitDef, HidingSpotDef, House } from '../layoutTypes';

/** A furniture placement: a catalog model id (or `PropKind` fallback) on a cell. */
export interface FurnitureMarker {
  /** Catalog model id (`catalog.data.ts`); a non-catalog id falls back to a prop. */
  model: string;
  /** Mansion cell. */
  pos: { floor: number; x: number; z: number };
  /** Yaw in quarter turns about +Y (0..3), as `PropPlacement.rot`. */
  rot?: number;
}

const SUB = FLOOR.sublevel;
const BASE = FLOOR.basement;
const MAIN = FLOOR.main;
const UP = FLOOR.upstairs;
const ATTIC = FLOOR.attic;

export const FURNITURE: FurnitureMarker[] = [
  // ---- Sub-level (floor 0): alchemist's lab + prison block.
  { model: 'Table_RoundLarge', pos: { floor: SUB, x: 14, z: 56 } },
  { model: 'Shelf_Large', pos: { floor: SUB, x: 10, z: 55 } },
  { model: 'Bookshelf', pos: { floor: SUB, x: 19, z: 55 }, rot: 2 },
  { model: 'Bed_Single', pos: { floor: SUB, x: 11, z: 51 } }, // prison cot
  { model: 'crates', pos: { floor: SUB, x: 18, z: 51 } },

  // ---- Basement (floor 1): service cellars.
  { model: 'Shelf_Large', pos: { floor: BASE, x: 9, z: 6 } }, // coal cellar
  { model: 'Trashcan_Large', pos: { floor: BASE, x: 18, z: 25 } },
  { model: 'Shelf_Large', pos: { floor: BASE, x: 24, z: 6 } }, // larder
  { model: 'Shelf_Large', pos: { floor: BASE, x: 24, z: 13 } },
  { model: 'Shelf_2', pos: { floor: BASE, x: 39, z: 6 } }, // cold store
  { model: 'Shelf_Large', pos: { floor: BASE, x: 39, z: 13 } },
  { model: 'Table_RoundLarge', pos: { floor: BASE, x: 57, z: 15 } }, // servants' hall
  { model: 'Chair_1', pos: { floor: BASE, x: 54, z: 15 } },
  { model: 'Chair_2', pos: { floor: BASE, x: 60, z: 15 } },
  { model: 'Fireplace', pos: { floor: BASE, x: 52, z: 6 }, rot: 2 },
  { model: 'Shelf_Small1', pos: { floor: BASE, x: 66, z: 6 } }, // service-core foot
  { model: 'Shelf_Large', pos: { floor: BASE, x: 9, z: 33 } }, // wine cellar racks
  { model: 'Shelf_Large', pos: { floor: BASE, x: 9, z: 39 } },
  { model: 'Shelf_Large', pos: { floor: BASE, x: 9, z: 45 } },
  { model: 'boiler', pos: { floor: BASE, x: 28, z: 40 } }, // boiler / strong room
  { model: 'crates', pos: { floor: BASE, x: 36, z: 50 } },
  { model: 'Shelf_2', pos: { floor: BASE, x: 43, z: 33 } }, // lamp room
  { model: 'Light_Stand1', pos: { floor: BASE, x: 50, z: 42 } },
  { model: 'crates', pos: { floor: BASE, x: 59, z: 33 } }, // wood store (chute landing)
  { model: 'crates', pos: { floor: BASE, x: 62, z: 50 } },
  { model: 'Shelf_Large', pos: { floor: BASE, x: 72, z: 45 }, rot: 3 },

  // ---- Main floor (floor 2): reception + service wing.
  { model: 'Bookshelf', pos: { floor: MAIN, x: 8, z: 4 } }, // study
  { model: 'Bookshelf', pos: { floor: MAIN, x: 8, z: 9 } },
  { model: 'Table_RoundSmall', pos: { floor: MAIN, x: 16, z: 12 } },
  { model: 'Light_Floor1', pos: { floor: MAIN, x: 18, z: 4 } },
  { model: 'Bookshelf', pos: { floor: MAIN, x: 23, z: 4 } }, // library
  { model: 'Bookshelf', pos: { floor: MAIN, x: 23, z: 8 } },
  { model: 'Bookshelf', pos: { floor: MAIN, x: 23, z: 12 } },
  { model: 'Table_RoundLarge', pos: { floor: MAIN, x: 30, z: 9 } },
  { model: 'Chair_3', pos: { floor: MAIN, x: 33, z: 9 } },
  { model: 'Table_RoundLarge', pos: { floor: MAIN, x: 42, z: 9 } }, // dining
  { model: 'Chair_1', pos: { floor: MAIN, x: 39, z: 9 } },
  { model: 'Chair_2', pos: { floor: MAIN, x: 45, z: 9 } },
  { model: 'Drawer_1', pos: { floor: MAIN, x: 38, z: 3 } },
  { model: 'Kitchen_Fridge', pos: { floor: MAIN, x: 51, z: 3 } }, // kitchen
  { model: 'Kitchen_Oven', pos: { floor: MAIN, x: 54, z: 3 } },
  { model: 'Kitchen_Sink', pos: { floor: MAIN, x: 57, z: 3 } },
  { model: 'Kitchen_3Drawers', pos: { floor: MAIN, x: 54, z: 14 } },
  { model: 'Kitchen_Sink', pos: { floor: MAIN, x: 62, z: 4 } }, // scullery
  { model: 'Bathroom_WashingMachine', pos: { floor: MAIN, x: 70, z: 4 } },
  { model: 'Shelf_Large', pos: { floor: MAIN, x: 62, z: 11 } }, // pantry
  { model: 'Shelf_Large', pos: { floor: MAIN, x: 62, z: 15 } },
  { model: 'Couch_Large1', pos: { floor: MAIN, x: 11, z: 24 } }, // drawing room
  { model: 'Couch_Medium1', pos: { floor: MAIN, x: 19, z: 24 }, rot: 2 },
  { model: 'Table_RoundLarge', pos: { floor: MAIN, x: 15, z: 31 } },
  { model: 'Fireplace', pos: { floor: MAIN, x: 7, z: 33 }, rot: 1 },
  { model: 'Carpet_1', pos: { floor: MAIN, x: 15, z: 38 } },
  { model: 'Houseplant_5', pos: { floor: MAIN, x: 29, z: 45 } },
  { model: 'Couch_Medium2', pos: { floor: MAIN, x: 45, z: 22 } }, // saloon
  { model: 'Houseplant_1', pos: { floor: MAIN, x: 33, z: 22 } },
  { model: 'Table_RoundSmall', pos: { floor: MAIN, x: 40, z: 44 } }, // entrance hall
  { model: 'Houseplant_2', pos: { floor: MAIN, x: 33, z: 45 } },
  { model: 'Houseplant_2', pos: { floor: MAIN, x: 46, z: 45 } },
  { model: 'Carpet_2', pos: { floor: MAIN, x: 40, z: 38 } },
  { model: 'Couch_Small1', pos: { floor: MAIN, x: 50, z: 22 } }, // morning room
  { model: 'Table_RoundSmall', pos: { floor: MAIN, x: 60, z: 25 } },
  { model: 'Light_Floor3', pos: { floor: MAIN, x: 70, z: 22 } },
  { model: 'Table_RoundLarge', pos: { floor: MAIN, x: 56, z: 40 } }, // billiard / music
  { model: 'Couch_Large2', pos: { floor: MAIN, x: 50, z: 44 } },
  { model: 'Bookshelf', pos: { floor: MAIN, x: 65, z: 44 }, rot: 2 },
  { model: 'Shelf_Small1', pos: { floor: MAIN, x: 68, z: 44 } }, // garage / mudroom
  { model: 'Trashcan_Large', pos: { floor: MAIN, x: 68, z: 34 } },

  // ---- Upstairs (floor 3): bedrooms + nursery.
  { model: 'Bed_Single', pos: { floor: UP, x: 9, z: 5 } }, // guest bedroom 1
  { model: 'NightStand_1', pos: { floor: UP, x: 12, z: 5 } },
  { model: 'Drawer_2', pos: { floor: UP, x: 8, z: 13 } },
  { model: 'Bed_Single', pos: { floor: UP, x: 24, z: 5 } }, // guest bedroom 2
  { model: 'NightStand_1', pos: { floor: UP, x: 27, z: 5 } },
  { model: 'Bed_Single', pos: { floor: UP, x: 39, z: 5 } }, // guest bedroom 3
  { model: 'NightStand_2', pos: { floor: UP, x: 42, z: 5 } },
  { model: 'Bed_Single', pos: { floor: UP, x: 53, z: 5 } }, // servant bedroom A
  { model: 'Bed_Single', pos: { floor: UP, x: 63, z: 4 } }, // servant bedroom B
  { model: 'Bed_King', pos: { floor: UP, x: 11, z: 41 } }, // master bedroom
  { model: 'NightStand_1', pos: { floor: UP, x: 7, z: 41 } },
  { model: 'NightStand_2', pos: { floor: UP, x: 16, z: 41 } },
  { model: 'Drawer_1', pos: { floor: UP, x: 20, z: 44 } },
  { model: 'Fireplace', pos: { floor: UP, x: 8, z: 45 }, rot: 1 },
  { model: 'Drawer_3', pos: { floor: UP, x: 25, z: 37 } }, // dressing room
  { model: 'Drawer_4', pos: { floor: UP, x: 25, z: 44 } },
  { model: 'Bathroom_Bathtub', pos: { floor: UP, x: 37, z: 39 } }, // boudoir / bath
  { model: 'Bathroom_Sink', pos: { floor: UP, x: 45, z: 37 } },
  { model: 'Bathroom_Toilet', pos: { floor: UP, x: 45, z: 44 } },
  { model: 'Couch_Small2', pos: { floor: UP, x: 50, z: 37 } }, // nursery
  { model: 'Drawer_5', pos: { floor: UP, x: 56, z: 37 } },
  { model: 'Bed_Single', pos: { floor: UP, x: 49, z: 44 } }, // boy's room (player spawn)
  { model: 'Bed_Single', pos: { floor: UP, x: 56, z: 44 } }, // girl's room
  { model: 'NightStand_1', pos: { floor: UP, x: 54, z: 42 } },
  { model: 'Couch_Large3', pos: { floor: UP, x: 62, z: 37 } }, // family sitting room
  { model: 'Table_RoundSmall', pos: { floor: UP, x: 67, z: 40 } },
  { model: 'Light_Floor4', pos: { floor: UP, x: 70, z: 37 } },
  { model: 'Houseplant_6', pos: { floor: UP, x: 71, z: 45 } },

  // ---- Attic (floor 4): servant rooms + stores.
  { model: 'Bed_Single', pos: { floor: ATTIC, x: 34, z: 16 } }, // servant bedroom 1
  { model: 'Table_RoundSmall', pos: { floor: ATTIC, x: 43, z: 16 } }, // monitor room
  { model: 'Drawer_1', pos: { floor: ATTIC, x: 47, z: 16 } },
  { model: 'Bed_Single', pos: { floor: ATTIC, x: 51, z: 16 } }, // servant bedroom 2
  { model: 'crates', pos: { floor: ATTIC, x: 34, z: 26 } }, // box / lumber room
  { model: 'crates', pos: { floor: ATTIC, x: 38, z: 28 } },
  { model: 'crates', pos: { floor: ATTIC, x: 43, z: 26 } },
  { model: 'Shelf_Large', pos: { floor: ATTIC, x: 47, z: 25 } }, // linen room
  { model: 'Shelf_1', pos: { floor: ATTIC, x: 55, z: 28 } },
  { model: 'Trashcan_Large', pos: { floor: ATTIC, x: 58, z: 26 } }, // cistern room
];

// ---------------------------------------------------------------- gameplay
// The markers the `House` exposes — surfaced by `applyMarkers` on the mansion the
// way the legacy ASCII grid's coordinate maps used to be. Cells are chosen on
// open floor away from the furniture footprints; enemy spawns + the player spawn
// sit in circulation space so nobody starts inside a solid prop.

/**
 * Candidate player spawns — the children's rooms upstairs (the kid is the
 * protagonist). A run picks one by seed; the first is the back-compat default.
 */
export const PLAYER_SPAWNS: CellPos[] = [
  { floor: UP, x: 48, z: 42 }, // boy's room (clear of the bed)
  { floor: UP, x: 58, z: 42 }, // girl's room (clear of the bed)
  { floor: UP, x: 53, z: 38 }, // nursery (between the children's rooms)
];

/**
 * Enemy spawns distributed across the floors in circulation space so patrols
 * read across the larger footprint (count is a playtest `(verify)`).
 */
export const ENEMY_SPAWNS: EnemySpawnDef[] = [
  { pos: { floor: BASE, x: 40, z: 28 }, enemy: 'pou' }, // basement spine
  { pos: { floor: MAIN, x: 20, z: 18 }, enemy: 'littleTimmy' }, // family hall
  { pos: { floor: UP, x: 40, z: 17 }, enemy: 'newYama' }, // upstairs north hall
  { pos: { floor: ATTIC, x: 50, z: 22 }, enemy: 'fuggie' }, // attic spine
];

/** Hiding spots: each hosts its own procedural furniture (`hidingHostKind`). */
export const HIDING_SPOTS: HidingSpotDef[] = [
  // Sub-level + basement stores.
  { pos: { floor: SUB, x: 19, z: 50 }, kind: 'boxFort' }, // prison block
  { pos: { floor: BASE, x: 18, z: 8 }, kind: 'boxFort' }, // coal cellar
  { pos: { floor: BASE, x: 33, z: 8 }, kind: 'cabinet' }, // larder
  { pos: { floor: BASE, x: 62, z: 24 }, kind: 'cabinet' }, // servants' hall
  { pos: { floor: BASE, x: 72, z: 33 }, kind: 'boxFort' }, // wood store
  // Main-floor reception + service.
  { pos: { floor: MAIN, x: 59, z: 14 }, kind: 'cabinet' }, // kitchen
  { pos: { floor: MAIN, x: 71, z: 11 }, kind: 'closet' }, // pantry
  { pos: { floor: MAIN, x: 46, z: 33 }, kind: 'closet' }, // entrance hall
  // Bedrooms upstairs.
  { pos: { floor: UP, x: 20, z: 36 }, kind: 'wardrobe' }, // master bedroom
  { pos: { floor: UP, x: 18, z: 3 }, kind: 'wardrobe' }, // guest bedroom 1
  { pos: { floor: UP, x: 33, z: 3 }, kind: 'wardrobe' }, // guest bedroom 2
  { pos: { floor: UP, x: 52, z: 42 }, kind: 'wardrobe' }, // boy's room
  { pos: { floor: UP, x: 32, z: 44 }, kind: 'closet' }, // dressing room
  // Attic stores.
  { pos: { floor: ATTIC, x: 44, z: 29 }, kind: 'boxFort' }, // box / lumber room
  { pos: { floor: ATTIC, x: 65, z: 29 }, kind: 'boxFort' }, // cistern room
];

/** Flashlight charging stations, spread for reachability across the levels. */
// Each mounts flush against a wall (a `wall` edge or the house envelope).
export const CHARGING_STATIONS: CellPos[] = [
  { floor: SUB, x: 16, z: 58 }, // alchemist's lab (south wall)
  { floor: BASE, x: 51, z: 15 }, // servants' hall (west wall)
  { floor: MAIN, x: 6, z: 14 }, // study (west outer wall)
  { floor: MAIN, x: 72, z: 30 }, // morning room (east outer wall)
  { floor: UP, x: 72, z: 42 }, // family sitting room (east outer wall)
  { floor: ATTIC, x: 40, z: 18 }, // monitor room (west wall)
];

/** Where the objective key may spawn (seeded). Spread across every level. */
export const KEY_CANDIDATES: CellPos[] = [
  { floor: SUB, x: 18, z: 56 }, // alchemist's lab
  { floor: BASE, x: 20, z: 33 }, // wine cellar
  { floor: BASE, x: 48, z: 15 }, // cold store
  { floor: MAIN, x: 12, z: 8 }, // study
  { floor: MAIN, x: 28, z: 12 }, // library
  { floor: UP, x: 16, z: 44 }, // master bedroom
  { floor: UP, x: 66, z: 44 }, // family sitting room
  { floor: ATTIC, x: 45, z: 18 }, // monitor room
];

/** Escape exits in the courtyard / terrace band (the chase escape loop). */
export const EXITS: ExitDef[] = [
  { pos: { floor: MAIN, x: 12, z: 58 }, id: 'A' }, // west terrace
  { pos: { floor: MAIN, x: 40, z: 58 }, id: 'B' }, // garden centre
  { pos: { floor: MAIN, x: 66, z: 58 }, id: 'C' }, // east terrace
];

/**
 * Attach the authored gameplay markers to a freshly built mansion `House`. The
 * `MansionBuilder` leaves the marker tables empty (geometry only); this fills
 * them from the data above, replacing the legacy grid's coordinate maps.
 */
export function applyMarkers(house: House): void {
  house.playerSpawns = PLAYER_SPAWNS.map((p) => ({ ...p }));
  house.playerSpawn = { ...PLAYER_SPAWNS[0] };
  house.enemySpawns = ENEMY_SPAWNS.map((e) => ({ pos: { ...e.pos }, enemy: e.enemy }));
  house.hidingSpots = HIDING_SPOTS.map((h) => ({ pos: { ...h.pos }, kind: h.kind }));
  house.chargingStations = CHARGING_STATIONS.map((c) => ({ ...c }));
  house.keyCandidates = KEY_CANDIDATES.map((c) => ({ ...c }));
  house.exits = EXITS.map((e) => ({ pos: { ...e.pos }, id: e.id }));
}
