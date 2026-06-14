import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EnemyBase } from '../enemies/EnemyBase';
import { Poo } from '../enemies/Poo';
import { Fuggie } from '../enemies/Fuggie';
import { Charles } from '../enemies/Charles';
import { NewYama } from '../enemies/NewYama';
import { config } from '../core/config';
import { initMaterials } from '../world/materialLibrary';
import { EnemyKey, ENEMY_KEYS } from './enemyViewerRoute';
import { projectionMaterial } from '../enemies/projectionMaterial';
import { PROJECTION } from '../enemies/projectionConfig';

// Reference photos, served by Vite in dev only (the viewer isn't in the build).
const REF_URLS = import.meta.glob('../../assets/enemies/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const REF_PREFIX: Record<EnemyKey, string> = {
  poo: 'pou',
  fuggie: 'fuggler',
  charles: 'gorilla',
  newyama: 'llama',
};
function refUrl(key: EnemyKey, angle: string): string | null {
  const file = angle === 'iso' ? `${REF_PREFIX[key]}.jpg` : `${REF_PREFIX[key]}_${angle}.jpg`;
  const hit = Object.entries(REF_URLS).find(([p]) => p.endsWith('/' + file));
  return hit ? hit[1] : null;
}

const FACTORY: Record<EnemyKey, () => EnemyBase> = {
  poo: () => new Poo(),
  fuggie: () => new Fuggie(),
  charles: () => new Charles(),
  newyama: () => new NewYama(),
};

