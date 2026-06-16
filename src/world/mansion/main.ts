/**
 * Main floor (floor 2) — the principal level. A 3-cell family hall spans the
 * house; the reception enfilade (study, library, dining; drawing room, saloon
 * with the grand stair, morning room, billiard/music) ranks off it on the garden
 * and entrance fronts. The service wing (kitchen, scullery, pantry) hangs off the
 * NE and meets the family side at exactly one baize door (dining↔kitchen); its
 * back stair down to the basement is on the service-core column. A garage trap
 * chute drops to the basement wood store.
 *
 * The grand stair up to the gallery and the service stair up to the attic are
 * authored in the upper modules; the porte-cochère and terrace doors are cut by
 * `courtyard.ts` once the open-air south band exists.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR, COLUMN } from './layout';

export function authorMain(b: MansionBuilder): void {
  const f = FLOOR.main;
  const base = FLOOR.basement;

  // Family circulation: a 3-cell hall across the house.
  b.corridor(f, { x0: 6, z0: 17, x1: 72, z1: 19 });

  // North band — reception (W) + service wing (NE).
  b.room(f, { x0: 6, z0: 2, x1: 20, z1: 16 }); // study
  b.room(f, { x0: 21, z0: 2, x1: 35, z1: 16 }); // library
  b.room(f, { x0: 36, z0: 2, x1: 49, z1: 16 }); // dining
  b.room(f, { x0: 50, z0: 2, x1: 60, z1: 16 }); // kitchen
  b.room(f, { x0: 61, z0: 2, x1: 72, z1: 9 }); // scullery
  b.room(f, { x0: 61, z0: 10, x1: 72, z1: 16 }); // pantry (service core)

  // South band — saloon hub, entrance hall, and the principal rooms.
  b.room(f, { x0: 6, z0: 20, x1: 31, z1: 46 }); // drawing room
  b.room(f, { x0: 32, z0: 20, x1: 47, z1: 31 }); // saloon + grand stair
  b.room(f, { x0: 32, z0: 32, x1: 47, z1: 46 }); // entrance hall (porte-cochère)
  b.room(f, { x0: 48, z0: 20, x1: 72, z1: 31 }); // morning room
  b.room(f, { x0: 48, z0: 32, x1: 66, z1: 46 }); // billiard / music
  b.room(f, { x0: 67, z0: 32, x1: 72, z1: 46 }); // garage / mudroom

  // Family doors off the hall.
  b.door(f, { x: 13, z: 16 }, { x: 13, z: 17 }); // study
  b.door(f, { x: 28, z: 16 }, { x: 28, z: 17 }); // library
  b.door(f, { x: 42, z: 16 }, { x: 42, z: 17 }); // dining
  b.door(f, { x: 18, z: 20 }, { x: 18, z: 19 }); // drawing room
  b.door(f, { x: 40, z: 20 }, { x: 40, z: 19 }); // saloon
  b.door(f, { x: 60, z: 20 }, { x: 60, z: 19 }); // morning room

  // Reception enfilade + entrance circulation.
  b.door(f, { x: 40, z: 31 }, { x: 40, z: 32 }); // saloon → entrance hall
  b.door(f, { x: 47, z: 40 }, { x: 48, z: 40 }); // entrance hall → billiard
  b.door(f, { x: 54, z: 31 }, { x: 54, z: 32 }); // morning → billiard (loop)
  b.door(f, { x: 66, z: 40 }, { x: 67, z: 40 }); // billiard → garage

  // Service wing internal circulation.
  b.door(f, { x: 60, z: 5 }, { x: 61, z: 5 }); // kitchen → scullery
  b.door(f, { x: 60, z: 13 }, { x: 61, z: 13 }); // kitchen → pantry
  b.door(f, { x: 66, z: 9 }, { x: 66, z: 10 }); // scullery → pantry

  // The single baize/jib door between the family and service departments.
  b.door(f, { x: 49, z: 9 }, { x: 50, z: 9 }); // dining ↔ kitchen

  // Service-core back stair down to the basement (the servant vertical artery).
  b.stair({
    lower: base,
    upper: f,
    cells: [
      { x: COLUMN.serviceCore.x, z: 13 },
      { x: COLUMN.serviceCore.x, z: 12 },
      { x: COLUMN.serviceCore.x, z: 11 },
    ],
  });

  // Garage trap chute — one-way drop into the basement wood store.
  b.chute(
    { floor: f, x: COLUMN.garageChute.x, z: COLUMN.garageChute.z },
    { floor: base, x: COLUMN.garageChute.x, z: COLUMN.garageChute.z }
  );

  // A few exterior windows (garden front + entrance front).
  b.window({ floor: f, x: 12, z: 46, edge: 'h' }); // drawing room, garden
  b.window({ floor: f, x: 24, z: 46, edge: 'h' });
  b.window({ floor: f, x: 40, z: 46, edge: 'h' }); // entrance hall
  b.window({ floor: f, x: 12, z: 1, edge: 'h' }); // study, front
  b.window({ floor: f, x: 42, z: 1, edge: 'h' }); // dining, front
}
