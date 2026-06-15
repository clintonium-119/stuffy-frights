import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { config, GameConfig } from '../core/config';
import { DIFFICULTY_PRESETS, DifficultyLevel } from '../core/difficulty';
import { initMaterials, plushMaterial } from '../world/materialLibrary';
import {
  floorVisibilityTargets,
  effectiveVisibility,
  VisibilityOverride,
} from '../world/floorVisibility';
import { serializeVisibility, serializeDifficultyVisibility } from './configWriter';
import { saveConfigBlock } from './saveConfig';

type Visibility = GameConfig['visibility'];

/** Edit/preview target: the baseline or a difficulty's per-floor override. */
export type FloorTarget = 'baseline' | DifficultyLevel;

/** Floor index → display name (basement, main, upstairs, attic). */
const FLOOR_NAMES = ['Basement', 'Main', 'Upstairs', 'Attic'];
const TARGETS: FloorTarget[] = ['baseline', 'easy', 'medium', 'hard', 'nightmare'];

/**
 * Dev floors editor — previews per-floor visibility/atmosphere on a
 * representative lit room (not the real house). Floor + difficulty/target
 * pickers light the room with the effective merge (baseline ← difficulty
 * override) via the shared visibility selector; a flashlight toggle shows
 * readability lit vs. unlit. Editing sliders are added in a later step.
 * Browser-only; never imported by the game.
 */
export class FloorsEditor {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly panel = document.createElement('div');

  private readonly ambient = new THREE.AmbientLight(0xffffff, 0.1);
  private readonly hemisphere = new THREE.HemisphereLight(0x303a52, 0x14100c, 0.1);
  private readonly fog = new THREE.FogExp2(0x05060a, 0.1);
  private readonly flashlight = new THREE.SpotLight(0xffe3b0, 0, 26, 0.52, 0.9);