const LABEL: Record<EnemyKey, string> = {
  poo: 'Poo / Pou',
  fuggie: 'Fuggie / fuggler',
  charles: 'Charles / gorilla',
  newyama: 'NewYama / llama',
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
 * against the reference photos. Dev-only (its own Vite entry, viewer.html) —
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
  private currentKey: EnemyKey = 'newyama';
  private readonly refImg = document.createElement('img');
  private refOn = false;
  private refOpacity = 0.5;
  private refAngle = 'front';
  private mode: Mode = 'idle';
  private menacing = false;
  private turntable = false;
  private lookAtCamera = false;
  private crouchTarget = false;
  private onStairs = false;
  private last = 0;
  private readonly walkTarget = new THREE.Vector3();
  private readonly playerPos = new THREE.Vector3();
  private readonly stairs = new THREE.Group();

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

    window.addEventListener('resize', () => this.onResize());
    this.renderer.setAnimationLoop((t) => this.frame(t / 1000));
  }

  private buildStudio(): void {
    // Neutral studio: soft ambient + hemisphere fill + a warm key with shadow.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
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
        this.scene.environment = pmrem.fromEquirectangular(hdr).texture;
        hdr.dispose();
      }
    );
  }

  /**
   * Camera-project the front/back reference photos onto a loaded mesh, so the
   * real face/colours/patterns map onto the AI shape (front photo on
   * front-facing tris, back photo on the rest). Proves photo-matched texturing.
   */
  private projMats: THREE.MeshStandardMaterial[] = [];
  private projModel = 'pou';

  /** Live-tune one view's transform on the current model (for dialing in). */
  setView(view: 'front' | 'back' | 'side', sx: number, sy: number, ox: number, oy: number, rot: number): void {
    const cap = view[0].toUpperCase() + view.slice(1);
    for (const m of this.projMats) {
      const u = m.userData.proj;
      (u[`u${cap}S`].value as THREE.Vector2).set(sx, sy);
      (u[`u${cap}O`].value as THREE.Vector2).set(ox, oy);
      u[`u${cap}R`].value = rot;
    }
  }

  /** Print the current model's tuned projection config (paste into projectionConfig.ts). */
  dumpProj(): string {
    if (!this.projMats.length) return '{}';
    const u = this.projMats[0].userData.proj;
    const baseHex = '0x' + (PROJECTION[this.projModel]?.base ?? 0xcccccc).toString(16);
    const v = (cap: string) =>
      `{ scale: [${u['u' + cap + 'S'].value.x}, ${u['u' + cap + 'S'].value.y}], offset: [${u['u' + cap + 'O'].value.x}, ${u['u' + cap + 'O'].value.y}], rot: ${u['u' + cap + 'R'].value} }`;
    const out = `${this.projModel}: { base: ${baseHex}, front: ${v('Front')}, back: ${v('Back')}, side: ${v('Side')} },`;
    console.log('PROJ_CONFIG', out);
    return out;
  }

  private projectPhotos(root: THREE.Object3D, base: string): void {
    this.projModel = base;
    const load = (v: string) => new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}models/${base}_${v}.png`);
    const views = { front: load('front'), back: load('back'), side: load('side') };
    const cfg = PROJECTION[base] ?? {
      base: 0xcccccc,
      front: { scale: [1, 1], offset: [0, 0], rot: 0 },
      back: { scale: [1, 1], offset: [0, 0], rot: 0 },
      side: { scale: [1, 1], offset: [0, 0], rot: 0 },
    };
    this.projMats = [];
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const g = o.geometry as THREE.BufferGeometry;
      if (!g.attributes.normal) g.computeVertexNormals(); // AI meshes ship without normals
      g.computeBoundingBox();
      const bb = g.boundingBox!;
      const uMin = new THREE.Vector3(bb.min.x, bb.min.y, bb.min.z);
      const uSize = new THREE.Vector3(bb.max.x - bb.min.x || 1, bb.max.y - bb.min.y || 1, bb.max.z - bb.min.z || 1);
      const m = projectionMaterial(views, uMin, uSize, cfg);
      o.material = m;
      this.projMats.push(m);
    });
  }

  private rigHead: THREE.Bone | null = null;

  /**
   * Proof-of-rig: convert a loaded mesh to a SkinnedMesh with a 2-bone skeleton
   * (body + a head bone for the top region) and proximity skin weights, so a
   * single bone rotation deforms just the head/eyes — i.e. the existing gaze
   * articulation can drive these AI meshes. Animated in frame().
   */
  private rigMesh(root: THREE.Object3D): void {
    let mesh: THREE.Mesh | null = null;
    root.traverse((o) => {
      if (o instanceof THREE.Mesh && !mesh) mesh = o;
    });
    if (!mesh) return;
    const m = mesh as THREE.Mesh;
    const g = m.geometry as THREE.BufferGeometry;
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const bot = bb.min.y;
    const h = bb.max.y - bb.min.y;
    const splitY = bot + h * 0.6; // eye-domes/head region starts here
    const band = h * 0.12;
    const pos = g.attributes.position;
    const si = new Uint16Array(pos.count * 4);
    const sw = new Float32Array(pos.count * 4);
    const smooth = (e0: number, e1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };
    for (let i = 0; i < pos.count; i++) {
      const w = smooth(splitY - band, splitY + band, pos.getY(i)); // head weight
      si[i * 4] = 0;
      si[i * 4 + 1] = 1;
      sw[i * 4] = 1 - w;
      sw[i * 4 + 1] = w;
    }
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
    const rootBone = new THREE.Bone();
    rootBone.position.set(0, bot, 0);
    const head = new THREE.Bone();
    head.position.set(0, splitY - bot, 0); // local to rootBone
    rootBone.add(head);
    const skinned = new THREE.SkinnedMesh(g, m.material as THREE.Material);
    skinned.add(rootBone);
    skinned.bind(new THREE.Skeleton([rootBone, head]));
    m.parent!.add(skinned);
    m.parent!.remove(m);
    this.rigHead = head;
  }

  /** Dev: load a raw GLB (e.g. an AI-generated mesh) into the studio to inspect it. */
  loadGlb(file: string, projectBase?: string, rig = false): void {
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
      if (projectBase) this.projectPhotos(root, projectBase);
      if (rig) this.rigMesh(root);
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

  setEnemy(key: EnemyKey): void {
    if (this.enemy) this.holder.remove(this.enemy.group);
    this.currentKey = key;
    this.enemy = FACTORY[key]();
    this.holder.add(this.enemy.group);
    document.title = `Viewer — ${LABEL[key]}`;
    this.onStairs = false;
    this.stairs.visible = false;
    this.holder.rotation.y = 0;
    this.holder.position.set(0, 0, 0);
    this.fitToModel();
    this.applyPreset(this.preset);
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
    // Rig proof: oscillate the head bone so the eyes/head deform (look down/up).
    if (this.rigHead) this.rigHead.rotation.x = Math.sin(time * 1.3) * 0.55;
    const e = this.enemy;
    if (e) {
      if (this.mode === 'walk') {
        // Treadmill: aim ahead, then recentre so it strides in place.
        this.walkTarget.set(0, e.position.y, 40);
        e.setMoveTarget(this.walkTarget, this.menacing ? config.ai.chaseSpeed : config.ai.patrolSpeed);
      } else {
        e.setMoveTarget(null, 0);
      }
      e.isChasing = this.menacing;

      // Look target: camera (eye contact) or a low crouched-player point.
      const lookPos =
        this.crouchTarget
          ? new THREE.Vector3(this.target.x, 0.25, this.target.z + 1.5)
          : this.camera.position.clone();
      // Feed the articulation look-context if the build supports it (PHASE-03).
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

    for (const k of ENEMY_KEYS) mk(LABEL[k].split(' / ')[0], () => this.setEnemy(k));
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
