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

    // Bottom-heavy teardrop/egg silhouette: widest below the middle, rounding
    // smoothly closed at both poles (no nub). Sampled over a half-revolution
    // angle so the top is a rounded dome like the real plush.
    const profile: THREE.Vector2[] = [];
    const H = 0.8;
    const Rmax = 0.4;
    const seg = 44;
    for (let i = 0; i <= seg; i++) {
      const th = (i / seg) * Math.PI; // 0 = bottom pole, PI = top pole
      const u = (1 - Math.cos(th)) / 2; // 0..1 up the body
      const y = u * H;
      // Teardrop taper: full width low, ~70% near the crown.
      const taper = 1 - 0.32 * u;
      const r = Rmax * Math.sin(th) * taper + 0.001;
      profile.push(new THREE.Vector2(r, y));
    }
    this.body = new THREE.Mesh(new THREE.LatheGeometry(profile, 56), tan);
    this.group.add(this.body);

    // Deadpan mouth wrapped onto the body front (curved decal), below the pods.
    const facePlane = new THREE.Mesh(
      faceDecal(0.13, 0.3, 44),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, 0.6, 0.285);
    facePlane.rotation.x = -0.04;
    this.body.add(facePlane);

    // The two eye-pods live on a head group (front-top of the body, leaning
    // forward) so PHASE-03 gaze can aim them. The real plush is asymmetric:
    // one pod is larger and sits higher than the other.
    this.head = new THREE.Group();
    this.head.position.set(0, 0.58, 0.08);
    this.body.add(this.head);

    // side: -1/+1 flank, lift: extra height, fwd: forward offset, R: pod radius.
    const makePod = (side: number, lift: number, fwd: number, R: number): THREE.Group => {
      const pod = new THREE.Group();
      const podMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 30, 26), tan);
      podMesh.scale.set(0.98, 1.12, 1.0); // slightly egg-shaped, taller than wide
      pod.add(podMesh);
      // A fat stalk/neck blending the pod into the crown so it reads attached.
      const stalk = new THREE.Mesh(new THREE.SphereGeometry(R * 0.84, 22, 16), tan);
      stalk.position.set(side * R * 0.1, -R * 1.05, -R * 0.3);
      stalk.scale.set(0.88, 1.0, 0.82);
      pod.add(stalk);

      // The big black almond eye, built from geometry so it wraps the curved pod
      // (a flat decal floats off / lets the pod poke through). A flattened black
      // ellipsoid lens on the front + two white shine beads.
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.45 });
      this.eyeMats.push(eyeMat);
      const eye = new THREE.Group();
      const almond = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), eyeMat);
      almond.scale.set(R * 0.82, R * 0.62, R * 0.55);
      eye.add(almond);
      const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const shineA = new THREE.Mesh(new THREE.SphereGeometry(R * 0.16, 14, 12), shineMat);
      shineA.position.set(-side * R * 0.22, R * 0.16, R * 0.5);
      shineA.scale.set(1, 1.1, 0.6);
      eye.add(shineA);
      const shineB = new THREE.Mesh(new THREE.SphereGeometry(R * 0.08, 12, 10), shineMat);
      shineB.position.set(side * R * 0.12, -R * 0.08, R * 0.52);
      shineB.scale.set(1, 1.1, 0.6);
      eye.add(shineB);
      // Sit the lens on the pod front, angled with the point toward inner-lower.
      eye.position.set(side * R * 0.06, R * 0.05, R * 0.62);
      eye.rotation.set(0.1, side * -0.1, side < 0 ? 0.18 : -0.18);
      pod.add(eye);

      pod.position.set(side * 0.115, lift, fwd);
      // Lean forward over the face + a touch outward.
      pod.rotation.set(0.26, side * 0.14, side * -0.04);
      this.head.add(pod);
      return pod;
    };
    // Symmetric eye-pods — same size, same height, mirrored.
    this.podL = makePod(-1, 0.12, 0.04, 0.16);
    this.podR = makePod(1, 0.12, 0.04, 0.16);

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
