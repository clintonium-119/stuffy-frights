/**
 * In-headset HUD: stamina + flashlight-battery meters as a small canvas-textured
 * panel parented to the camera (head-locked, lower-centre of view). The DOM HUD
 * doesn't render inside an immersive session, so this mirrors the two bars that
 * matter moment-to-moment. Redraws only when a value changes.
 */
import * as THREE from 'three';

export class VRHud {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private last = { stamina: -1, battery: -1, staminaLocked: false, batteryLow: false };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 160;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthTest: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.144), mat);
    // Lower-centre, tilted slightly so it reads like a wrist/chest gauge.
    this.mesh.position.set(0, -0.34, -0.9);
    this.mesh.rotation.x = 0.35;
    this.mesh.renderOrder = 998;
    this.mesh.frustumCulled = false;
  }

  show(anchor: THREE.Object3D): void {
    if (this.mesh.parent !== anchor) anchor.add(this.mesh);
    this.last.stamina = -1; // force a redraw
  }

  hide(): void {
    this.mesh.removeFromParent();
  }

  update(stamina: number, staminaLocked: boolean, battery: number, batteryLow: boolean): void {
    const l = this.last;
    if (
      Math.abs(stamina - l.stamina) < 0.01 &&
      Math.abs(battery - l.battery) < 0.01 &&
      staminaLocked === l.staminaLocked &&
      batteryLow === l.batteryLow
    ) {
      return;
    }
    this.last = { stamina, battery, staminaLocked, batteryLow };

    const c = this.ctx;
    const w = this.canvas.width;
    c.clearRect(0, 0, w, this.canvas.height);
    this.bar(36, '👟 stamina', stamina, staminaLocked ? '#9a5550' : '#6fa8c4');
    this.bar(104, '🔦 light', battery, batteryLow ? '#b0402e' : '#9aa45e');
    this.texture.needsUpdate = true;
  }

  private bar(y: number, label: string, value: number, color: string): void {
    const c = this.ctx;
    c.font = "22px 'Trebuchet MS', sans-serif";
    c.fillStyle = '#cfc3a2';
    c.textAlign = 'left';
    c.fillText(label, 14, y + 2);
    const x = 170;
    const bw = 320;
    const bh = 26;
    const top = y - bh + 6;
    c.fillStyle = 'rgba(22,19,16,0.85)';
    c.fillRect(x, top, bw, bh);
    c.fillStyle = color;
    c.fillRect(x + 2, top + 2, (bw - 4) * Math.max(0, Math.min(1, value)), bh - 4);
    c.strokeStyle = '#6b6149';
    c.lineWidth = 2;
    c.strokeRect(x, top, bw, bh);
  }
}
