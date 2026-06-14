/**
 * Stored, per-model camera-projection settings — tuned in the dev viewer and
 * saved here so projection is reproducible: if the source photos change (e.g.
 * new "mean face" fronts), re-running the projection with these values
 * reprojects everything consistently.
 *
 * Each view (front/back/side) has an independent UV transform: scale (zoom about
 * centre), offset (pan), rot (radians). `base` is the toy's average colour
 * (computed from its photos, excluding the white background) used to fill any
 * area the projection can't cover — so blends match the texture, not white.
 *
 * Keys are texture-file prefixes (pou/fuggler/gorilla/llama). The game maps each
 * enemy id to its model via ENEMY_MODEL.
 */
export interface ViewXform {
  scale: [number, number];
  offset: [number, number];
  rot: number;
}
export interface EnemyProjection {
  base: number;
  front: ViewXform;
  back: ViewXform;
  side: ViewXform;
}

const id = (): ViewXform => ({ scale: [1, 1], offset: [0, 0], rot: 0 });

export const PROJECTION: Record<string, EnemyProjection> = {
  pou: { base: 0x9c8565, front: id(), back: id(), side: id() },
  fuggler: { base: 0x316f6c, front: id(), back: id(), side: id() },
  gorilla: { base: 0x6f9785, front: id(), back: id(), side: id() },
  llama: { base: 0x8b7144, front: id(), back: id(), side: id() },
};

/** Enemy id → texture-model prefix. */
export const ENEMY_MODEL: Record<string, string> = {
  poo: 'pou',
  fuggie: 'fuggler',
  charles: 'gorilla',
  newYama: 'llama',
};
