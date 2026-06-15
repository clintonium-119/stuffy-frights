import { EnemyBase } from './EnemyBase';

/**
 * Little Timmy — the mint Gorilla-Tag plush. The body is the Meshy GLB
 * (`public/models/littleTimmy.glb`), rigged + articulated by EnemyBase via the
 * `littleTimmy` rig config (head + two arm-walk arms).
 */
export class LittleTimmy extends EnemyBase {
  constructor() {
    super('littleTimmy');
    this.init();
  }
}
