/**
 * In-headset main menu: a head-locked, canvas-textured panel with a vertical
 * list of options. Navigated with the left-stick (up/down flicks) and selected
 * with the right trigger — no laser-pointer raycast, which is fiddly to aim and
 * hard to verify. Shown on enter-VR and as the "back to menu" target on death.
 */
import * as THREE from 'three';

export interface VRMenuItem {
  label: string;
  onSelect: () => void;
}

export class VRMenu {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private items: VRMenuItem[] = [];
  private index = 0;
  private title = '';
  private _visible = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 768;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthTest: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.94), mat);
    this.mesh.position.set(0, -0.02, -1.5);
    this.mesh.renderOrder = 999;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  show(anchor: THREE.Object3D, title: string, items: VRMenuItem[]): void {
    this.title = title;
    this.items = items;
    this.index = 0;
    if (this.mesh.parent !== anchor) anchor.add(this.mesh);
    this.mesh.visible = true;
    this._visible = true;
    this.draw();
  }

  hide(): void {
    this.mesh.visible = false;
    this.mesh.removeFromParent();
    this._visible = false;
  }

  /** Move the highlight by `dir` (-1 up / +1 down), wrapping. */
  move(dir: number): void {
    if (!this._visible || dir === 0 || this.items.length === 0) return;
    this.index = (this.index + dir + this.items.length) % this.items.length;
    this.draw();
  }

  /** Activate the highlighted item. */
  select(): void {
    if (!this._visible) return;
    this.items[this.index]?.onSelect();
  }

  private draw(): void {
    const c = this.ctx;
    const w = this.canvas.width;
    c.clearRect(0, 0, w, this.canvas.height);
    c.fillStyle = 'rgba(5,6,10,0.94)';
    c.fillRect(0, 0, w, this.canvas.height);
    c.strokeStyle = '#cdb98a';
    c.lineWidth = 5;
    c.strokeRect(8, 8, w - 16, this.canvas.height - 16);

    c.textAlign = 'center';
    c.fillStyle = '#cdb98a';
    c.font = "bold 54px 'Trebuchet MS', sans-serif";
    c.fillText(this.title, w / 2, 96);

    const top = 170;
    const rowH = 84;
    this.items.forEach((item, i) => {
      const y = top + i * rowH;
      const on = i === this.index;
      c.fillStyle = on ? 'rgba(216,201,160,0.92)' : 'rgba(58,47,34,0.6)';
      c.strokeStyle = on ? '#e8dcc0' : '#6b6149';
      c.lineWidth = 3;
      const bx = 60;
      const bw = w - 120;
      c.fillRect(bx, y, bw, 64);
      c.strokeRect(bx, y, bw, 64);
      c.fillStyle = on ? '#15110a' : '#e8dcc0';
      c.font = "700 34px 'Trebuchet MS', sans-serif";
      c.fillText(item.label, w / 2, y + 44);
    });

    c.fillStyle = '#8fb6ff';
    c.font = "600 28px 'Trebuchet MS', sans-serif";
    c.fillText('Left stick: move  ·  Right trigger: select', w / 2, this.canvas.height - 40);

    this.texture.needsUpdate = true;
  }
}
