import { EnemyBase } from './EnemyBase';

/**
 * Poo (displayed in-game as "Pou") — the tan velour alien plush. The body is the
 * Meshy GLB (`public/models/pou.glb`), rigged + articulated by EnemyBase via the
 * `pou` rig config.
 */
export class Poo extends EnemyBase {
  constructor() {
    super('poo');
    this.init();
  }
}
