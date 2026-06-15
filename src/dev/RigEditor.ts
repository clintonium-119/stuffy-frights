import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadGLB, modelUrl } from '../world/ModelLoader';
import { rigMesh } from '../enemies/Skinning';
import { RIG_CONFIG } from '../enemies/rigConfig';
import { RigConfig, BoneConfig } from '../enemies/rigWeights';
import { clampBox, clamp01, normFromWorld, serializeRig, worldFromNorm, Vec3 } from './rigEditorMath';
import { serializeRigConfigRecord } from './configWriter';
import { saveConfigBlock } from './saveConfig';
import { Articulator, ArticulatorBones, GaitStyle } from '../enemies/Articulator';

/** Per-model gait style (mirrors EnemyBase's GAIT, keyed by GLB model name). */
const MODEL_GAIT: Record<string, GaitStyle> = {
  pou: 'hop',
  fuggler: 'shuffle',
  gorilla: 'haul',
  llama: 'trot',
};

/** Look context the viewer pushes into the rig editor each frame. */
export interface RigPlayContext {
  moving: boolean;
  lookTarget: THREE.Vector3 | null;
  lookIntensity: number;
}

/**
 * Dev rig edit mode. Loads a model GLB, rigs it with an EDITABLE copy of its
 * rigConfig through the same `rigMesh` the game uses, and draws a pivot handle +
 * weight-box wireframe per bone. A side panel edits the selected bone's pivot /
 * box / falloff (live re-rig) and a test-pose triple swings the bone so you see
 * the deformation; "copy config" dumps a pasteable `rigConfig` literal. Tune here
 * → paste into rigConfig.ts → ships, because both use the same rig path.
 * Browser-only; the math is in rigEditorMath.ts (unit-tested).
 */
export class RigEditor {
  private group = new THREE.Group();
  private anim = new THREE.Group(); // gait-bobbed wrapper holding the skinned mesh
  private gizmos = new THREE.Group();
  private panel = document.createElement('div');
  private config: RigConfig;
  private geom: THREE.BufferGeometry | null = null;
  private mat: THREE.Material | null = null;
  private skinned: THREE.SkinnedMesh | null = null;
  private bbMin: Vec3 = [0, 0, 0];
  private bbSize: Vec3 = [1, 1, 1];
  private selected = 1; // selected bone index (skip root by default)
  private testRot: Vec3 = [0, 0, 0];
  private readonly scaleToH = 1.5;
  // Live playback: the shared articulation driver runs the real gait / gaze on
  // the editor's own bones so rig edits are seen against the motion that
  // exposes the defects (e.g. the llama crouch-look ear lag).
  private articulator: Articulator | null = null;
  private gaitT = 0;
  // Draggable handle (TransformControls gizmo doubles as the XYZ indicator).
  private tc: TransformControls | null = null;
  private handle = new THREE.Object3D(); // child of group → local pos is geom-space
  private handleKind: 'pivot' | 'min' | 'max' = 'pivot';
  private dragging = false;

  constructor(
    private scene: THREE.Scene,
    private readonly model: string,
    private readonly camera?: THREE.Camera,
    private readonly domElement?: HTMLElement,
    private readonly orbit?: OrbitControls
  ) {
    this.config = structuredClone(RIG_CONFIG[model] ?? [{ name: 'root', pivot: [0.5, 0.5, 0.5] }]);
    this.scene.add(this.group);
    this.group.add(this.anim);
    this.group.add(this.gizmos);
    this.group.add(this.handle);
    this.setupTransform();
    this.buildPanel();
    void this.load();
  }

  /** Wire a translate gizmo onto the handle; suspend orbit while dragging. */
  private setupTransform(): void {
    if (!this.camera || !this.domElement) return;
    const tc = new TransformControls(this.camera, this.domElement);
    tc.setMode('translate');
    tc.setSize(0.7);
    tc.addEventListener('dragging-changed', (e) => {
      this.dragging = (e as unknown as { value: boolean }).value;
      if (this.orbit) this.orbit.enabled = !this.dragging;
    });
    tc.addEventListener('objectChange', () => this.onHandleDrag());
    this.scene.add(tc);
    this.tc = tc;
  }

