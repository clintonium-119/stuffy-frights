import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  interiorModels,
  interiorCategories,
  interiorModelsByCategory,
} from '../world/assets/catalog';
import { InteriorLibrary, type ModelPlacement } from '../world/assets/ModelLibrary';

/**
 * Throwaway dev smoke for the interior asset library:
 * instances one representative model per category in a grid, plus 64 copies of
 * one model to exercise instancing, and exposes draw-call / triangle counts on
 * `window.__smoke` for an in-browser perf check. Not a shipped entry.
 */
const canvas = document.getElementById('viewer') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202428);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
camera.position.set(18, 16, 30);
const controls = new OrbitControls(camera, canvas);
controls.target.set(10, 1, 14);

scene.add(new THREE.AmbientLight(0xffffff, 0.75));
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(15, 30, 10);
scene.add(dir);
scene.add(new THREE.GridHelper(60, 60, 0x445566, 0x2a3138));

function resize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

const lib = new InteriorLibrary();

async function main(): Promise<void> {
  const placements: ModelPlacement[] = [];
  // One representative model per category, in a grid.
  interiorCategories().forEach((cat, i) => {
    const m = interiorModelsByCategory(cat)[0];
    const x = (i % 6) * 4;
    const z = Math.floor(i / 6) * 4;
    placements.push({ id: m.id, matrix: new THREE.Matrix4().makeTranslation(x, 0, z) });
  });
  // Stress instancing: 64 copies of one model.
  const stress = interiorModelsByCategory('Chair')[0] ?? interiorModels[0];
  for (let i = 0; i < 64; i++) {
    const x = 2 + (i % 8) * 1.5;
    const z = 22 + Math.floor(i / 8) * 1.5;
    placements.push({ id: stress.id, matrix: new THREE.Matrix4().makeTranslation(x, 0, z) });
  }

  await lib.preload(placements.map((p) => p.id));
  const meshes = lib.buildInstanced(placements);
  meshes.forEach((m) => scene.add(m));

  renderer.render(scene, camera);
  const r = renderer.info.render;
  (window as unknown as Record<string, unknown>).__smoke = {
    placements: placements.length,
    instancedMeshes: meshes.length,
    drawCalls: () => renderer.info.render.calls,
    triangles: () => renderer.info.render.triangles,
  };
  // eslint-disable-next-line no-console
  console.log(
    `[interior-smoke] placements=${placements.length} instancedMeshes=${meshes.length} ` +
      `drawCalls=${r.calls} triangles=${r.triangles}`,
  );
}

function loop(): void {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
main().catch((e) => console.error('[interior-smoke]', e));
