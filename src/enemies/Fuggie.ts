import { EnemyBase } from './EnemyBase';

/**
 * Fuggie — teal/purple shag plush. The body is the Meshy GLB
 * (`public/models/fuggie.glb`), rigged + articulated by EnemyBase via the
 * `fuggie` rig config.
 */
export class Fuggie extends EnemyBase {
  constructor() {
    super('fuggie');
    this.init();
  }
}
