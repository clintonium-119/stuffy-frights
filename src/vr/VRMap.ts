/**
 * In-headset map: mirrors the live MapOverlay canvas (floor + player marker)
 * onto a head-locked 3D panel, since the DOM map doesn't render in an immersive
 * session. Shown while the map is open; the panel's aspect matches the canvas.
 */
import * as THREE from 'three';

export class VRMap {
  private mesh: THREE.Mesh;
  private texture: THREE.CanvasTexture;
  private aspectApplied = false;
  private readonly baseHeight = 1.0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: this.texture, depthTest: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    this.mesh.position.set(0, 0.05, -1.2);
    this.mesh.scale.set(this.baseHeight, this.baseHeight, 1);
    this.mesh.renderOrder = 998;
    this.mesh.frustumCulled = false;
  }

  /** Add to the camera (head-locked). Idempotent; re-fits aspect on a real add. */
  show(anchor: THREE.Object3D): void {
    if (this.mesh.parent !== anchor) {
      anchor.add(this.mesh);
      this.aspectApplied = false;
    }
  }

  hide(): void {
    this.mesh.removeFromParent();
  }

  /** Re-upload the live canvas; size the panel to the map's aspect once. */
  update(): void {
    if (this.canvas.width === 0) return;
    this.texture.needsUpdate = true;
    if (!this.aspectApplied) {
      const aspect = this.canvas.width / this.canvas.height;
      this.mesh.scale.set(this.baseHeight * aspect, this.baseHeight, 1);
      this.aspectApplied = true;
    }
  }
}
