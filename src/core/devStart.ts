import { DifficultyLevel, DIFFICULTY_ORDER } from './difficulty';
import { FLOOR_NAMES } from '../world/layoutTypes';

/**
 * Dev-only boot overrides parsed from the game URL (`?floor=N&difficulty=D`),
 * used by the floors editor's "Test in-game" jump. Absent / invalid params are
 * dropped so a bare `index.html` boots normally. Pure (no DOM) — unit-testable.
 */
export interface DevStart {
  floor?: number;
  difficulty?: DifficultyLevel;
}

export function parseDevStart(search: string): DevStart {
  const params = new URLSearchParams(search);
  const out: DevStart = {};

  const floorRaw = params.get('floor');
  if (floorRaw !== null) {
    const n = Number(floorRaw);
    if (Number.isInteger(n) && n >= 0 && n < FLOOR_NAMES.length) out.floor = n;
  }

  const diff = params.get('difficulty');
  if (diff && (DIFFICULTY_ORDER as readonly string[]).includes(diff)) {
    out.difficulty = diff as DifficultyLevel;
  }

  return out;
}