  protected floorIndex = 1;
  protected target: FloorTarget = 'baseline';
  /** Editable clone of the baseline visibility (config.ts). */
  protected baseline: Visibility = structuredClone(config.visibility);
  /** Editable per-difficulty override arrays (easy/hard/nightmare). */
  protected overrides: Partial<Record<DifficultyLevel, VisibilityOverride>> = {};

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    initMaterials(this.renderer);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 100);
    this.camera.position.set(0, 1.5, 4);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1.1, 0);

    this.scene.fog = this.fog;
    this.scene.add(this.ambient, this.hemisphere);

    // Flashlight follows the camera (readability aid; not the real player light).
    this.flashlight.penumbra = 0.9;
    this.flashlight.target.position.set(0, 0, -1);
    this.camera.add(this.flashlight, this.flashlight.target);
    this.scene.add(this.camera);

    // Clone the per-difficulty overrides so the sliders edit copies, not the imports.
    for (const lvl of ['easy', 'hard', 'nightmare'] as DifficultyLevel[]) {
      const v = DIFFICULTY_PRESETS[lvl].visibility;
      if (v?.ambientIntensityByFloor && v?.hemisphereIntensityByFloor) {
        this.overrides[lvl] = {
          ambientIntensityByFloor: [...v.ambientIntensityByFloor] as [number, number, number, number],
          hemisphereIntensityByFloor: [...v.hemisphereIntensityByFloor] as [number, number, number, number],
        };
      }
    }

    this.buildRoom();
    this.loadEnvironment();
    this.applyFloor();
    this.buildPanel();

    window.addEventListener('resize', () => this.onResize());
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  /** A representative room: floor + 3 walls + a few plush props. */
  private buildRoom(): void {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x3a3430, roughness: 0.95 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8).rotateX(-Math.PI / 2), floorMat);
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x4a4038, roughness: 1 });
    const wall = (w: number, h: number, x: number, y: number, z: number, ry: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
      m.position.set(x, y, z);
      m.rotation.y = ry;
      m.receiveShadow = true;
      this.scene.add(m);
    };
    wall(8, 3, 0, 1.5, -4, 0); // back
    wall(8, 3, -4, 1.5, 0, Math.PI / 2); // left
    wall(8, 3, 4, 1.5, 0, -Math.PI / 2); // right

    // A few plush props so the gloom/sheen reads on real materials.
    const props: Array<[number, number]> = [
      [-1.3, 0x7ed9c4],
      [1.4, 0xd9b286],
      [0, 0xb58fd0],
    ];
    props.forEach(([x, color], i) => {
      const mat = plushMaterial({ color });
      const mesh = new THREE.Mesh(
        i === 1 ? new THREE.SphereGeometry(0.5, 24, 18) : new THREE.BoxGeometry(0.9, 0.9, 0.9),
        mat
      );
      mesh.position.set(x, 0.5, -1 + i * 0.6);
      mesh.castShadow = true;
      this.scene.add(mesh);
    });
  }

  private loadEnvironment(): void {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    new RGBELoader().load(`${import.meta.env.BASE_URL}hdri/abandoned_games_room_01_1k.hdr`, (hdr) => {
      this.scene.environment = pmrem.fromEquirectangular(hdr).texture;
      hdr.dispose();
    });
  }

  /** The (editable) override arrays for a target (none for baseline / medium). */
  protected overrideFor(target: FloorTarget): VisibilityOverride | undefined {
    if (target === 'baseline' || target === 'medium') return undefined;
    return this.overrides[target];
  }

  /** The per-floor ambient + hemisphere arrays the current target edits. */
  private targetArrays(): { amb: number[]; hemi: number[] } {
    const o = this.overrideFor(this.target);
    if (o?.ambientIntensityByFloor && o?.hemisphereIntensityByFloor) {
      return { amb: o.ambientIntensityByFloor, hemi: o.hemisphereIntensityByFloor };
    }
    return { amb: this.baseline.ambientIntensityByFloor, hemi: this.baseline.hemisphereIntensityByFloor };
  }

  /** Light the room with the effective merge for the current floor + target. */
  protected applyFloor(): void {
    const eff = effectiveVisibility(this.baseline, this.overrideFor(this.target));
    const t = floorVisibilityTargets(eff, this.floorIndex);
    this.ambient.color.setHex(eff.ambientColor);
    this.ambient.intensity = t.ambient;
    this.hemisphere.intensity = t.hemisphere;
    this.fog.color.setHex(eff.fogColor);
    this.fog.density = t.fogDensity;
    this.scene.background = new THREE.Color(eff.fogColor);
    this.renderer.toneMappingExposure = eff.toneExposure;
    this.scene.environmentIntensity = eff.environmentIntensity;
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ---- panel ----
  private buildPanel(): void {
    this.panel.style.cssText =
      'position:fixed;top:42px;left:8px;width:236px;background:#0b0e12ee;color:#cdd;' +
      'font:11px ui-monospace,monospace;padding:10px;border-radius:8px;z-index:20;max-height:90vh;overflow-y:auto;overflow-x:hidden';
    document.body.appendChild(this.panel);
    this.refreshPanel();
  }

  private buttonRow<T extends string | number>(
    label: string,
    options: Array<{ value: T; label: string }>,
    current: T,
    on: (v: T) => void
  ): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin:4px 0';
    wrap.appendChild(Object.assign(document.createElement('div'), { textContent: label, style: 'color:#8af;margin-bottom:2px' }));
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px';
    for (const o of options) {
      const b = document.createElement('button');
      b.textContent = o.label;
      b.style.cssText =
        `padding:3px 7px;border:0;border-radius:4px;cursor:pointer;color:#cde;` +
        `background:${o.value === current ? '#46a' : '#28303a'}`;
      b.onclick = () => on(o.value);
      row.appendChild(b);
    }
    wrap.appendChild(row);
    return wrap;
  }

  /** A labelled range row; edits apply live (no full panel rebuild). */
  private numRow(label: string, value: number, min: number, max: number, step: number, on: (v: number) => void): HTMLElement {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:6px;margin:2px 0';
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = String(min);
    inp.max = String(max);
    inp.step = String(step);
    inp.value = String(value);
    inp.style.flex = '1';
    const val = document.createElement('span');
    val.textContent = value.toFixed(3);
    val.style.width = '42px';
    inp.oninput = () => {
      on(+inp.value);
      val.textContent = (+inp.value).toFixed(3);
      this.applyFloor();
    };
    row.append(Object.assign(document.createElement('span'), { textContent: label, style: 'width:58px' }), inp, val);
    return row;
  }

  /** A labelled colour input bound to a hex-number value. */
  private colorRow(label: string, hex: number, on: (v: number) => void): HTMLElement {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:6px;margin:2px 0';
    const inp = document.createElement('input');
    inp.type = 'color';
    inp.value = `#${hex.toString(16).padStart(6, '0')}`;
    inp.oninput = () => {
      on(parseInt(inp.value.slice(1), 16));
      this.applyFloor();
    };
    row.append(Object.assign(document.createElement('span'), { textContent: label, style: 'flex:1' }), inp);
    return row;
  }

  private heading(text: string): HTMLElement {
    return Object.assign(document.createElement('div'), { textContent: text, style: 'margin:6px 0 2px;color:#8af' });
  }

  protected refreshPanel(): void {
    this.panel.innerHTML = '';
    this.panel.appendChild(
      Object.assign(document.createElement('div'), {
        innerHTML: '<b>floors — visibility</b>',
        style: 'margin-bottom:6px',
      })
    );
    this.panel.appendChild(
      this.buttonRow(
        'floor',
        FLOOR_NAMES.map((n, i) => ({ value: i, label: n })),
        this.floorIndex,
        (v) => {
          this.floorIndex = v;
          this.applyFloor();
          this.refreshPanel();
        }
      )
    );
    this.panel.appendChild(
      this.buttonRow(
        'target',
        TARGETS.map((t) => ({ value: t, label: t })),
        this.target,
        (v) => {
          this.target = v;
          this.applyFloor();
          this.refreshPanel();
        }
      )
    );
    // Per-floor edits for the current floor + target (ambient/hemisphere → target;
    // fog density → baseline). The target label clarifies where these land.
    const fi = this.floorIndex;
    const arrays = this.targetArrays();
    const scope = this.target === 'baseline' || this.target === 'medium' ? 'baseline' : this.target;
    this.panel.appendChild(this.heading(`${FLOOR_NAMES[fi]} — ambient/hemi → ${scope}`));
    this.panel.appendChild(this.numRow('ambient', arrays.amb[fi], 0, 0.3, 0.005, (v) => (arrays.amb[fi] = v)));
    this.panel.appendChild(this.numRow('hemi', arrays.hemi[fi], 0, 0.3, 0.005, (v) => (arrays.hemi[fi] = v)));
    this.panel.appendChild(
      this.numRow('fog dens', this.baseline.fogDensityByFloor[fi], 0, 0.3, 0.005, (v) => (this.baseline.fogDensityByFloor[fi] = v))
    );

    this.panel.appendChild(this.heading('global (baseline, all floors)'));
    this.panel.appendChild(this.numRow('exposure', this.baseline.toneExposure, 0.5, 1.5, 0.05, (v) => (this.baseline.toneExposure = v)));
    this.panel.appendChild(this.numRow('environ', this.baseline.environmentIntensity, 0, 0.3, 0.005, (v) => (this.baseline.environmentIntensity = v)));
    this.panel.appendChild(this.colorRow('fog colour', this.baseline.fogColor, (v) => (this.baseline.fogColor = v)));
    this.panel.appendChild(this.colorRow('ambient colour', this.baseline.ambientColor, (v) => (this.baseline.ambientColor = v)));

    const fl = document.createElement('button');
    fl.textContent = this.flashlight.intensity > 0 ? 'flashlight: on' : 'flashlight: off';
    fl.style.cssText =
      'width:100%;margin-top:6px;padding:5px;border:0;border-radius:5px;cursor:pointer;color:#cde;' +
      `background:${this.flashlight.intensity > 0 ? '#2a6' : '#28303a'}`;
    fl.onclick = () => {
      this.flashlight.intensity = this.flashlight.intensity > 0 ? 0 : 60;
      this.refreshPanel();
    };
    this.panel.appendChild(fl);

    this.panel.appendChild(this.saveButton());
  }

  /**
   * Save the current target to source: Baseline/Medium → the config.ts baseline
   * `visibility` block; Easy/Hard/Nightmare → that preset's override in
   * difficulty.ts. (Medium has no override and routes to the baseline.)
   */
  protected saveButton(): HTMLElement {
    const b = document.createElement('button');
    const o = this.overrideFor(this.target);
    const toDifficulty = !!(o?.ambientIntensityByFloor && o?.hemisphereIntensityByFloor);
    const label = toDifficulty ? `save ${this.target}` : 'save baseline';
    b.textContent = label;
    b.style.cssText =
      'width:100%;margin-top:8px;padding:5px;border:0;border-radius:5px;cursor:pointer;color:#fff;background:#2a6';
    b.onclick = () => {
      b.textContent = 'saving…';
      const save = toDifficulty
        ? saveConfigBlock(
            'src/core/difficulty.ts',
            `vis-${this.target}`,
            serializeDifficultyVisibility({
              ambientIntensityByFloor: o!.ambientIntensityByFloor!,
              hemisphereIntensityByFloor: o!.hemisphereIntensityByFloor!,
            })
          )
        : saveConfigBlock('src/core/config.ts', 'visibility', serializeVisibility(this.baseline));
      void save.then((r) => {
        b.textContent = r.ok ? 'saved ✓' : `save failed: ${r.error ?? ''}`;
        setTimeout(() => (b.textContent = label), 1600);
      });
    };
    return b;
  }
}
