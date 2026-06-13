/**
 * In-headset message panel. DOM overlays (the game-over / win menus) don't
 * render inside an immersive XR session, so this draws the same text onto a
 * canvas-textured billboard placed in front of the player. Updated each frame
 * to lead the head so it stays in view, and dismissed with the right trigger.
 */
import * as THREE from 'three';

export class VRMessage {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private _visible = false;
  private tmpForward = new THREE.Vector3();

  constructor(private readonly scene: THREE.Scene) {
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
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.73), mat);
    this.mesh.renderOrder = 999;
    this.mesh.visible = false;
    this.mesh.frustumCulled = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  /** Draw the message and show the panel. `accent` colors the heading. */
  show(title: string, body: string, accent: string): void {
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
    c.fillText('Pull the right trigger to try again', w / 2, h - 70);

    this.texture.needsUpdate = true;
    this.mesh.visible = true;
    if (!this.mesh.parent) this.scene.add(this.mesh);
    this._visible = true;
  }

  hide(): void {
    this.mesh.visible = false;
    this._visible = false;
  }

  /** Billboard 1.6 m in front of the head, facing it. Call each frame. */
  update(camera: THREE.Camera): void {
    if (!this._visible) return;
    const camPos = new THREE.Vector3();
    camera.getWorldPosition(camPos);
    camera.getWorldDirection(this.tmpForward);
    this.mesh.position.copy(camPos).addScaledVector(this.tmpForward, 1.6);
    this.mesh.lookAt(camPos);
  }
}
