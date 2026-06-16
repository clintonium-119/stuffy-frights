/**
 * Assembles the hand-authored mansion from its per-level modules into a single
 * `House`. Each level module stamps its floor (and any vertical connector it
 * owns) onto the shared `MansionBuilder`; `build()` then derives edges, room
 * ids, and the nav-blocked stair set. `parseLayout()` consumes this once the
 * legacy ASCII source is retired.
 */
import { MansionBuilder } from '../authoring/build';
import { House } from '../layoutTypes';
import { MANSION_WIDTH, MANSION_DEPTH, FLOOR_COUNT } from './layout';
import { authorBasement } from './basement';
import { authorSublevel } from './sublevel';
import { authorMain } from './main';
import { authorUpstairs } from './upstairs';
import { authorAttic } from './attic';
import { authorCourtyard } from './courtyard';

export function buildMansion(): House {
  const b = new MansionBuilder(MANSION_WIDTH, MANSION_DEPTH, FLOOR_COUNT);
  authorBasement(b);
  authorSublevel(b);
  authorMain(b);
  authorUpstairs(b);
  authorAttic(b);
  authorCourtyard(b);
  return b.build();
}
