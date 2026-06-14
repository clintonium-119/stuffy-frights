import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';
import { faceDecal } from './faceDecal';

/** A box rounded by pushing its surface verts onto a corner radius. */
function roundedBox(w: number, h: number, d: number, r: number, seg = 10): THREE.BufferGeometry {
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
 * Fuggie — the fuggler. A tall, plump, rounded body of coarse teal shag mottled
 * with blue + purple, two soft ear-peaks at the top corners, big round glossy
 * maroon-rimmed eyes, hugged stubby arms, two little stubby legs to waddle on,
 * and the signature wide mouth of crooked **square** human teeth. Shambles with
 * an off-rhythm limp.
 */
export class Fuggie extends EnemyBase {
  private bodyMesh!: THREE.Mesh;
  private head!: THREE.Group;
  private armL!: THREE.Mesh;
  private armR!: THREE.Mesh;
  private legs: THREE.Group[] = [];
  private eyeMats: THREE.MeshStandardMaterial[] = [];

  constructor() {
    super('fuggie');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const fur = furTexture({
      base: '#2f9e86',
      tip: '#63d2b6',
      shade: '#22685a',
      fiberLen: 22,
      density: 1.8,
      thickness: 2.1,
      curl: 0.4,
      repeat: [2, 3],
      mottle: [
        { color: '#7a4f9e', count: 24, size: 32 },
        { color: '#3f9ed6', count: 18, size: 28 },
      ],
    });
    const shag = plushMaterial({
      map: fur.map,
      normalMap: fur.normal,
      sheenColor: 0x6fd0b8,
      sheenRoughness: 0.5,
      roughness: 1,
      fuzz: 0.75,
    });

    // Tall plump body — rounded but not a uniform pillow.
    const W = 0.8;
    const H = 1.06;
    const D = 0.54;
    this.bodyMesh = new THREE.Mesh(roundedBox(W, H, D, 0.27, 12), shag);
    this.bodyMesh.position.y = H / 2 + 0.12; // lifted to sit on the stubby legs
    this.group.add(this.bodyMesh);

    // Soft ear-peaks at the top corners (cones rooted into the body top).
    const earGeo = new THREE.ConeGeometry(0.14, 0.32, 16);
    for (const sx of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, shag);
      ear.position.set(sx * 0.26, H / 2 - 0.02, 0.02);
      ear.rotation.z = sx * 0.32;
      ear.rotation.x = -0.12;
      this.bodyMesh.add(ear);
    }

    // Head group carries eyes + mouth so gaze can tilt them.
    this.head = new THREE.Group();
    this.bodyMesh.add(this.head);

    const front = D / 2 + 0.005;
    const makeEye = (sx: number) => {
      const eye = new THREE.Group();
      const rim = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 28),
        new THREE.MeshStandardMaterial({ color: 0x3a0c10, roughness: 0.55 })
      );
      eye.add(rim);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x0a0708, roughness: 0.1, metalness: 0.2 });
      this.eyeMats.push(domeMat);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.105, 22, 18), domeMat);
      dome.scale.set(1, 1, 0.72);
      dome.position.z = 0.02;
      eye.add(dome);
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(0.026, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(sx * -0.035, 0.04, 0.105);
      eye.add(glint);
      eye.position.set(sx * 0.21, 0.2, front);
      eye.rotation.z = sx * 0.05; // faint inward tilt → meaner
      this.head.add(eye);
    };
    makeEye(-1);
    makeEye(1);

    // Mouth: the swappable toothy face wrapped onto the (nearly flat) face.
    const facePlane = new THREE.Mesh(
      faceDecal(0.22, 0.7, 40),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, 0.0, front + 0.01);
    this.head.add(facePlane);

    // Stubby arms hugged to the lower sides (rooted into the body, no gap).
    const armGeo = new THREE.CapsuleGeometry(0.11, 0.18, 6, 12);
    this.armL = new THREE.Mesh(armGeo, shag);
    this.armL.position.set(-W / 2 + 0.04, -0.16, 0.12);
    this.armL.rotation.z = 0.42;
    this.armR = new THREE.Mesh(armGeo, shag);
    this.armR.position.set(W / 2 - 0.04, -0.16, 0.12);
    this.armR.rotation.z = -0.42;
    this.bodyMesh.add(this.armL, this.armR);

    // Two little stubby legs to walk on (hip-pivoted for gait + stair feet).
    const makeLeg = (sx: number) => {
      const leg = new THREE.Group();
      leg.position.set(sx * 0.2, 0.26, 0.06);
      const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.12, 6, 12), shag);
      limb.position.y = -0.12;
      leg.add(limb);
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), shag);
      foot.scale.set(1.1, 0.7, 1.25);
      foot.position.set(0, -0.22, 0.03);
      leg.add(foot);
      this.group.add(leg);
      this.legs.push(leg);
      return leg;
    };
    makeLeg(-1);
    makeLeg(1);

    return facePlane;
  }

  protected getHead(): { obj: THREE.Object3D; maxYaw: number; maxPitch: number } {
    return { obj: this.head, maxYaw: 0.4, maxPitch: 0.45 };
  }

  protected getLegs(): THREE.Object3D[] {
    return this.legs;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    const menace = mood === 'menacing';

    // The mouth only (eyes are 3D): wide, slack, full of crooked SQUARE teeth.
    const mw = menace ? 110 : 82; // half-width
    const mh = menace ? 54 : 34;
    const my = c + 8;
    ctx.fillStyle = '#7d2f46';
    ctx.beginPath();
    ctx.ellipse(c, my, mw, mh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#160a0d';
    ctx.beginPath();
    ctx.ellipse(c, my + 4, mw - 12, mh - 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crooked off-white SQUARE teeth (the trademark) — gappy top + a few bottom.
    ctx.fillStyle = '#e2d6ba';
    const teeth = menace ? 8 : 6;
    for (let i = 0; i < teeth; i++) {
      const tx = c - mw + 18 + (i * (mw * 2 - 36)) / (teeth - 1);
      const jitter = ((i * 37) % 7) - 3;
      if (i % 4 !== 3) ctx.fillRect(tx - 8, my - mh + 10 + jitter, 15, 20 + (i % 3) * 4);
      if (i % 3 === 1) ctx.fillRect(tx - 6, my + mh - 28 - jitter, 12, 16);
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 3.0;
    const amp = speed > 0 ? 1 : 0.15;
    const wobble = Math.sin(phase) * 0.09 + Math.sin(phase * 0.5 + 0.7) * 0.05;
    this.group.rotation.z = wobble * amp;
    this.bodyMesh.position.y = 0.65 + Math.abs(Math.sin(phase * 0.5)) * 0.04 * amp;
    this.armL.rotation.x = Math.sin(phase + 0.4) * 0.28 * amp;
    this.armR.rotation.x = Math.sin(phase + Math.PI + 0.9) * 0.28 * amp;
    // Stubby legs waddle out of phase.
    if (this.legs.length === 2) {
      this.legs[0].rotation.x = Math.sin(phase) * 0.5 * amp;
      this.legs[1].rotation.x = Math.sin(phase + Math.PI) * 0.5 * amp;
    }
    if (speed > 0 && Math.abs(Math.sin(phase * 0.5)) < 0.04 && dt > 0) this.onGaitBeat?.('shuffle');

    const red = this.mood === 'menacing';
    for (const m of this.eyeMats) {
      m.emissive.setHex(red ? 0x550000 : 0x000000);
      m.emissiveIntensity = red ? 0.7 : 0;
    }
  }
}
