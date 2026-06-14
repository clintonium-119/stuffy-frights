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
      fuzz: 0.5,
    });

    // Chunky rounded-square pillow body — flat front-to-back like the real plush.
    const W = 0.86;
    const H = 1.0;
    const D = 0.4;
    this.bodyMesh = new THREE.Mesh(roundedBox(W, H, D, 0.26, 14), shag);
    this.bodyMesh.position.y = H / 2 + 0.1; // lifted to sit on the stubby legs
    this.group.add(this.bodyMesh);

    // Soft rounded ear-nubs at the top corners (egg-shaped bumps, not pointy
    // cones — the fuggler's ears are stubby and round).
    const earGeo = new THREE.SphereGeometry(0.15, 22, 18);
    for (const sx of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, shag);
      ear.scale.set(0.92, 1.45, 0.85);
      ear.position.set(sx * 0.27, H / 2 + 0.02, -0.02);
      ear.rotation.z = sx * 0.34;
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
      eye.position.set(sx * 0.22, 0.18, front);
      eye.rotation.z = sx * 0.05; // faint inward tilt → meaner
      this.head.add(eye);
    };
    makeEye(-1);
    makeEye(1);

    // Mouth cavity: the swappable maroon maw on a flat plane held proud of the
    // shag (only the maroon draws; the rest is transparent), so the deep fuzz
    // can't swallow it. Mood resizes the maw. Teeth are 3D geometry in front.
    const facePlane = new THREE.Mesh(
      faceDecal(0.24, 1.8, 40), // nearly flat — the face front is flat
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, -0.08, front + 0.04);
    this.head.add(facePlane);

    // The signature crooked tan SQUARE teeth, as chunky little 3D blocks: two big
    // front teeth, smaller gappy neighbours up top + a couple on the bottom.
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xded0ad, roughness: 0.55 });
    const mouthY = -0.08;
    // [x, yOffset, width, height, rotZ]
    const teeth: [number, number, number, number, number][] = [
      [-0.028, 0.022, 0.052, 0.078, 0.02], // big front left
      [0.03, 0.026, 0.05, 0.07, -0.04], // big front right
      [-0.092, 0.03, 0.042, 0.05, 0.12], // upper left
      [0.094, 0.032, 0.04, 0.046, -0.1], // upper right
      [-0.15, 0.034, 0.034, 0.038, 0.18], // upper far-left (small)
      [-0.04, -0.04, 0.04, 0.044, -0.06], // bottom left
      [0.052, -0.042, 0.036, 0.04, 0.08], // bottom right
    ];
    for (const [tx, ty, tw, th, rz] of teeth) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 0.03), toothMat);
      tooth.position.set(tx, mouthY + ty, front + 0.05);
      tooth.rotation.z = rz;
      this.head.add(tooth);
    }

    // Short stubby arms hanging at the front sides (rooted into the body).
    const armGeo = new THREE.CapsuleGeometry(0.1, 0.15, 6, 12);
    this.armL = new THREE.Mesh(armGeo, shag);
    this.armL.position.set(-W / 2 + 0.02, -0.2, 0.16);
    this.armL.rotation.z = 0.14;
    this.armR = new THREE.Mesh(armGeo, shag);
    this.armR.position.set(W / 2 - 0.02, -0.2, 0.16);
    this.armR.rotation.z = -0.14;
    this.bodyMesh.add(this.armL, this.armR);

    // Two little stubby feet poking out the bottom (hip-pivoted for gait + stairs).
    const makeLeg = (sx: number) => {
      const leg = new THREE.Group();
      leg.position.set(sx * 0.18, 0.2, 0.04);
      const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.06, 6, 12), shag);
      limb.position.y = -0.08;
      leg.add(limb);
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), shag);
      foot.scale.set(1.1, 0.66, 1.35);
      foot.position.set(0, -0.16, 0.04);
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

    // The maroon mouth cavity only (eyes + teeth are 3D geometry). Mood widens
    // the maw; the gummy maroon lip rings a darker throat.
    const mw = menace ? 124 : 104; // half-width
    const mh = menace ? 60 : 46;
    const my = c;
    ctx.fillStyle = '#7d2f46';
    ctx.beginPath();
    ctx.ellipse(c, my, mw, mh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#160a0d';
    ctx.beginPath();
    ctx.ellipse(c, my + 4, mw - 14, mh - 14, 0, 0, Math.PI * 2);
    ctx.fill();
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
