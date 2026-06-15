import { EnemyViewer } from './EnemyViewer';
import { parseViewerRoute } from './enemyViewerRoute';
import { mountEditorNav } from './editorNav';

/**
 * Entry point for enemies.html — the dev-only enemy studio (the "Enemies" page
 * of the debug editor). Pick the enemy from `?enemy=` or the hash (`#newYama`);
 * default to New Yama.
 */
mountEditorNav('enemies');
const canvas = document.getElementById('viewer') as HTMLCanvasElement;
const route = parseViewerRoute(location.hash) ?? parseViewerRoute(location.search);
const viewer = new EnemyViewer(canvas, route?.enemy ?? 'newYama');
// Dev convenience: expose for console / automated inspection.
(window as unknown as { __viewer: EnemyViewer }).__viewer = viewer;

// ?glb=<file> loads a raw GLB from public/models/ to inspect it.
const params = new URLSearchParams(location.search);
const glb = params.get('glb');
if (glb) viewer.loadGlb(glb.endsWith('.glb') ? glb : `${glb}.glb`);
// ?rigedit=1 — open the rig edit mode (place bone pivots + weight boxes).
if (params.get('rigedit') === '1') {
  const e = parseViewerRoute(location.hash) ?? parseViewerRoute(location.search);
  viewer.enterRigEdit(e?.enemy ?? 'newYama');
}

// Re-pick on hash change without a reload.
window.addEventListener('hashchange', () => {
  const next = parseViewerRoute(location.hash);
  if (next) viewer.setEnemy(next.enemy);
});
