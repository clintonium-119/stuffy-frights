/**
 * Secret sub-level (floor 0) — reached only by discovering the wine-cellar jib.
 * A concealed stair drops from the cellar into a single-file tunnel that runs
 * south under the courtyard to an alchemist's lab and a prison-cell block; a far
 * areaway up to the courtyard (authored in `courtyard.ts`) closes the escape
 * loop. Authored after `basement.ts` so the jib can be cut into the cellar wall.
 */
import { MansionBuilder } from '../authoring/build';
import { FLOOR } from './layout';

export function authorSublevel(b: MansionBuilder): void {
  const sub = FLOOR.sublevel;
  const base = FLOOR.basement;

  // Concealed descent: cellar jib → stair down. The stair column is stamped on
  // both floors; entrance (8,55) lands in the sub-level tunnel, landing (8,54)
  // sits behind the cellar jib.
  b.stair({ lower: sub, upper: base, cells: [{ x: 8, z: 55 }, { x: 8, z: 54 }] });

  // Sub-level rooms.
  b.corridor(sub, { x0: 8, z0: 56, x1: 8, z1: 58 }); // single-file tunnel
  b.room(sub, { x0: 9, z0: 54, x1: 20, z1: 58 }); // alchemist's lab
  b.room(sub, { x0: 9, z0: 49, x1: 20, z1: 53 }); // prison-cell block
  b.door(sub, { x: 8, z: 57 }, { x: 9, z: 57 }); // tunnel → lab
  b.door(sub, { x: 14, z: 53 }, { x: 14, z: 54 }); // lab → prison block

  // Wall the descent shaft on both floors, then cut the jib + open the mouths.
  for (const f of [sub, base]) {
    b.wall(f, { x: 8, z: 54 }, { x: 7, z: 54 });
    b.wall(f, { x: 8, z: 54 }, { x: 9, z: 54 });
    b.wall(f, { x: 8, z: 55 }, { x: 7, z: 55 });
    b.wall(f, { x: 8, z: 55 }, { x: 9, z: 55 });
  }
  b.secret(base, { x: 8, z: 53 }, { x: 8, z: 54 }); // basement: the cellar jib
  b.wall(base, { x: 8, z: 55 }, { x: 8, z: 56 }); // basement floor below the shaft
  b.wall(sub, { x: 8, z: 54 }, { x: 8, z: 53 }); // sub-level: nothing north of the shaft
  b.open(sub, { x: 8, z: 55 }, { x: 8, z: 56 }); // sub-level: shaft → tunnel
}
