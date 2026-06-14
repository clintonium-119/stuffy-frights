import { EnemyBase } from './EnemyBase';

/**
 * New Yama — the golden alpaca/llama. The body is the Meshy GLB
 * (`public/models/llama.glb`), rigged + articulated by EnemyBase via the `llama`
 * rig config (neck/head + four legs with stair foot-placement).
 */
export class NewYama extends EnemyBase {
  constructor() {
    super('newYama');
    this.init();
  }
}
