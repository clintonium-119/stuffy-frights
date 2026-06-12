import * as THREE from 'three';
import { EnemyBase, Mood, fabricTexture } from './EnemyBase';

/**
 * Fuggie — the fuggler. Lumpy teal shag mottled with purple, pointed
 * cat ears, round amber-ringed eyes, stubby hugged arms, and the signature
 * wide mouth full of human-like teeth. The only stuffy whose CALM face
 * already shows teeth. Shambles with an off-rhythm limp.
 */
export class Fuggie extends EnemyBase {
  private bodyMesh!: THREE.Mesh;
  private head!: THREE.Group;
  private armL!: THREE.Mesh;
  private armR!: THREE.Mesh;

  constructor() {
    super('fuggie');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const shag = new THREE.MeshStandardMaterial({
      map: fabricTexture('#2f9e86', '#7a4f9e', '#4fc4ac', 2.6, 14),
      roughness: 1,
    });

    // Lumpy ovoid: displaced sphere.
    const geo = new THREE.SphereGeometry(0.42, 24, 18);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const bump =
        1 +
        0.08 * Math.sin(v.x * 9.1 + 1.3) * Math.cos(v.y * 7.7) +
        0.06 * Math.sin(v.z * 11.3 + 0.4);
      v.multiplyScalar(bump);
      pos.setXYZ(i, v.x, v.y * 1.25, v.z);
    }
    geo.computeVertexNormals();
    this.bodyMesh = new THREE.Mesh(geo, shag);
    this.bodyMesh.position.y = 0.5;
    this.group.add(this.bodyMesh);

    // Head is part of the body lump; ears + face mount on a tilt group.
    this.head = new THREE.Group();
    const earGeo = new THREE.ConeGeometry(0.1, 0.22, 4);
    const earL = new THREE.Mesh(earGeo, shag);
    earL.position.set(-0.22, 0.52, 0);
    earL.rotation.z = 0.3;
    const earR = new THREE.Mesh(earGeo, shag);
    earR.position.set(0.22, 0.52, 0);
    earR.rotation.z = -0.3;
    this.head.add(earL, earR);

    // Big face plane (eyes + the mouth of many teeth).
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 22),
      new THREE.MeshStandardMaterial({ roughness: 0.9 })
    );
    facePlane.position.set(0, 0.18, 0.41);
    facePlane.rotation.x = -0.08;
    this.head.add(facePlane);
    this.head.position.y = 0.5;
    this.head.rotation.z = 0.09; // permanent slight tilt
    this.group.add(this.head);

    // Stubby arms hugged to the body.
    const armGeo = new THREE.CapsuleGeometry(0.09, 0.2, 4, 8);
    this.armL = new THREE.Mesh(armGeo, shag);
    this.armL.position.set(-0.4, 0.42, 0.12);
    this.armL.rotation.z = 0.5;
    this.armR = new THREE.Mesh(armGeo, shag);
    this.armR.position.set(0.4, 0.42, 0.12);
    this.armR.rotation.z = -0.5;
    this.group.add(this.armL, this.armR);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    const menace = mood === 'menacing';

    // Round dark eyes with amber rings.
    for (const dx of [-52, 52]) {
      ctx.fillStyle = '#b06a28';
      ctx.beginPath();
      ctx.arc(c + dx, c - 38, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#140a06';
      ctx.beginPath();
      ctx.arc(c + dx, c - 38, 21, 0, Math.PI * 2);
      ctx.fill();
      if (menace) {
        ctx.fillStyle = '#aa1100';
        ctx.beginPath();
        ctx.arc(c + dx + 4, c - 34, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(c + dx - 7, c - 45, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // The mouth: wide, slack, full of crooked human teeth. Calm already
    // shows them; menacing stretches wider with more gum.
    const mw = menace ? 96 : 74; // half-width
    const mh = menace ? 46 : 30;
    const my = c + 42;
    ctx.fillStyle = '#8e3a52'; // gums
    ctx.beginPath();
    ctx.ellipse(c, my, mw, mh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c0c10';
    ctx.beginPath();
    ctx.ellipse(c, my + 4, mw - 10, mh - 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crooked off-white teeth, top and bottom rows.
    ctx.fillStyle = '#ddd2b8';
    const teeth = menace ? 8 : 6;
    for (let i = 0; i < teeth; i++) {
      const tx = c - mw + 16 + (i * (mw * 2 - 32)) / (teeth - 1);
      const jitter = ((i * 37) % 7) - 3;
      ctx.fillRect(tx - 6, my - mh + 8 + jitter, 12, 16 + (i % 3) * 3);
      ctx.fillRect(tx - 5, my + mh - 24 - jitter, 10, 14 + ((i + 1) % 2) * 4);
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    // Off-rhythm shamble: primary wobble + a half-frequency hitch (limp).
    const phase = t * 3.0;
    const amp = speed > 0 ? 1 : 0.15;
    const wobble = Math.sin(phase) * 0.1 + Math.sin(phase * 0.5 + 0.7) * 0.06;
    this.group.rotation.z = wobble * amp;
    this.bodyMesh.position.y = 0.5 + Math.abs(Math.sin(phase * 0.5)) * 0.05 * amp;
    // Arms sway out of phase.
    this.armL.rotation.x = Math.sin(phase + 0.4) * 0.3 * amp;
    this.armR.rotation.x = Math.sin(phase + Math.PI + 0.9) * 0.3 * amp;
    // Head tilt deepens when menacing.
    const tilt = this.mood === 'menacing' ? 0.26 : 0.09;
    this.head.rotation.z += (tilt - this.head.rotation.z) * Math.min(1, 6 * dt);
    if (speed > 0 && Math.abs(Math.sin(phase * 0.5)) < 0.04 && dt > 0) this.onGaitBeat?.('shuffle');
  }
}