  /** Move the handle (+ gizmo) to the selected bone's pivot / box corner. */
  private positionHandle(): void {
    if (!this.tc) return;
    const b = this.config[this.selected] as BoneConfig | undefined;
    if (!b) {
      this.tc.detach();
      return;
    }
    const norm =
      this.handleKind === 'pivot' ? b.pivot : this.handleKind === 'min' ? b.box?.min : b.box?.max;
    if (!norm) {
      this.tc.detach();
      return;
    }
    const w = worldFromNorm(norm, this.bbMin, this.bbSize);
    this.handle.position.set(w[0], w[1], w[2]);
    this.tc.attach(this.handle);
  }

  /** During a drag: read the handle's geom-space position back into the config. */
  private onHandleDrag(): void {
    if (!this.dragging) return;
    const b = this.config[this.selected] as BoneConfig | undefined;
    if (!b) return;
    const p = this.handle.position;
    const n = normFromWorld([p.x, p.y, p.z], this.bbMin, this.bbSize);
    if (this.handleKind === 'pivot') {
      b.pivot = [clamp01(n[0]), clamp01(n[1]), clamp01(n[2])];
    } else if (b.box) {
      b.box[this.handleKind] = [clamp01(n[0]), clamp01(n[1]), clamp01(n[2])];
      b.box = clampBox(b.box);
    }
    // Re-rig + redraw the reference gizmos, but leave the handle where the user
    // is dragging it (don't reposition mid-drag).
    this.rebuildMesh();
    this.drawGizmos();
    this.refreshPanel();
  }

