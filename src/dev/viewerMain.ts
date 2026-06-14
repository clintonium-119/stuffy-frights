import { EnemyViewer } from './EnemyViewer';
import { parseViewerRoute } from './enemyViewerRoute';

/**
 * Entry point for viewer.html — the dev-only enemy studio. Pick the enemy
 * from `?enemy=` or the hash (`#llama`); default to the llama.
 */
const canvas = document.getElementById('viewer') as HTMLCanvasElement;
const route = parseViewerRoute(location.hash) ?? parseViewerRoute(location.search);
const viewer = new EnemyViewer(canvas, route?.enemy ?? 'newyama');
// Dev convenience: expose for console / automated inspection.
(window as unknown as { __viewer: EnemyViewer }).__viewer = viewer;

// Re-pick on hash change without a reload.
window.addEventListener('hashchange', () => {
  const next = parseViewerRoute(location.hash);
  if (next) viewer.setEnemy(next.enemy);
});
