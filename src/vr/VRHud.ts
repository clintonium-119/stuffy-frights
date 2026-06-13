/**
 * In-headset HUD: the DOM HUD doesn't render in an immersive session, so this
 * head-locked panel (lower-centre of view) mirrors what matters moment-to-
 * moment — a transient message line, the interact / charging prompt, and the
 * stamina + flashlight-battery bars. Redraws only when something changes.
 */
import * as THREE from 'three';

export interface VRHudState {
  stamina: number;
  staminaLocked: boolean;
  battery: number;
  batteryLow: boolean;
  prompt: string | null;
  message: string | null;
  charging: boolean;
}

export class VRHud {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private sig = '';

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthTest: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), mat);
    this.mesh.position.set(0, -0.32, -0.9);
    this.mesh.rotation.x = 0.35;
    this.mesh.renderOrder = 998;
    this.mesh.frustumCulled = false;
  }

  show(anchor: THREE.Object3D): void {
    if (this.mesh.parent !== anchor) anchor.add(this.mesh);
    this.sig = ''; // force a redraw
  }

  hide(): void {
    this.mesh.removeFromParent();
  }

  update(s: VRHudState): void {
    const sig = [
      Math.round(s.stamina * 50),
      Math.round(s.battery * 50),
      s.staminaLocked,
      s.batteryLow,
      s.prompt ?? '',
      s.message ?? '',
      s.charging,
    ].join('|');
    if (sig === this.sig) return;
    this.sig = sig;

    const c = this.ctx;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.textAlign = 'center';

    // Transient message (objective hints, warnings).
    if (s.message) {
      c.fillStyle = '#d9cfae';
      c.font = "italic 600 26px Georgia, serif";
      c.fillText(s.message, this.canvas.width / 2, 40);
    }

    // Interact / charging prompt.
    if (s.charging) {
      c.fillStyle = '#9fdf8a';
      c.font = "600 26px 'Trebuchet MS', sans-serif";
      c.fillText('⚡ charging — move to grab the light', this.canvas.width / 2, 96);
    } else if (s.prompt) {
      c.fillStyle = '#e8dcc0';
      c.font = "600 28px 'Trebuchet MS', sans-serif";
      c.fillText(`✋ ${s.prompt}`, this.canvas.width / 2, 96);
    }

    this.bar(165, '👟 stamina', s.stamina, s.staminaLocked ? '#9a5550' : '#6fa8c4');
    this.bar(220, '🔦 light', s.battery, s.batteryLow ? '#b0402e' : '#9aa45e');
    this.texture.needsUpdate = true;
  }

  private bar(y: number, label: string, value: number, color: string): void {
    const c = this.ctx;
    c.font = "22px 'Trebuchet MS', sans-serif";
    c.fillStyle = '#cfc3a2';
    c.textAlign = 'left';
    c.fillText(label, 26, y + 2);
    const x = 196;
    const bw = 290;
    const bh = 26;
    const top = y - bh + 6;
    c.fillStyle = 'rgba(22,19,16,0.85)';
    c.fillRect(x, top, bw, bh);
    c.fillStyle = color;
    c.fillRect(x + 2, top + 2, (bw - 4) * Math.max(0, Math.min(1, value)), bh - 4);
    c.strokeStyle = '#6b6149';
    c.lineWidth = 2;
    c.strokeRect(x, top, bw, bh);
    c.textAlign = 'center';
  }
}
