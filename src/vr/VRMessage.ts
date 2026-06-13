/**
 * In-headset message panel (game-over / win / paused). DOM overlays don't
 * render inside an immersive XR session, so this draws the text onto a
 * canvas-textured plane parented directly to the camera — head-locked, so it's
 * always centered in view regardless of where the player is looking.
 */
import * as THREE from 'three';

export class VRMessage {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private _visible = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 576;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthTest: false, // always drawn on top of the dark scene
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.56), mat);
    this.mesh.position.set(0, 0, -1.4); // 1.4 m in front of the face
    this.mesh.renderOrder = 999;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  /**
   * Draw and show the panel, parented to `anchor` (the camera) so it stays in
   * view. `accent` colors the heading; `prompt` is the call-to-action line.
   */
  show(anchor: THREE.Object3D, title: string, body: string, accent: string, prompt: string): void {
    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    c.clearRect(0, 0, w, h);
    c.fillStyle = 'rgba(5,6,10,0.92)';
    c.fillRect(0, 0, w, h);
    c.strokeStyle = accent;
    c.lineWidth = 6;
    c.strokeRect(10, 10, w - 20, h - 20);

    c.textAlign = 'center';
    c.fillStyle = accent;
    c.font = "bold 78px 'Trebuchet MS', sans-serif";
    c.fillText(title, w / 2, 180);

    c.fillStyle = '#cfc3a2';
    c.font = "34px 'Trebuchet MS', sans-serif";
    for (const [i, line] of body.split('\n').entries()) {
      c.fillText(line, w / 2, 290 + i * 50);
    }

    c.fillStyle = '#8fb6ff';
    c.font = "bold 38px 'Trebuchet MS', sans-serif";
    c.fillText(prompt, w / 2, h - 70);

    this.texture.needsUpdate = true;
    if (this.mesh.parent !== anchor) anchor.add(this.mesh);
    this.mesh.visible = true;
    this._visible = true;
  }

  hide(): void {
    this.mesh.visible = false;
    this.mesh.removeFromParent();
    this._visible = false;
  }
}
