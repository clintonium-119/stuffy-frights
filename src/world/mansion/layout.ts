/**
 * Shared envelope, floor indexing, and vertically-aligned column coordinates for
 * the hand-authored mansion (`design/floor-schematics.md`). Every level module
 * imports these so stairs, shafts, and the saloon void stack on identical (x,z)
 * across the floors they pass through — the alignment the validator enforces.
 *
 * Floor indices are non-negative and ordered bottom→top. The secret sub-level is
 * the deepest (0); the courtyard/terrace is the open-air south band of the main
 * floor (no separate index), so unbuilt cells there carry no slab and read as sky.
 */
export const MANSION_WIDTH = 80;
export const MANSION_DEPTH = 60;

export const FLOOR = {
  sublevel: 0,
  basement: 1,
  main: 2,
  upstairs: 3,
  attic: 4,
} as const;

export const FLOOR_COUNT = 5;

/** Display names indexed by floor; extends the legacy `FLOOR_NAMES` ordering. */
export const MANSION_FLOOR_NAMES = [
  'Sub-level',
  'Basement',
  'Main Floor',
  'Upstairs',
  'Attic',
] as const;

/**
 * The columns to stamp first on every level they traverse (from the schematic's
 * alignment table). Rooms are then built around them.
 */
export const COLUMN = {
  /** Grand stair + double-height saloon void (Main↔Upstairs). */
  grandStair: { x: 37, z: 24 },
  /** Service-core back stair — the one servant vertical artery (Basement→Attic). */
  serviceCore: { x: 66, z: 11 },
  /** Garage trap chute, one-way Main→Basement into the wood store. */
  garageChute: { x: 71, z: 41 },
  /** Wine-cellar jib → concealed stair down to the sub-level. */
  cellarSecret: { x: 8, z: 49 },
} as const;
