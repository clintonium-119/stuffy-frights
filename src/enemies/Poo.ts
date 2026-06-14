import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';
import { faceDecal } from './faceDecal';

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
    const H = 0.9;
    for (let i = 0; i <= 26; i++) {
      const v = i / 26;
      // Pear: fat bottom lobe, narrowing to a short neck near the top.
      const r =
        0.31 * Math.sin(Math.pow(v, 0.72) * Math.PI) * (1 - v * 0.24) +
        0.04 * Math.sin(v * Math.PI) +
        0.001;
      profile.push(new THREE.Vector2(r, v * H));
    }
    this.body = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), tan);
    this.group.add(this.body);

    // A neck hump at the top the eye-pods grow out of — so the pods read as
    // part of the body, not balls resting on it.
    const hump = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 22), tan);
    hump.scale.set(1, 0.72, 1);
    hump.position.y = 0.74;
    this.body.add(hump);

    // Deadpan mouth wrapped onto the body front (curved decal), proud of the bulge.
    const facePlane = new THREE.Mesh(
      faceDecal(0.13, 0.3, 44),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, 0.55, 0.255);
    facePlane.rotation.x = -0.05;
    this.body.add(facePlane);

    // The two eye-pods live on a head group so PHASE-03 gaze can aim them.
    this.head = new THREE.Group();
    this.head.position.set(0, 0.68, 0.03);
    this.body.add(this.head);

    const R = 0.155; // both eyes the same size
    const makePod = (side: number, lift: number, fwd: number): THREE.Group => {
      const pod = new THREE.Group();
      const podMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 24), tan);
      podMesh.scale.set(1, 1.12, 0.98);
      pod.add(podMesh);
      // A short stalk where the pod meets the hump, so it's visibly attached.
      const root = new THREE.Mesh(new THREE.SphereGeometry(R * 0.78, 18, 14), tan);
      root.position.set(0, -R * 0.85, -R * 0.2);
      root.scale.set(0.9, 0.8, 0.9);
      pod.add(root);
      // Almond eye decal on the front face.
      const eyeMat = new THREE.MeshStandardMaterial({
        map: Poo.eyeTexture(),
        transparent: true,
        roughness: 0.5,
      });
      this.eyeMats.push(eyeMat);
      const eye = new THREE.Mesh(new THREE.PlaneGeometry(R * 2.0, R * 2.0), eyeMat);
      eye.position.set(0, R * 0.06, R * 0.94);
      eye.rotation.set(0.05, 0, side < 0 ? 0.1 : -0.1);
      pod.add(eye);
      pod.position.set(side * 0.115, lift, fwd);
      pod.rotation.set(0.3, side * 0.14, 0);
      this.head.add(pod);
      return pod;
    };
    this.podL = makePod(-1, 0.0, 0.05);
    this.podR = makePod(1, 0.0, 0.05);

    return facePlane;
  }

  protected getHead(): { obj: THREE.Object3D; maxYaw: number; maxPitch: number } {
    return { obj: this.head, maxYaw: 0.5, maxPitch: 0.55 };
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
      // The deadpan splits into a wide, dark, sharp-toothed maw.
      ctx.fillStyle = '#1c0a06';
      ctx.beginPath();
      ctx.ellipse(c, c + 6, 64, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      // Jagged sharp teeth, top + bottom rows.
      ctx.fillStyle = '#efe7d4';
      const n = 7;
      for (let i = 0; i < n; i++) {
        const x = c - 56 + (i * 112) / (n - 1);
        ctx.beginPath(); // top fang pointing down
        ctx.moveTo(x - 8, c - 24);
        ctx.lineTo(x + 8, c - 24);
        ctx.lineTo(x, c - 24 + (i % 2 ? 22 : 15));
        ctx.fill();
        ctx.beginPath(); // bottom fang pointing up
        ctx.moveTo(x - 7, c + 34);
        ctx.lineTo(x + 7, c + 34);
        ctx.lineTo(x, c + 34 - (i % 2 ? 20 : 13));
        ctx.fill();
      }
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
