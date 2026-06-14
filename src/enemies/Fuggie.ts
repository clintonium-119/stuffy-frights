import { EnemyBase } from './EnemyBase';

/**
 * Fuggie (the "fuggler") — teal/purple shag plush. The body is the Meshy GLB
 * (`public/models/fuggler.glb`), rigged + articulated by EnemyBase via the
 * `fuggler` rig config.
 */
export class Fuggie extends EnemyBase {
  constructor() {
    super('fuggie');
    this.init();
  }
}
