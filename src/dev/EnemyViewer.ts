import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EnemyBase } from '../enemies/EnemyBase';
import { Pou } from '../enemies/Pou';
import { Fuggie } from '../enemies/Fuggie';
import { LittleTimmy } from '../enemies/LittleTimmy';
import { NewYama } from '../enemies/NewYama';
import { config } from '../core/config';
import { initMaterials } from '../world/materialLibrary';
import { EnemyKey, ENEMY_KEYS } from './enemyViewerRoute';
import { RigEditor } from './RigEditor';
import { ENEMY_TUNING, EnemyTuning, EnemyAnimTuning, EnemyGameplayTuning } from '../enemies/tuningConfig';
import { serializeTuningRecord } from './configWriter';
import { saveConfigBlock } from './saveConfig';

/** Editable anim-slider rows: [label, key, min, max, step]. */
const ANIM_SLIDERS: Array<[string, keyof EnemyAnimTuning, number, number, number]> = [
  ['swing rate', 'swingRate', 0, 8, 0.1],
  ['leg swing', 'legSwing', 0, 1.2, 0.01],
  ['arm swing', 'armSwing', 0, 1.2, 0.01],
  ['head yaw', 'headYaw', 0, 1.4, 0.02],
  ['head pitch', 'headPitch', 0, 1.4, 0.02],
  ['bob rate', 'bobRate', 0, 8, 0.1],
  ['bob', 'bob', 0, 0.5, 0.005],
  ['squash', 'squash', 0, 0.6, 0.01],
  ['rock', 'rock', 0, 0.3, 0.01],
];

/** Per-enemy gameplay multiplier rows (1.0 = the global baseline). */
const GAMEPLAY_SLIDERS: Array<[string, keyof EnemyGameplayTuning, number, number, number]> = [
  ['scale ×', 'scaleMult', 0.5, 2, 0.05],
  ['speed ×', 'speedMult', 0.5, 2, 0.05],
  ['vision ×', 'visionMult', 0.5, 2, 0.05],
  ['hearing ×', 'hearingMult', 0.5, 2, 0.05],
  ['threat ×', 'threatMult', 0.5, 2, 0.05],
];

