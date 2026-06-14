import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';

/** A box rounded by pushing its surface verts onto a corner radius. */
function roundedBox(w: number, h: number, d: number, r: number, seg = 8): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
  const pos = g.attributes.position;
  const hw = Math.max(0, w / 2 - r);
  const hh = Math.max(0, h / 2 - r);
  const hd = Math.max(0, d / 2 - r);
  const v = new THREE.Vector3();
  const inner = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    inner.set(
      THREE.MathUtils.clamp(v.x, -hw, hw),
      THREE.MathUtils.clamp(v.y, -hh, hh),
      THREE.MathUtils.clamp(v.z, -hd, hd)
    );
    dir.copy(v).sub(inner);
    const len = dir.length();
    if (len > 1e-5) {
      dir.multiplyScalar(r / len);
      v.copy(inner).add(dir);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/**
 * Fuggie — the fuggler. A tall, thin, rounded-pillow body of coarse teal shag
 * mottled with blue + purple, two soft ear-bumps at the top corners, big round
 * glossy eyes with maroon rims, stubby side arms, and the signature gappy mouth
 * of crooked human-like teeth. Shambles with an off-rhythm limp.
 */
export class Fuggie extends EnemyBase {
  private bodyMesh!: THREE.Mesh;
  private head!: THREE.Group;
  private armL!: THREE.Mesh;
  private armR!: THREE.Mesh;
  private eyeMats: THREE.MeshStandardMaterial[] = [];

  constructor() {
    super('fuggie');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const fur = furTexture({
      base: '#2f9e86',
      tip: '#63d2b6',
      shade: '#24705f',
      fiberLen: 20,
      density: 1.7,
      thickness: 2.0,
      curl: 0.35,
      repeat: [2, 3],
      mottle: [
        { color: '#7a4f9e', count: 22, size: 34 }, // purple blotches
        { color: '#3f9ed6', count: 16, size: 30 }, // lighter blue
      ],
    });
    const shag = plushMaterial({
      map: fur.map,
      normalMap: fur.normal,
      sheenColor: 0x6fd0b8,
      sheenRoughness: 0.5,
      roughness: 1,
      fuzz: 0.7, // coarse, matted shag
    });

    // Tall thin rounded pillow.
    const W = 0.82;
    const H = 0.98;
    const D = 0.5;
    this.bodyMesh = new THREE.Mesh(roundedBox(W, H, D, 0.24, 9), shag);
    this.bodyMesh.position.y = H / 2;
    this.group.add(this.bodyMesh);

    // Two soft ear-bumps poking up at the top corners. bodyMesh geometry is
    // centred at its origin, so the top edge is at local +H/2.
    const earGeo = new THREE.SphereGeometry(0.16, 14, 12);
    for (const sx of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, shag);
      ear.scale.set(1.05, 0.8, 0.85);
      ear.position.set(sx * 0.27, H / 2 - 0.05, 0);
      this.bodyMesh.add(ear);
    }

    // Head group carries eyes + mouth so PHASE-03 gaze can tilt them.
    this.head = new THREE.Group();
    this.head.position.set(0, 0, 0);
    this.bodyMesh.add(this.head);

    // Big glossy eyes: maroon rim disc + black dome + white glint.
    const front = D / 2 + 0.005;
    const makeEye = (sx: number) => {
      const eye = new THREE.Group();
      const rim = new THREE.Mesh(
        new THREE.CircleGeometry(0.115, 24),
        new THREE.MeshStandardMaterial({ color: 0x3a0c10, roughness: 0.55 })
      );
      eye.add(rim);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x0a0708, roughness: 0.12, metalness: 0.15 });
      this.eyeMats.push(domeMat);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.092, 18, 16), domeMat);
      dome.scale.set(1, 1, 0.7);
      dome.position.z = 0.02;
      eye.add(dome);
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(0.022, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(sx * -0.03, 0.035, 0.092);
      eye.add(glint);
      eye.position.set(sx * 0.2, 0.16, front);
      this.head.add(eye);
    };
    makeEye(-1);
    makeEye(1);

    // Mouth: the swappable toothy face plane.
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 24),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, -0.04, front);
    this.head.add(facePlane);

    // Stubby arms hugged low on the sides (local origin is body centre).
    const armGeo = new THREE.CapsuleGeometry(0.1, 0.16, 5, 9);
    this.armL = new THREE.Mesh(armGeo, shag);
    this.armL.position.set(-W / 2 + 0.02, -0.12, 0.08);
    this.armL.rotation.z = 0.7;
    this.armR = new THREE.Mesh(armGeo, shag);
    this.armR.position.set(W / 2 - 0.02, -0.12, 0.08);
    this.armR.rotation.z = -0.7;
    this.bodyMesh.add(this.armL, this.armR);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    const menace = mood === 'menacing';

    // The mouth only (eyes are 3D): wide, slack, full of crooked human teeth.
    const mw = menace ? 104 : 80; // half-width
    const mh = menace ? 50 : 34;
    const my = c + 6;
    ctx.fillStyle = '#7d2f46'; // dark maroon interior
    ctx.beginPath();
    ctx.ellipse(c, my, mw, mh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#170a0d';
    ctx.beginPath();
    ctx.ellipse(c, my + 4, mw - 12, mh - 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crooked off-white teeth, gappy top row + a couple of bottom.
    ctx.fillStyle = '#e2d6ba';
    const teeth = menace ? 8 : 6;
    for (let i = 0; i < teeth; i++) {
      const tx = c - mw + 18 + (i * (mw * 2 - 36)) / (teeth - 1);
      const jitter = ((i * 37) % 7) - 3;
      if (i % 4 !== 3) ctx.fillRect(tx - 7, my - mh + 10 + jitter, 13, 18 + (i % 3) * 4); // gaps
      if (i % 3 === 1) ctx.fillRect(tx - 5, my + mh - 26 - jitter, 11, 15);
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    // Off-rhythm shamble: primary wobble + a half-frequency hitch (limp).
    const phase = t * 3.0;
    const amp = speed > 0 ? 1 : 0.15;
    const wobble = Math.sin(phase) * 0.1 + Math.sin(phase * 0.5 + 0.7) * 0.06;
    this.group.rotation.z = wobble * amp;
    this.bodyMesh.position.y = 0.49 + Math.abs(Math.sin(phase * 0.5)) * 0.05 * amp;
    this.armL.rotation.x = Math.sin(phase + 0.4) * 0.3 * amp;
    this.armR.rotation.x = Math.sin(phase + Math.PI + 0.9) * 0.3 * amp;
    if (speed > 0 && Math.abs(Math.sin(phase * 0.5)) < 0.04 && dt > 0) this.onGaitBeat?.('shuffle');

    // Menacing: a hot red ember bleeds into the glossy eyes.
    const red = this.mood === 'menacing';
    for (const m of this.eyeMats) {
      m.emissive.setHex(red ? 0x550000 : 0x000000);
      m.emissiveIntensity = red ? 0.7 : 0;
    }
  }
}
