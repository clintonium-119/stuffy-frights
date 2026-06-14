import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';

/**
 * Poo (displayed in-game as "Pou") — the tan velour alien plush. A rounded
 * egg/pear body, widest at the base, tapering up to a short neck where two
 * big tan eye-pods sit leaning forward over the front. Each pod wears a large
 * black almond eye with white shines; a small deadpan line is the mouth.
 * Smoothest nap of the four. Bounces along with cartoon squash-and-stretch.
 */
export class Poo extends EnemyBase {
  private body!: THREE.Mesh;
  private head!: THREE.Group;
  private podL!: THREE.Group;
  private podR!: THREE.Group;
  private eyeMats: THREE.MeshStandardMaterial[] = [];
  private hopHeight = 0;

  constructor() {
    super('poo');
    this.init();
  }

  /** Big cartoon almond eye on a transparent decal: black almond + white shines. */
  private static eyeTexture(): THREE.CanvasTexture {
    const s = 128;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, s, s);
    // Almond: a rounded shape pointed toward the inner-lower corner.
    ctx.fillStyle = '#070707';
    ctx.beginPath();
    ctx.ellipse(s * 0.52, s * 0.5, s * 0.4, s * 0.34, -0.25, 0, Math.PI * 2);
    ctx.fill();
    // Two white shine blobs (big + small).
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(s * 0.4, s * 0.36, s * 0.1, s * 0.13, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.62, s * 0.58, s * 0.05, s * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  protected buildBody(): THREE.Mesh {
    const fur = furTexture({
      base: '#d6ac7e',
      tip: '#ecc89e',
      shade: '#c49a6c',
      fiberLen: 3,
      density: 0.45,
      thickness: 1,
      curl: 0,
      repeat: [2, 2],
    });
    const tan = plushMaterial({
      map: fur.map,
      normalMap: fur.normal,
      sheenColor: 0xf0d0a4,
      sheenRoughness: 0.8,
      roughness: 0.9,
      fuzz: 0.18, // smooth velour: faint nap only
    });

    // Egg/pear silhouette: widest near the base, tapering to a short neck.
    const profile: THREE.Vector2[] = [];
    const H = 0.82;
    for (let i = 0; i <= 22; i++) {
      const v = i / 22;
      // Pear: fat bottom lobe, narrowing to a short neck near the top.
      const r =
        0.33 * Math.sin(Math.pow(v, 0.74) * Math.PI) * (1 - v * 0.22) +
        0.04 * Math.sin(v * Math.PI) +
        0.001;
      profile.push(new THREE.Vector2(r, v * H));
    }
    this.body = new THREE.Mesh(new THREE.LatheGeometry(profile, 30), tan);
    this.group.add(this.body);

    // Deadpan mouth as the swappable face plane, on the upper-front body.
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 18),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, 0.52, 0.28);
    facePlane.rotation.x = -0.16;
    this.body.add(facePlane);

    // The two eye-pods live on a head group so PHASE-03 gaze can aim them.
    this.head = new THREE.Group();
    this.head.position.set(0, 0.64, 0.04);
    this.body.add(this.head);

    const makePod = (side: number, radius: number, lift: number, fwd: number): THREE.Group => {
      const pod = new THREE.Group();
      const podMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 16), tan);
      podMesh.scale.set(1, 1.12, 0.96); // slightly egg-shaped
      pod.add(podMesh);
      // Almond eye decal on the front face.
      const eyeMat = new THREE.MeshStandardMaterial({
        map: Poo.eyeTexture(),
        transparent: true,
        roughness: 0.5,
        metalness: 0.0,
      });
      this.eyeMats.push(eyeMat);
      const eye = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2.0, radius * 2.0), eyeMat);
      eye.position.set(0, radius * 0.06, radius * 0.92);
      eye.rotation.set(0.05, 0, side < 0 ? 0.12 : -0.12);
      pod.add(eye);
      pod.position.set(side * 0.135, lift, fwd);
      pod.rotation.set(0.32, side * 0.18, 0); // lean forward, splay out
      this.head.add(pod);
      return pod;
    };
    // Asymmetric like the real toy: right pod bigger + higher.
    this.podL = makePod(-1, 0.135, 0.0, 0.05);
    this.podR = makePod(1, 0.16, 0.06, 0.07);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    if (mood === 'calm') {
      // The deadpan flat line.
      ctx.strokeStyle = '#3c2c1c';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(c - 40, c);
      ctx.lineTo(c + 40, c);
      ctx.stroke();
    } else {
      // The line splits into a dark grin.
      ctx.fillStyle = '#241008';
      ctx.beginPath();
      ctx.moveTo(c - 56, c - 8);
      ctx.quadraticCurveTo(c, c + 54, c + 56, c - 8);
      ctx.quadraticCurveTo(c, c + 16, c - 56, c - 8);
      ctx.fill();
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 2.6;
    if (speed > 0) {
      const hop = Math.abs(Math.sin(phase));
      this.hopHeight = hop * 0.32;
      this.body.position.y = this.hopHeight;
      const stretch = 1 + (hop - 0.5) * 0.28;
      this.body.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
      // Eye-pods lag behind the hop (secondary motion).
      const lag = Math.cos(phase) * 0.26;
      this.podL.rotation.x = 0.32 + lag;
      this.podR.rotation.x = 0.32 + lag;
      if (hop < 0.06 && dt > 0) this.onGaitBeat?.('fwump');
    } else {
      this.body.position.y = 0;
      this.body.scale.set(1, 1, 1);
      this.podL.rotation.x += (0.32 - this.podL.rotation.x) * 0.1;
      this.podR.rotation.x += (0.32 - this.podR.rotation.x) * 0.1;
    }
    // Menacing: a faint red ember bleeds into the eyes.
    const red = this.mood === 'menacing';
    for (const m of this.eyeMats) {
      m.emissive.setHex(red ? 0x440000 : 0x000000);
      m.emissiveIntensity = red ? 0.6 : 0;
    }
  }
}
