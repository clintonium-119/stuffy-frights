/**
 * In-headset screen effects: the enemy-proximity vignette and the jumpscare
 * red-flash / blackout, which on flatscreen are DOM overlays (invisible in an
 * immersive session). A head-locked quad close to the eyes fills the field of
 * view; its canvas is redrawn from the same signals that drive the DOM HUD.
 */
import * as THREE from 'three';

export class VRFade {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private sig = '';

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    // Close to the eyes and oversized so it fills the FOV.
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    this.mesh.position.set(0, 0, -0.3);
    this.mesh.renderOrder = 1000;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
  }

  show(anchor: THREE.Object3D): void {
    if (this.mesh.parent !== anchor) anchor.add(this.mesh);
  }

  hide(): void {
    this.mesh.removeFromParent();
  }

  /** threat 0..1 (enemy proximity), red 0..1 (jumpscare flash), black 0..1. */
  update(threat: number, red: number, black: number): void {
    const sig = `${Math.round(threat * 30)}|${Math.round(red * 30)}|${Math.round(black * 30)}`;
    if (sig === this.sig) return;
    this.sig = sig;

    this.mesh.visible = threat > 0.01 || red > 0.01 || black > 0.01;
    if (!this.mesh.visible) return;

    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    c.clearRect(0, 0, w, h);

    if (threat > 0.01) {
      const g = c.createRadialGradient(w / 2, h / 2, w * 0.23, w / 2, h / 2, w * 0.5);
      g.addColorStop(0, 'rgba(60,0,0,0)');
      g.addColorStop(1, `rgba(60,0,0,${(threat * 0.55).toFixed(3)})`);
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }
    if (red > 0.01) {
      c.fillStyle = `rgba(122,0,0,${(red * 0.85).toFixed(3)})`;
      c.fillRect(0, 0, w, h);
    }
    if (black > 0.01) {
      c.fillStyle = `rgba(0,0,0,${black.toFixed(3)})`;
      c.fillRect(0, 0, w, h);
    }
    this.texture.needsUpdate = true;
  }
}