  private async load(): Promise<void> {
    const scene = await loadGLB(modelUrl(this.model));
    scene.updateMatrixWorld(true);
    let mesh: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh && !mesh) mesh = o;
    });
    if (!mesh) return;
    const src = mesh as THREE.Mesh;
    const g = (src.geometry as THREE.BufferGeometry).clone();
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(src.matrixWorld); // bake world transform → identity-space geom
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    this.bbMin = [bb.min.x, bb.min.y, bb.min.z];
    this.bbSize = [bb.max.x - bb.min.x || 1, bb.max.y - bb.min.y || 1, bb.max.z - bb.min.z || 1];
    this.geom = g;
    const m = (src.material as THREE.MeshStandardMaterial).clone();
    m.metalness = 0;
    this.mat = m;
    // size the whole rig group so it frames nicely (uniform; feet ~ y0)
    const s = this.scaleToH / this.bbSize[1];
    this.group.scale.setScalar(s);
    this.group.position.set(0, -this.bbMin[1] * s, 0);
    this.rebuild();
  }

  /** Re-rig the skinned mesh + rebuild the articulation driver (no UI redraw). */
  private rebuildMesh(): void {
    if (!this.geom || !this.mat) return;
    if (this.skinned) {
      this.anim.remove(this.skinned);
      this.skinned.skeleton.dispose();
    }
    const res = rigMesh(new THREE.Mesh(this.geom, this.mat), this.config);
    this.skinned = res.skinned;
    this.anim.add(this.skinned);
    // Reset the bob wrapper so re-rig doesn't accumulate a stale pose.
    this.anim.position.set(0, 0, 0);
    this.anim.rotation.set(0, 0, 0);
    this.anim.scale.set(1, 1, 1);
    // Rebuild the articulation driver against the fresh bones (re-rig changes
    // bone identity). Map rig bones to the head/legs/arms the driver poses.
    const bones: ArticulatorBones = {};
    if (res.bones.head) bones.head = res.bones.head;
    const legs = ['legFL', 'legFR', 'legHL', 'legHR'].map((n) => res.bones[n]).filter(Boolean);
    if (legs.length) bones.legs = legs;
    const arms = ['armL', 'armR'].map((n) => res.bones[n]).filter(Boolean);
    if (arms.length >= 2) bones.arms = arms;
    this.articulator = new Articulator(
      bones,
      this.group,
      this.anim,
      MODEL_GAIT[this.model] ?? 'trot',
      this.bbSize[1]
    );
    this.applyTestPose();
  }

  /** Full rebuild on a slider/selection edit: re-rig + redraw gizmos + handle. */
  private rebuild(): void {
    this.rebuildMesh();
    this.drawGizmos();
    this.refreshPanel();
    this.positionHandle();
  }

  /**
   * Advance the live playback one frame: the viewer pushes the mode (walk/idle)
   * + look context; the shared driver poses the bones, then the manual test-pose
   * rotation is re-applied on the selected bone as an override.
   */
  tick(dt: number, ctx: RigPlayContext): void {
    if (ctx.moving) this.gaitT += dt * 1.6; // nominal stride speed (m/s), matches a walk cadence
    this.articulator?.pose({
      dt,
      moving: ctx.moving,
      gaitT: this.gaitT,
      lookTarget: ctx.lookTarget,
      lookIntensity: ctx.lookIntensity,
      position: this.group.position,
      floorIndex: 0,
      floorHeightAt: null,
    });
    this.applyTestPose();
  }

  private drawGizmos(): void {
    this.gizmos.clear();
    this.config.forEach((b, i) => {
      const sel = i === this.selected;
      const p = worldFromNorm(b.pivot, this.bbMin, this.bbSize);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.02 * this.bbSize[1], 12, 10),
        new THREE.MeshBasicMaterial({ color: sel ? 0xffe000 : 0xff5500, depthTest: false })
      );
      dot.position.set(p[0], p[1], p[2]);
      dot.renderOrder = 999;
      this.gizmos.add(dot);
      if (b.box) {
        const lo = worldFromNorm(b.box.min, this.bbMin, this.bbSize);
        const hi = worldFromNorm(b.box.max, this.bbMin, this.bbSize);
        const box3 = new THREE.Box3(new THREE.Vector3(...lo), new THREE.Vector3(...hi));
        const helper = new THREE.Box3Helper(box3, new THREE.Color(sel ? 0xffe000 : 0x33aaff));
        (helper.material as THREE.Material).depthTest = false;
        helper.renderOrder = 998;
        this.gizmos.add(helper);
      }
    });
  }

  private applyTestPose(): void {
    if (!this.skinned) return;
    // Only override when the user has dialed in a non-zero test pose; otherwise
    // leave the selected bone to the live articulation (so it animates too).
    if (this.testRot[0] === 0 && this.testRot[1] === 0 && this.testRot[2] === 0) return;
    const bone = this.skinned.skeleton.bones[this.selected];
    if (bone) bone.rotation.set(this.testRot[0], this.testRot[1], this.testRot[2]);
  }

  // ---- panel ----
  private buildPanel(): void {
    this.panel.style.cssText =
      'position:fixed;top:8px;right:8px;width:250px;background:#0b0e12ee;color:#cdd;' +
      'font:11px ui-monospace,monospace;padding:10px;border-radius:8px;z-index:20;max-height:94vh;overflow:auto';
    document.body.appendChild(this.panel);
    this.refreshPanel();
  }

  private num(label: string, value: number, step: number, on: (v: number) => void): HTMLElement {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:6px;margin:2px 0';
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = '0';
    inp.max = '1';
    inp.step = String(step);
    inp.value = String(value);
    inp.style.flex = '1';
    const val = document.createElement('span');
    val.textContent = value.toFixed(2);
    val.style.width = '30px';
    inp.oninput = () => {
      val.textContent = (+inp.value).toFixed(2);
      on(+inp.value);
    };
    row.append(Object.assign(document.createElement('span'), { textContent: label, style: 'width:34px' }), inp, val);
    return row;
  }

  private refreshPanel(): void {
    const b = this.config[this.selected] as BoneConfig | undefined;
    this.panel.innerHTML = '';
    const title = document.createElement('div');
    title.innerHTML = `<b>rig edit — ${this.model}</b>`;
    title.style.marginBottom = '6px';
    this.panel.appendChild(title);

    const sel = document.createElement('select');
    sel.style.cssText = 'width:100%;margin-bottom:6px;background:#1a1f26;color:#cdd';
    this.config.forEach((bn, i) => {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = `${i}: ${bn.name}`;
      if (i === this.selected) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = () => {
      this.selected = +sel.value;
      this.testRot = [0, 0, 0];
      this.handleKind = 'pivot';
      this.rebuild();
    };
    this.panel.appendChild(sel);
    if (!b) return;

    // Which point the draggable XYZ gizmo controls (pivot or a box corner).
    if (this.tc) {
      const hrow = document.createElement('div');
      hrow.style.cssText = 'display:flex;gap:4px;margin-bottom:6px';
      const kinds: Array<['pivot' | 'min' | 'max', string, boolean]> = [
        ['pivot', 'drag pivot', true],
        ['min', 'box min', !!b.box],
        ['max', 'box max', !!b.box],
      ];
      for (const [kind, label, enabled] of kinds) {
        const hb = document.createElement('button');
        hb.textContent = label;
        hb.disabled = !enabled;
        hb.style.cssText =
          `flex:1;padding:3px;border:0;border-radius:4px;cursor:pointer;color:#cde;` +
          `background:${this.handleKind === kind ? '#46a' : '#28303a'};opacity:${enabled ? 1 : 0.4}`;
        hb.onclick = () => {
          this.handleKind = kind;
          this.positionHandle();
          this.refreshPanel();
        };
        hrow.appendChild(hb);
      }
      this.panel.appendChild(hrow);
    }

    const mk = (t: string) => {
      const h = document.createElement('div');
      h.textContent = t;
      h.style.cssText = 'margin:6px 0 2px;color:#8af';
      this.panel.appendChild(h);
    };
    mk('pivot');
    (['x', 'y', 'z'] as const).forEach((ax, a) =>
      this.panel.appendChild(
        this.num(ax, b.pivot[a], 0.005, (v) => {
          b.pivot[a] = v;
          this.rebuild();
        })
      )
    );
    if (b.box) {
      const box = b.box;
      mk('box min');
      (['x', 'y', 'z'] as const).forEach((ax, a) =>
        this.panel.appendChild(
          this.num(ax, box.min[a], 0.005, (v) => {
            box.min[a] = v;
            b.box = clampBox(box);
            this.rebuild();
          })
        )
      );
      mk('box max');
      (['x', 'y', 'z'] as const).forEach((ax, a) =>
        this.panel.appendChild(
          this.num(ax, box.max[a], 0.005, (v) => {
            box.max[a] = v;
            b.box = clampBox(box);
            this.rebuild();
          })
        )
      );
    }
    mk('test pose (rot)');
    (['rx', 'ry', 'rz'] as const).forEach((ax, a) => {
      const row = document.createElement('label');
      row.style.cssText = 'display:flex;gap:6px;align-items:center;margin:2px 0';
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = '-1.4';
      inp.max = '1.4';
      inp.step = '0.02';
      inp.value = String(this.testRot[a]);
      inp.style.flex = '1';
      inp.oninput = () => {
        this.testRot[a] = +inp.value;
        this.applyTestPose();
      };
      row.append(Object.assign(document.createElement('span'), { textContent: ax, style: 'width:34px' }), inp);
      this.panel.appendChild(row);
    });

    // Save the edited rig straight to rigConfig.ts via the dev write endpoint:
    // merge this model's edited bones back into the full record, serialize, write.
    const save = document.createElement('button');
    save.textContent = 'save to source';
    save.style.cssText = 'width:100%;margin-top:8px;padding:5px;background:#2a6;color:#fff;border:0;border-radius:5px;cursor:pointer';
    save.onclick = () => {
      const merged = { ...RIG_CONFIG, [this.model]: this.config };
      const body = serializeRigConfigRecord(merged);
      save.textContent = 'saving…';
      void saveConfigBlock('src/enemies/rigConfig.ts', 'rigConfig', body).then((r) => {
        save.textContent = r.ok ? 'saved ✓' : `save failed: ${r.error ?? ''}`;
        setTimeout(() => (save.textContent = 'save to source'), 1600);
      });
    };
    this.panel.appendChild(save);

    // Fallback when the dev endpoint is unavailable: copy this model's literal.
    const copy = document.createElement('button');
    copy.textContent = 'copy (fallback)';
    copy.style.cssText = 'width:100%;margin-top:4px;padding:4px;background:#345;color:#cde;border:0;border-radius:5px;cursor:pointer';
    copy.onclick = () => {
      const text = serializeRig(this.model, this.config);
      void navigator.clipboard?.writeText(text);
      // eslint-disable-next-line no-console
      console.log(text);
      copy.textContent = 'copied! (see console)';
      setTimeout(() => (copy.textContent = 'copy (fallback)'), 1200);
    };
    this.panel.appendChild(copy);
  }

  dispose(): void {
    if (this.tc) {
      this.tc.detach();
      this.tc.dispose();
      this.scene.remove(this.tc);
    }
    if (this.orbit) this.orbit.enabled = true;
    this.scene.remove(this.group);
    this.skinned?.skeleton.dispose();
    this.panel.remove();
  }
}
