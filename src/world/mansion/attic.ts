/**
 * Attic (floor 4) — a small footprint within the roofline, reached only by the
 * service back stair. A short spine serves servant bedrooms and a security /
 * monitor room to the north and box/lumber, linen, and cistern rooms to the
 * south. A 1-cell knee-wall crawl behind the north rooms links a servant bedroom
 * to the monitor room as hidden traversal. No grand stair reaches up here.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR } from './layout';

export function authorAttic(b: MansionBuilder): void {
  const f = FLOOR.attic;
  const up = FLOOR.upstairs;

  b.corridor(f, { x0: 32, z0: 21, x1: 66, z1: 23 }); // spine

  // North rooms.
  b.room(f, { x0: 32, z0: 14, x1: 39, z1: 20 }); // servant bedroom 1
  b.room(f, { x0: 40, z0: 14, x1: 48, z1: 20 }); // security / monitor room
  b.room(f, { x0: 49, z0: 14, x1: 59, z1: 20 }); // servant bedroom 2
  b.room(f, { x0: 60, z0: 14, x1: 68, z1: 20 }); // service-core landing
  b.door(f, { x: 35, z: 20 }, { x: 35, z: 21 });
  b.door(f, { x: 44, z: 20 }, { x: 44, z: 21 });
  b.door(f, { x: 54, z: 20 }, { x: 54, z: 21 });
  b.door(f, { x: 64, z: 20 }, { x: 64, z: 21 });

  // South rooms.
  b.room(f, { x0: 32, z0: 24, x1: 45, z1: 30 }); // box / lumber room
  b.room(f, { x0: 46, z0: 24, x1: 56, z1: 30 }); // linen room
  b.room(f, { x0: 57, z0: 24, x1: 66, z1: 30 }); // cistern room
  b.door(f, { x: 38, z: 24 }, { x: 38, z: 23 });
  b.door(f, { x: 51, z: 24 }, { x: 51, z: 23 });
  b.door(f, { x: 61, z: 24 }, { x: 61, z: 23 });

  // Knee-wall crawl behind the north rooms: servant bedroom 1 → monitor room.
  b.vent(f, [{ x: 39, z: 13 }, { x: 40, z: 13 }]);
  b.open(f, { x: 39, z: 13 }, { x: 39, z: 14 }); // mouth into servant bedroom 1
  b.open(f, { x: 40, z: 13 }, { x: 40, z: 14 }); // mouth into the monitor room
  b.wall(f, { x: 39, z: 13 }, { x: 38, z: 13 });
  b.wall(f, { x: 40, z: 13 }, { x: 41, z: 13 });
  b.wall(f, { x: 39, z: 13 }, { x: 39, z: 12 });
  b.wall(f, { x: 40, z: 13 }, { x: 40, z: 12 });

  // Service back stair up from the upstairs service-core landing.
  b.stair({ lower: up, upper: f, cells: [{ x: 67, z: 15 }, { x: 67, z: 14 }] });

  // Dormer windows.
  b.window({ floor: f, x: 44, z: 13, edge: 'h' }); // monitor room, north dormer
  b.window({ floor: f, x: 51, z: 30, edge: 'h' }); // linen room, south dormer
}
