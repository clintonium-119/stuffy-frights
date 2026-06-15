/**
 * Pure parsing for the enemy viewer / debug route. The canonical enemy keys are
 * the only accepted tokens (matched case-insensitively); there are no aliases.
 * No DOM access — unit-testable.
 */

export type EnemyKey = 'pou' | 'fuggie' | 'littleTimmy' | 'newYama';

/** Canonical keys, in a stable display order (for the viewer's enemy switcher). */
export const ENEMY_KEYS: readonly EnemyKey[] = ['pou', 'fuggie', 'littleTimmy', 'newYama'];

/**
 * Resolve an enemy from a route fragment — accepts a hash (`#pou`,
 * `#viewer/newYama`), a search string (`?enemy=littleTimmy`), or a bare token.
 * Matches the canonical key case-insensitively; returns null when nothing matches.
 */
export function parseViewerRoute(fragment: string | null | undefined): { enemy: EnemyKey } | null {
  if (!fragment) return null;
  let token = fragment.trim();
  // Strip a leading '#' or '?'.
  token = token.replace(/^[#?]/, '');
  // `enemy=foo` (search param) → foo.
  const eq = token.match(/(?:^|&)enemy=([^&]+)/i);
  if (eq) token = eq[1];
  // `viewer/foo` or any `a/b/foo` → last path segment.
  if (token.includes('/')) token = token.slice(token.lastIndexOf('/') + 1);
  token = token.trim().toLowerCase();
  const enemy = ENEMY_KEYS.find((k) => k.toLowerCase() === token);
  return enemy ? { enemy } : null;
}
