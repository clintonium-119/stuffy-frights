import { EnemyBase } from './EnemyBase';

/**
 * Pou — the tan velour alien plush. The body is the Meshy GLB
 * (`public/models/pou.glb`), rigged + articulated by EnemyBase via the `pou`
 * rig config.
 */
export class Pou extends EnemyBase {
  constructor() {
    super('pou');
    this.init();
  }
}
