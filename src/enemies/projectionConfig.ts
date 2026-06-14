/**
 * Enemy id → Meshy GLB model name (the file prefix under `public/models/`, also
 * the `rigConfig` key). The game maps each enemy to its body GLB via this.
 */
export const ENEMY_MODEL: Record<string, string> = {
  poo: 'pou',
  fuggie: 'fuggler',
  charles: 'gorilla',
  newYama: 'llama',
};
