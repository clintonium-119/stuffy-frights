/**
 * Pure parsing for the enemy viewer / debug route. Maps the user-facing
 * aliases (in-game display names and folder names) to the canonical enemy
 * key used to instantiate the model. No DOM access — unit-testable.
 */

export type EnemyKey = 'poo' | 'fuggie' | 'charles' | 'newyama';

const ALIASES: Record<string, EnemyKey> = {
  poo: 'poo',
  pou: 'poo',
  fuggie: 'fuggie',
  fuggler: 'fuggie',
  charles: 'charles',
  gorilla: 'charles',
  timmy: 'charles',
  newyama: 'newyama',
  yama: 'newyama',
  llama: 'newyama',
};

/** Canonical keys, in a stable display order (for the viewer's enemy switcher). */
export const ENEMY_KEYS: readonly EnemyKey[] = ['poo', 'fuggie', 'charles', 'newyama'];

/**
 * Resolve an enemy from a route fragment — accepts a hash (`#poo`,
 * `#viewer/llama`), a search string (`?enemy=gorilla`), or a bare token.
 * Returns the canonical key, or null when nothing matches.
 */
export function parseViewerRoute(fragment: string | null | undefined): { enemy: EnemyKey } | null {
  if (!fragment) return null;
  let token = fragment.trim().toLowerCase();
  // Strip a leading '#' or '?'.
  token = token.replace(/^[#?]/, '');
  // `enemy=foo` (search param) → foo.
  const eq = token.match(/(?:^|&)enemy=([^&]+)/);
  if (eq) token = eq[1];
  // `viewer/foo` or any `a/b/foo` → last path segment.
  if (token.includes('/')) token = token.slice(token.lastIndexOf('/') + 1);
  token = token.trim();
  const enemy = ALIASES[token];
  return enemy ? { enemy } : null;
}
