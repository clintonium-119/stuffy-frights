import { EnemyBase } from './EnemyBase';

/**
 * Charles (displayed in-game as "Little Timmy") — the mint Gorilla-Tag plush.
 * The body is the Meshy GLB (`public/models/gorilla.glb`), rigged + articulated
 * by EnemyBase via the `gorilla` rig config (head + two arm-walk arms).
 */
export class Charles extends EnemyBase {
  constructor() {
    super('charles');
    this.init();
  }
}
