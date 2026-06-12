import * as THREE from 'three';
import { EnemyBase, Mood, fabricTexture } from './EnemyBase';

/**
 * Poo — the tan blob alien plush. Smooth pear body, two big glossy black
 * eyes on stalks sprouting from the top, minimal flat mouth. Bounces along
 * with cartoon squash-and-stretch; the smallest stuffy — it fits anywhere.
 */
export class Poo extends EnemyBase {
  private body!: THREE.Mesh;
  private stalkL!: THREE.Group;
  private stalkR!: THREE.Group;
  private eyeMats: THREE.MeshStandardMaterial[] = [];
  private hopHeight = 0;

  constructor() {
    super('poo');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const tan = new THREE.MeshStandardMaterial({
      map: fabricTexture('#d9b286', '#cba271', '#ecc89e', 0.5),
      roughness: 0.95,
    });

    // Pear silhouette via lathe.
    const profile: THREE.Vector2[] = [];
    for (let i = 0; i <= 14; i++) {
      const v = i / 14;
      const r = 0.34 * Math.sin(v * Math.PI) * (1 - v * 0.32) + 0.001;
      profile.push(new THREE.Vector2(r, v * 0.62));
    }
    this.body = new THREE.Mesh(new THREE.LatheGeometry(profile, 22), tan);
    this.group.add(this.body);

    // Face plane (mouth + blush area; the eyes are 3D stalks).
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.17, 18),
      new THREE.MeshStandardMaterial({ roughness: 0.9 })
    );
    facePlane.position.set(0, 0.34, 0.27);
    facePlane.rotation.x = -0.12;
    this.body.add(facePlane);

    // Eye stalks.
    const glossy = () => {
      const m = new THREE.MeshStandardMaterial({
        color: 0x101010,
        roughness: 0.15,
        metalness: 0.1,
      });
      this.eyeMats.push(m);
      return m;
    };
    const makeStalk = (side: number) => {
      const stalk = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 8), new THREE.MeshStandardMaterial({
        map: fabricTexture('#d9b286', '#cba271', '#ecc89e', 0.4),
        roughness: 0.95,
      }));
      stem.position.y = 0.06;
      stalk.add(stem);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), glossy());
      eye.position.y = 0.18;
      stalk.add(eye);
      // Painted highlight.
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(0.03, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(0.035, 0.22, 0.09);
      glint.rotation.x = -0.3;
      stalk.add(glint);
      stalk.position.set(side * 0.13, 0.58, 0.05);
      stalk.rotation.z = -side * 0.2;
      this.body.add(stalk);
      return stalk;
    };
    this.stalkL = makeStalk(-1);
    this.stalkR = makeStalk(1);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    if (mood === 'calm') {
      // The deadpan flat line.
      ctx.strokeStyle = '#4a3a28';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(c - 42, c);
      ctx.lineTo(c + 42, c);
      ctx.stroke();
    } else {
      // The line splits into a dark grin.
      ctx.fillStyle = '#2a1410';
      ctx.beginPath();
      ctx.moveTo(c - 58, c - 8);
      ctx.quadraticCurveTo(c, c + 56, c + 58, c - 8);
      ctx.quadraticCurveTo(c, c + 18, c - 58, c - 8);
      ctx.fill();
      ctx.fillStyle = '#e8e2d2';
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(c + i * 18 - 6, c + (Math.abs(i) === 2 ? 2 : 8));
        ctx.lineTo(c + i * 18, c + (Math.abs(i) === 2 ? 12 : 22));
        ctx.lineTo(c + i * 18 + 6, c + (Math.abs(i) === 2 ? 2 : 8));
        ctx.fill();
      }
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 2.6;
    if (speed > 0) {
      // Parabolic hops with squash and stretch.
      const hop = Math.abs(Math.sin(phase));
      this.hopHeight = hop * 0.34;
      this.body.position.y = this.hopHeight;
      const stretch = 1 + (hop - 0.5) * 0.3;
      this.body.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
      // Stalk lag.
      const lag = Math.cos(phase) * 0.3;
      this.stalkL.rotation.x = lag;
      this.stalkR.rotation.x = lag;
      if (hop < 0.06 && dt > 0) this.onGaitBeat?.('fwump');
    } else {
      // Idle: settle softly.
      this.body.position.y = 0;
      this.body.scale.set(1, 1, 1);
      this.stalkL.rotation.x *= 0.9;
      this.stalkR.rotation.x *= 0.9;
    }
    // Menacing: a faint red ember deep in the black eyes.
    const red = this.mood === 'menacing';
    for (const m of this.eyeMats) {
      m.emissive.setHex(red ? 0x330000 : 0x000000);
      m.emissiveIntensity = red ? 0.55 : 0;
    }
  }
}
