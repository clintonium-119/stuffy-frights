/**
 * Courtyard / terrace (the open-air south band of the main floor) — not a
 * separate level but the garden-front ground zone on floor 2, left uncovered (no
 * floor above) so it reads as sky. Terrace doors open from the drawing room,
 * entrance hall (porte-cochère), and billiard room onto a single open zone that
 * links the wings into the chase escape loop. A cellar areaway drops to the
 * basement (outside stealth entry) and the sub-level far exit surfaces here,
 * closing the secret loop. Authored last, once every interior room exists.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR } from './layout';

export function authorCourtyard(b: MansionBuilder): void {
  const f = FLOOR.main;
  const base = FLOOR.basement;
  const sub = FLOOR.sublevel;

  // The open-air terrace + courtyard zone along the garden front.
  b.room(f, { x0: 6, z0: 47, x1: 72, z1: 59 });

  // Terrace / garden doors from the principal rooms onto the courtyard.
  b.door(f, { x: 18, z: 46 }, { x: 18, z: 47 }); // drawing room
  b.door(f, { x: 40, z: 46 }, { x: 40, z: 47 }); // entrance hall (porte-cochère)
  b.door(f, { x: 57, z: 46 }, { x: 57, z: 47 }); // billiard / music

  // Cellar areaway — open stair down into the wine cellar (stealth entry).
  b.stair({ lower: base, upper: f, cells: [{ x: 10, z: 50 }, { x: 10, z: 49 }] });
  // Sub-level far exit — surfaces in the courtyard, closing the secret loop.
  b.stair({ lower: sub, upper: f, cells: [{ x: 20, z: 58 }, { x: 20, z: 57 }] });
}
