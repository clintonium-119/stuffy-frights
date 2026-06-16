/**
 * Basement (floor 1) — the service engine room, vaulted. A central service spine
 * runs east–west with the working cellars ranked off it: coal, larder, cold
 * store, servants' hall, and the service-core foot to the north; wine cellar,
 * boiler/strong room, lamp room, and the wood store (the garage trap-chute
 * landing) to the south. The wine cellar hides the jib stair down to the
 * sub-level (authored in `sublevel.ts`). Underground, so no windows. Vertical
 * connectors up to the main floor are authored in the upper modules.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR } from './layout';

export function authorBasement(b: MansionBuilder): void {
  const f = FLOOR.basement;

  // Service spine (2-cell servant passage) across the working floor.
  b.corridor(f, { x0: 6, z0: 28, x1: 73, z1: 29 });

  // North range, ranked west→east, each doored to the spine.
  b.room(f, { x0: 6, z0: 4, x1: 20, z1: 27 }); // coal cellar
  b.room(f, { x0: 21, z0: 4, x1: 35, z1: 27 }); // larder
  b.room(f, { x0: 36, z0: 4, x1: 50, z1: 27 }); // cold store
  b.room(f, { x0: 51, z0: 4, x1: 63, z1: 27 }); // servants' hall
  b.room(f, { x0: 64, z0: 4, x1: 73, z1: 27 }); // service-core foot
  b.door(f, { x: 13, z: 27 }, { x: 13, z: 28 });
  b.door(f, { x: 28, z: 27 }, { x: 28, z: 28 });
  b.door(f, { x: 43, z: 27 }, { x: 43, z: 28 });
  b.door(f, { x: 57, z: 27 }, { x: 57, z: 28 });
  b.door(f, { x: 68, z: 27 }, { x: 68, z: 28 });

  // South range, each doored to the spine.
  b.room(f, { x0: 6, z0: 30, x1: 24, z1: 53 }); // wine cellar (hides the jib)
  b.room(f, { x0: 25, z0: 30, x1: 40, z1: 53 }); // boiler / strong room
  b.room(f, { x0: 41, z0: 30, x1: 55, z1: 53 }); // lamp room
  b.room(f, { x0: 56, z0: 30, x1: 73, z1: 53 }); // wood store (chute landing)
  b.door(f, { x: 15, z: 30 }, { x: 15, z: 29 });
  b.door(f, { x: 32, z: 30 }, { x: 32, z: 29 });
  b.door(f, { x: 48, z: 30 }, { x: 48, z: 29 });
  b.door(f, { x: 64, z: 30 }, { x: 64, z: 29 });
}