// Reference photos, served by Vite in dev only (the viewer isn't in the build).
const REF_URLS = import.meta.glob('../../assets/enemies/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
// Reference photos are named by the canonical key (e.g. `pou_front.jpg`).
function refUrl(key: EnemyKey, angle: string): string | null {
  const file = angle === 'iso' ? `${key}.jpg` : `${key}_${angle}.jpg`;
  const hit = Object.entries(REF_URLS).find(([p]) => p.endsWith('/' + file));
  return hit ? hit[1] : null;
}

const FACTORY: Record<EnemyKey, () => EnemyBase> = {
  pou: () => new Pou(),
  fuggie: () => new Fuggie(),
  littleTimmy: () => new LittleTimmy(),
  newYama: () => new NewYama(),
};

/** Human-readable display name per enemy. */
const LABEL: Record<EnemyKey, string> = {
  pou: 'Pou',
  fuggie: 'Fuggie',
  littleTimmy: 'Little Timmy',
  newYama: 'New Yama',
};

type Mode = 'idle' | 'walk';

/** Camera angle presets, framed on the model centre. dir is a unit-ish offset. */
const PRESETS: Record<string, THREE.Vector3> = {
  front: new THREE.Vector3(0, 0.2, 1),
  back: new THREE.Vector3(0, 0.2, -1),
  left: new THREE.Vector3(-1, 0.2, 0),
  right: new THREE.Vector3(1, 0.2, 0),
  iso: new THREE.Vector3(1, 0.5, 1),
  top: new THREE.Vector3(0, 1.4, 0.15),
};

/**
 * Standalone studio viewer for dialing in one stuffy's model + animations
 * against the reference photos. Dev-only (its own Vite entry, enemies.html) —
 * never imported by the game. Reuses the real enemy classes + materials.
 */
export class EnemyViewer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly holder = new THREE.Group(); // turntable
  private readonly target = new THREE.Vector3(0, 0.7, 0);

  private enemy: EnemyBase | null = null;
  private frameDist = 2.6;
  private preset = 'front';
  private currentKey: EnemyKey = 'newYama';
  private readonly refImg = document.createElement('img');
  private refOn = false;
  private refOpacity = 0.5;
  private refAngle = 'front';
  private mode: Mode = 'idle';
  private menacing = false;
  private dark = false;
  // Studio lights + their authored intensities, so `dark` can dim and restore.
  private readonly studioLights: Array<{ light: THREE.Light; base: number }> = [];
  private envTexture: THREE.Texture | null = null;
  private turntable = false;
  private lookAtCamera = false;
  private crouchTarget = false;
  private onStairs = false;
  private last = 0;
  private readonly walkTarget = new THREE.Vector3();
  private readonly playerPos = new THREE.Vector3();
  private readonly stairs = new THREE.Group();
  // Editable per-enemy tuning clone — its anim block drives both the live enemy
  // and the rig editor (by reference), so the anim sliders show edits live.
  private readonly tuning: Record<string, EnemyTuning> = structuredClone(ENEMY_TUNING);
  private readonly animPanel = document.createElement('div');

  constructor(canvas: HTMLCanvasElement, initial: EnemyKey) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    initMaterials(this.renderer);

    this.scene.background = new THREE.Color(0x202428);
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.copy(this.target);

    this.refImg.style.cssText =
      'position:fixed;inset:0;margin:auto;max-width:96%;max-height:88%;pointer-events:none;' +
      'opacity:0;z-index:5;object-fit:contain;display:none';
    document.body.appendChild(this.refImg);

    this.buildStudio();
    this.scene.add(this.holder, this.stairs);
    this.loadEnvironment();
    this.setEnemy(initial);
    this.applyPreset('front');
    this.buildControlBar();
    this.buildAnimPanel();

    window.addEventListener('resize', () => this.onResize());
    this.renderer.setAnimationLoop((t) => this.frame(t / 1000));
  }

  private buildStudio(): void {
    // Neutral studio: soft ambient + hemisphere fill + a warm key with shadow.
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);
    const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x3a2f28, 0.6);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff2e0, 1.6);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fb6ff, 0.5);
    rim.position.set(-4, 3, -5);
    this.scene.add(rim);
    // Remember each light's authored intensity so the `dark` toggle can restore.
    for (const l of [ambient, hemi, key, rim]) this.studioLights.push({ light: l, base: l.intensity });

    // Ground disc.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(6, 48).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x4a4f55, roughness: 0.95 })
    );
    ground.receiveShadow = true;
    this.scene.add(ground);
    const grid = new THREE.GridHelper(12, 24, 0x666666, 0x393d42);
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    this.scene.add(grid);

    // A ramp under the enemy (toggled) to dial in stair foot-placement: the
    // surface rises toward +Z (front), so the leading feet step up.
    const rampMat = new THREE.MeshStandardMaterial({ color: 0x5a5048, roughness: 1 });
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), rampMat);
    // Tilt so the top face slopes; the front (+Z) end is LOWER, so an enemy
    // walking forward (+Z) is descending — the case to dial in.
    const slope = Math.atan2(EnemyViewer.RAMP_RISE, 1.2);
    ramp.rotation.x = slope;
    ramp.position.set(0, EnemyViewer.RAMP_RISE / 2, 0);
    ramp.receiveShadow = true;
    this.stairs.add(ramp);
    this.stairs.visible = false;
  }

  private loadEnvironment(): void {
    // Same HDRI the game uses — gives the plush sheen something to reflect.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    new RGBELoader().load(
      `${import.meta.env.BASE_URL}hdri/abandoned_games_room_01_1k.hdr`,
      (hdr) => {
        this.envTexture = pmrem.fromEquirectangular(hdr).texture;
        if (!this.dark) this.scene.environment = this.envTexture;
        hdr.dispose();
      }
    );
  }

  /**
   * Toggle a near-dark stage so the menacing eye-glow reads like it does in the
   * game (emissive vs. almost no light). Dims the studio lights, blacks the
   * background, and drops the HDRI environment; restoring brings them all back.
   */
  private setDark(on: boolean): void {
    this.dark = on;
    for (const { light, base } of this.studioLights) light.intensity = on ? base * 0.04 : base;
    this.scene.background = new THREE.Color(on ? 0x04050a : 0x202428);
    this.scene.environment = on ? null : this.envTexture;
  }

  /** Dev: load a raw GLB into the studio to inspect it (no rig/material changes). */
  loadGlb(file: string): void {
    if (this.enemy) {
      this.holder.remove(this.enemy.group);
      this.enemy = null;
    }
    new GLTFLoader().load(`${import.meta.env.BASE_URL}models/${file}`, (gltf) => {
      const root = gltf.scene;
      // Hunyuan meshes come in Y-up but often scaled ~unit; normalize to ~1.2m tall.
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const s = 1.3 / Math.max(size.x, size.y, size.z, 0.001);
      root.scale.setScalar(s);
      root.position.y = -box.min.y * s;
      root.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      this.holder.add(root);
      const b2 = new THREE.Box3().setFromObject(root);
      const c2 = b2.getCenter(new THREE.Vector3());
      this.target.set(0, c2.y, 0);
      const r = b2.getSize(new THREE.Vector3()).length() * 0.5;
      const fov = (this.camera.fov * Math.PI) / 180;
      this.frameDist = (r / Math.sin(fov / 2)) * 0.9 + 0.3;
      this.applyPreset('front');
    });
    document.title = `Viewer — GLB ${file}`;
  }

  private rigEditor: RigEditor | null = null;

  /** Enter the rig edit mode for an enemy (replaces the live enemy display). */
  enterRigEdit(key: EnemyKey): void {
    if (this.enemy) {
      this.holder.remove(this.enemy.group);
      this.enemy = null;
    }
    this.rigEditor?.dispose();
    this.currentKey = key;
    this.rigEditor = new RigEditor(
      this.scene,
      key,
      this.camera,
      this.renderer.domElement,
      this.controls,
      this.currentAnim()
    );
    this.refreshAnimPanel();
    this.target.set(0, 0.75, 0);
    this.frameDist = 3.4;
    this.applyPreset('front');
  }

  setEnemy(key: EnemyKey): void {
    this.rigEditor?.dispose();
    this.rigEditor = null;
    if (this.enemy) this.holder.remove(this.enemy.group);
    this.currentKey = key;
    this.enemy = FACTORY[key]();
    // Inject the editable anim tuning so the panel's sliders drive the live gait.
    this.enemy.animTuning = this.currentAnim();
    this.enemy.setScaleMult(this.currentGameplay().scaleMult);
    this.holder.add(this.enemy.group);
    document.title = `Viewer — ${LABEL[key]}`;
    this.onStairs = false;
    this.stairs.visible = false;
    this.holder.rotation.y = 0;
    this.holder.position.set(0, 0, 0);
    this.fitToModel();
    this.applyPreset(this.preset);
    this.refreshAnimPanel();
    if (this.enemy) void this.enemy.useAiMesh().then(() => this.fitToModel());
  }

  private currentAnim(): EnemyAnimTuning {
    return this.tuning[this.currentKey].anim;
  }

  private currentGameplay(): EnemyGameplayTuning {
    return this.tuning[this.currentKey].gameplay;
  }

  /** Fixed top-left panel: live animation + characteristics sliders. */
  private buildAnimPanel(): void {
    this.animPanel.style.cssText =
      'position:fixed;top:8px;left:8px;width:215px;background:#0b0e12ee;color:#cdd;' +
      'font:11px ui-monospace,monospace;padding:10px;border-radius:8px;z-index:15;max-height:92vh;overflow:auto';
    document.body.appendChild(this.animPanel);
    this.refreshAnimPanel();
  }

  /** A labelled range row that writes back through `onInput` on each change. */
  private sliderRow(label: string, value: number, min: number, max: number, step: number, onInput: (v: number) => void): HTMLElement {
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
    val.textContent = value.toFixed(2);
    val.style.width = '34px';
    inp.oninput = () => {
      onInput(+inp.value);
      val.textContent = (+inp.value).toFixed(2);
    };
    row.append(
      Object.assign(document.createElement('span'), { textContent: label, style: 'width:64px' }),
      inp,
      val
    );
    return row;
  }

  private heading(text: string): HTMLElement {
    const h = document.createElement('div');
    h.textContent = text;
    h.style.cssText = 'margin:6px 0 2px;color:#8af';
    return h;
  }

  private refreshAnimPanel(): void {
    const anim = this.currentAnim();
    const gp = this.currentGameplay();
    this.animPanel.innerHTML = '';
    const title = document.createElement('div');
    title.innerHTML = `<b>tuning — ${this.currentKey}</b>`;
    title.style.marginBottom = '6px';
    this.animPanel.appendChild(title);

    this.animPanel.appendChild(this.heading('animation'));
    for (const [label, key, min, max, step] of ANIM_SLIDERS) {
      this.animPanel.appendChild(
        this.sliderRow(label, anim[key], min, max, step, (v) => (anim[key] = v))
      );
    }

    this.animPanel.appendChild(this.heading('characteristics (× baseline)'));
    for (const [label, key, min, max, step] of GAMEPLAY_SLIDERS) {
      this.animPanel.appendChild(
        this.sliderRow(label, gp[key], min, max, step, (v) => {
          gp[key] = v;
          if (key === 'scaleMult' && this.enemy) this.enemy.setScaleMult(v); // live resize
        })
      );
    }

    this.appendAnimSaveButton();
  }

  /** Save the whole edited tuning record back to tuningConfig.ts via the endpoint. */
  private appendAnimSaveButton(): void {
    const save = document.createElement('button');
    save.textContent = 'save tuning';
    save.style.cssText =
      'width:100%;margin-top:8px;padding:5px;background:#2a6;color:#fff;border:0;border-radius:5px;cursor:pointer';
    save.onclick = () => {
      const body = serializeTuningRecord(this.tuning);
      save.textContent = 'saving…';
      void saveConfigBlock('src/enemies/tuningConfig.ts', 'enemyTuning', body).then((r) => {
        save.textContent = r.ok ? 'saved ✓' : `save failed: ${r.error ?? ''}`;
        setTimeout(() => (save.textContent = 'save tuning'), 1600);
      });
    };
    this.animPanel.appendChild(save);
  }

  /** Centre + distance the camera framing on the current model's bounds. */
  private fitToModel(): void {
    if (!this.enemy) return;
    const box = new THREE.Box3().setFromObject(this.enemy.group);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    this.target.set(0, center.y, 0);
    const radius = Math.max(size.x, size.y, size.z) * 0.5;
    // Fit the largest extent into ~70% of the vertical FOV.
    const fov = (this.camera.fov * Math.PI) / 180;
    this.frameDist = (radius / Math.sin(fov / 2)) * 1.5 + 0.4;
  }

  applyPreset(name: keyof typeof PRESETS | string): void {
    this.preset = name;
    const dir = PRESETS[name] ?? PRESETS.front;
    this.camera.position.copy(this.target).addScaledVector(dir.clone().normalize(), this.frameDist);
    this.controls.target.copy(this.target);
    this.controls.update();
    // Sync the reference overlay to the matching photographed angle.
    const angle =
      name === 'left' || name === 'right' ? 'side' : name === 'top' ? this.refAngle : name;
    this.refAngle = angle;
    this.updateRef();
  }

  private updateRef(): void {
    const url = this.refOn ? refUrl(this.currentKey, this.refAngle) : null;
    if (url) {
      this.refImg.src = url;
      this.refImg.style.display = 'block';
      this.refImg.style.opacity = String(this.refOpacity);
    } else {
      this.refImg.style.display = 'none';
      this.refImg.style.opacity = '0';
    }
  }

  private frame(time: number): void {
    if (!this.last) this.last = time;
    const dt = Math.min(time - this.last, 0.05);
    this.last = time;
    const e = this.enemy;
    if (e) {
      if (this.mode === 'walk') {
        // Treadmill: aim ahead, then recentre so it strides in place.
        this.walkTarget.set(0, e.position.y, 40);
        const baseSpeed = this.menacing ? config.ai.chaseSpeed : config.ai.patrolSpeed;
        e.setMoveTarget(this.walkTarget, baseSpeed * this.currentGameplay().speedMult);
      } else {
        e.setMoveTarget(null, 0);
      }
      e.isChasing = this.menacing;

      // Look target: camera (eye contact) or a low crouched-player point.
      const lookPos =
        this.crouchTarget
          ? new THREE.Vector3(this.target.x, 0.25, this.target.z + 1.5)
          : this.camera.position.clone();
      // Feed the articulation look-context if the build supports it.
      const look = (e as unknown as {
        setLookContext?: (p: THREE.Vector3, crouch: boolean, intensity: number) => void;
      }).setLookContext;
      if (look) look.call(e, lookPos, this.crouchTarget, this.lookAtCamera || this.crouchTarget ? 1 : 0);

      // Mood is driven only by the `menacing` toggle here — keep the simulated
      // player far so proximity doesn't force menacing in the studio.
      this.playerPos.set(0, 0.5, 1000);
      e.update(dt, this.playerPos, false);
      if (this.mode === 'walk') {
        e.group.position.x = 0;
        e.group.position.z = 0;
      }
      if (this.turntable) this.holder.rotation.y += dt * 0.6;
    }
    // Rig edit mode: drive the editor's own bones with the shared articulation
    // so rig changes are seen against the real idle / walk / crouch-look motion.
    if (this.rigEditor) {
      const moving = this.mode === 'walk';
      let lookTarget: THREE.Vector3 | null = null;
      let lookIntensity = 0;
      if (this.crouchTarget) {
        lookTarget = new THREE.Vector3(this.target.x, 0.25, this.target.z + 1.5);
        lookIntensity = 1;
      } else if (this.lookAtCamera) {
        lookTarget = this.camera.position.clone();
        lookIntensity = 1;
      }
      this.rigEditor.tick(dt, { moving, lookTarget, lookIntensity });
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private buildControlBar(): void {
    const bar = document.createElement('div');
    bar.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;padding:8px;display:flex;flex-wrap:wrap;gap:6px;' +
      'background:rgba(10,12,16,0.82);font:12px sans-serif;color:#ddd;z-index:10;align-items:center';
    const mk = (label: string, on: () => void, group = '') => {
      const b = document.createElement('button');
      b.textContent = label;
      b.dataset.group = group;
      b.style.cssText =
        'padding:5px 9px;border:1px solid #555;border-radius:5px;background:#23272e;color:#eee;cursor:pointer';
      b.onclick = () => on();
      bar.appendChild(b);
      return b;
    };
    const sep = () => {
      const s = document.createElement('span');
      s.style.cssText = 'width:1px;height:20px;background:#444;margin:0 4px';
      bar.appendChild(s);
    };

    for (const k of ENEMY_KEYS) mk(LABEL[k], () => this.setEnemy(k));
    sep();
    mk('rig edit', () => this.enterRigEdit(this.currentKey));
    sep();
    for (const p of Object.keys(PRESETS)) mk(p, () => this.applyPreset(p));
    sep();
    const idle = mk('idle', () => {});
    const walk = mk('walk', () => {});
    idle.onclick = () => {
      this.mode = 'idle';
      idle.style.outline = '2px solid #6cf';
      walk.style.outline = 'none';
    };
    walk.onclick = () => {
      this.mode = 'walk';
      walk.style.outline = '2px solid #6cf';
      idle.style.outline = 'none';
    };
    idle.click();
    sep();
    const toggle = (label: string, get: () => boolean, set: (v: boolean) => void) => {
      const b = mk(label, () => {});
      const sync = () => (b.style.outline = get() ? '2px solid #fc6' : 'none');
      b.onclick = () => {
        set(!get());
        sync();
      };
      sync();
      return b;
    };
    toggle('menacing', () => this.menacing, (v) => (this.menacing = v));
    toggle('dark', () => this.dark, (v) => this.setDark(v));
    toggle('turntable', () => this.turntable, (v) => (this.turntable = v));
    toggle('look@cam', () => this.lookAtCamera, (v) => (this.lookAtCamera = v));
    toggle('crouch-look', () => this.crouchTarget, (v) => (this.crouchTarget = v));
    toggle('stairs', () => this.onStairs, (v) => this.setStairs(v));
    sep();
    toggle('ref', () => this.refOn, (v) => {
      this.refOn = v;
      this.updateRef();
    });
    mk('ref −', () => {
      this.refOpacity = Math.max(0.1, this.refOpacity - 0.15);
      this.updateRef();
    });
    mk('ref +', () => {
      this.refOpacity = Math.min(1, this.refOpacity + 0.15);
      this.updateRef();
    });
    document.body.appendChild(bar);
  }

  private static readonly RAMP_RISE = 0.44;

  /** Top-surface height of the toggled ramp at world z (descends toward +Z). */
  private rampHeight(z: number): number {
    const h = ((0.6 - z) / 1.2) * EnemyViewer.RAMP_RISE;
    return Math.max(0, Math.min(EnemyViewer.RAMP_RISE, h));
  }

  /** Toggle the ramp: stand the enemy on it + feed the floor-height sampler. */
  private setStairs(on: boolean): void {
    this.onStairs = on;
    this.stairs.visible = on;
    if (this.enemy) {
      this.holder.position.set(0, on ? this.rampHeight(0) : 0, 0);
      this.enemy.floorHeightAt = on ? (_x, z) => this.rampHeight(z) : null;
    }
  }
}
