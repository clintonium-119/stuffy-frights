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

// ?glb=<file> loads a raw GLB from public/models/ to inspect AI-generated meshes.
const params = new URLSearchParams(location.search);
const glb = params.get('glb');
if (glb) viewer.loadGlb(glb.endsWith('.glb') ? glb : `${glb}.glb`, params.get('tex') ?? undefined, params.get('rig') === '1');
// ?ai=1 — load the enemy class with its AI mesh body (rigged), driven by the controls.
if (params.get('ai') === '1') {
  viewer.aiMode = true;
  const e = parseViewerRoute(location.hash) ?? parseViewerRoute(location.search);
  viewer.setEnemy(e?.enemy ?? 'newyama');
}

// Re-pick on hash change without a reload.
window.addEventListener('hashchange', () => {
  const next = parseViewerRoute(location.hash);
  if (next) viewer.setEnemy(next.enemy);
});
