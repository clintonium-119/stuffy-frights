/**
 * Upstairs (floor 3) — the bedroom floor. A 3-cell gallery rings the open saloon
 * void (a hole in the slab overlooking the main-floor saloon) and joins a north
 * and a south hall. The garden front holds the master suite (bedroom, dressing,
 * boudoir/bath); guest bedrooms rank along the north front; the nursery sub-suite
 * sits over the two kids' rooms, which are linked by a 1-cell crawl vent (the
 * boy's room is the eventual player spawn). Servant bedrooms hang off the
 * service core. The grand stair up from the saloon and the service back stair up
 * from the main floor both land here.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR } from './layout';

export function authorUpstairs(b: MansionBuilder): void {
  const f = FLOOR.upstairs;
  const main = FLOOR.main;

  // Halls.
  b.corridor(f, { x0: 6, z0: 16, x1: 72, z1: 18 }); // north hall
  b.corridor(f, { x0: 6, z0: 32, x1: 72, z1: 34 }); // south hall

  // Gallery ring around the saloon void (x34..41, z22..28 stays open).
  b.room(f, [
    { x0: 31, z0: 19, x1: 44, z1: 21 }, // north run
    { x0: 31, z0: 29, x1: 44, z1: 31 }, // south run
    { x0: 31, z0: 22, x1: 33, z1: 28 }, // west run
    { x0: 42, z0: 22, x1: 44, z1: 28 }, // east run
  ]);
  b.door(f, { x: 32, z: 18 }, { x: 32, z: 19 }); // gallery ↔ north hall
  b.door(f, { x: 43, z: 18 }, { x: 43, z: 19 });
  b.door(f, { x: 32, z: 31 }, { x: 32, z: 32 }); // gallery ↔ south hall
  b.door(f, { x: 43, z: 31 }, { x: 43, z: 32 });

  // North range — guest bedrooms + servant quarters off the service core.
  b.room(f, { x0: 6, z0: 2, x1: 20, z1: 15 }); // guest bedroom 1
  b.room(f, { x0: 21, z0: 2, x1: 35, z1: 15 }); // guest bedroom 2
  b.room(f, { x0: 36, z0: 2, x1: 50, z1: 15 }); // guest bedroom 3
  b.room(f, { x0: 51, z0: 2, x1: 60, z1: 15 }); // servant bedroom A
  b.room(f, { x0: 61, z0: 2, x1: 72, z1: 9 }); // servant bedroom B
  b.room(f, { x0: 61, z0: 10, x1: 72, z1: 15 }); // service-core landing
  b.door(f, { x: 13, z: 15 }, { x: 13, z: 16 });
  b.door(f, { x: 28, z: 15 }, { x: 28, z: 16 });
  b.door(f, { x: 43, z: 15 }, { x: 43, z: 16 });
  b.door(f, { x: 55, z: 15 }, { x: 55, z: 16 });
  b.door(f, { x: 66, z: 15 }, { x: 66, z: 16 }); // service-core landing ↔ hall
  b.door(f, { x: 66, z: 9 }, { x: 66, z: 10 }); // servant B ↔ landing

  // South range — master suite + nursery/kids.
  b.room(f, { x0: 6, z0: 35, x1: 22, z1: 46 }); // master bedroom
  b.room(f, { x0: 23, z0: 35, x1: 33, z1: 46 }); // dressing room
  b.room(f, { x0: 34, z0: 35, x1: 47, z1: 46 }); // boudoir / bath
  b.room(f, { x0: 48, z0: 35, x1: 58, z1: 40 }); // nursery
  b.room(f, { x0: 48, z0: 41, x1: 52, z1: 46 }); // boy's room
  b.room(f, { x0: 54, z0: 41, x1: 58, z1: 46 }); // girl's room
  b.room(f, { x0: 59, z0: 35, x1: 72, z1: 46 }); // family sitting room
  b.door(f, { x: 14, z: 35 }, { x: 14, z: 34 });
  b.door(f, { x: 28, z: 35 }, { x: 28, z: 34 });
  b.door(f, { x: 40, z: 35 }, { x: 40, z: 34 });
  b.door(f, { x: 53, z: 35 }, { x: 53, z: 34 }); // nursery ↔ hall
  b.door(f, { x: 65, z: 35 }, { x: 65, z: 34 }); // family sitting ↔ hall
  b.door(f, { x: 50, z: 41 }, { x: 50, z: 40 }); // nursery ↔ boy's room
  b.door(f, { x: 56, z: 41 }, { x: 56, z: 40 }); // nursery ↔ girl's room

  // The kids'-room connecting crawl vent (1 cell, walled on its sides).
  b.vent(f, [{ x: 53, z: 43 }]);
  b.open(f, { x: 52, z: 43 }, { x: 53, z: 43 });
  b.open(f, { x: 53, z: 43 }, { x: 54, z: 43 });
  b.wall(f, { x: 53, z: 43 }, { x: 53, z: 42 });
  b.wall(f, { x: 53, z: 43 }, { x: 53, z: 44 });

  // Grand stair up from the saloon → south gallery.
  b.stair({ lower: main, upper: f, cells: [{ x: 37, z: 31 }, { x: 37, z: 30 }, { x: 37, z: 29 }] });
  // Service back stair up from the main floor → service-core landing.
  b.stair({ lower: main, upper: f, cells: [{ x: 67, z: 13 }, { x: 67, z: 12 }, { x: 67, z: 11 }] });

  // Exterior windows (garden + front).
  b.window({ floor: f, x: 12, z: 46, edge: 'h' }); // master, garden
  b.window({ floor: f, x: 40, z: 46, edge: 'h' });
  b.window({ floor: f, x: 12, z: 1, edge: 'h' }); // guest 1, front
  b.window({ floor: f, x: 43, z: 1, edge: 'h' });
}
