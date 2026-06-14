import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';

/**
 * New Yama — the big fluffy alpaca/llama. Golden-brown curly fleece, a thick
 * forward neck, a small head with a fleece topknot, upright ears, shiny black
 * eyes and a cream muzzle, four slender legs with cream sock-feet, and a little
 * tail. The largest stuffy: her silhouette filling a doorway IS the scare.
 * Trots on diagonal leg pairs with a bobbing head.
 */
export class NewYama extends EnemyBase {
  private legs: THREE.Group[] = [];
  private neck!: THREE.Group;
  private head!: THREE.Group;
  private earL!: THREE.Mesh;
  private earR!: THREE.Mesh;
  private eyeMats: THREE.MeshStandardMaterial[] = [];

  constructor() {
    super('newYama');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const fur = furTexture({
      base: '#c69a55',
      tip: '#e6c184',
      shade: '#9c7838',
      fiberLen: 15,
      density: 1.7,
      thickness: 2.2,
      curl: 0.85,
      repeat: [3, 4],
    });
    const fleece = plushMaterial({
      map: fur.map,
      normalMap: fur.normal,
      sheenColor: 0xe6c690,
      sheenRoughness: 0.6,
      roughness: 1,
      fuzz: 0.6, // curly fleece
    });
    const cream = plushMaterial({
      color: 0xefe6d2,
      sheenColor: 0xfffdf2,
      roughness: 0.95,
      fuzz: 0.12,
    });

    // Barrel torso — long axis front-to-back along +Z (model-forward).
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 18), fleece);
    torso.scale.set(1.05, 1.0, 1.55);
    torso.position.y = 1.0;
    this.group.add(torso);

    // Tail fluff at the back.
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), fleece);
    tail.position.set(0, 1.04, -0.46);
    this.group.add(tail);

    // Legs: hip-pivoted groups (so PHASE-03 can place feet on stairs). fx
    // selects front/back (+Z front), fz selects side (±X).
    const makeLeg = (fx: number, fz: number) => {
      const leg = new THREE.Group();
      leg.position.set(fz * 0.17, 0.76, fx * 0.3);
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.5, 5, 9), fleece);
      upper.position.y = -0.28;
      leg.add(upper);
      const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.083, 0.08, 4, 8), cream);
      foot.position.set(0, -0.58, 0.02);
      foot.rotation.x = Math.PI / 2; // little forward-pointing hoof
      leg.add(foot);
      this.group.add(leg);
      this.legs.push(leg);
      return leg;
    };
    makeLeg(1, 1); // order: FL, FR, HL, HR
    makeLeg(1, -1);
    makeLeg(-1, 1);
    makeLeg(-1, -1);

    // Neck group rises from the front of the torso, leaning forward.
    this.neck = new THREE.Group();
    const neckMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.42, 6, 12), fleece);
    neckMesh.position.y = 0.24;
    this.neck.add(neckMesh);

    // Head group (turns for PHASE-03 gaze).
    this.head = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 14), fleece);
    skull.scale.set(1, 1.05, 1.05);
    this.head.add(skull);
    // Fleece topknot / bangs.
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), fleece);
    tuft.position.set(0, 0.17, -0.01);
    this.head.add(tuft);
    // Upright ears with a pale inner.
    const makeEar = (sx: number) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.17, 9), fleece);
      ear.position.set(sx * 0.11, 0.2, -0.01);
      ear.rotation.z = sx * -0.18;
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.12, 8), cream);
      inner.position.set(0, -0.01, 0.025);
      ear.add(inner);
      this.head.add(ear);
      return ear;
    };
    this.earL = makeEar(-1);
    this.earR = makeEar(1);
    // Shiny black eyes set wide on the fleece face.
    const makeEye = (sx: number) => {
      const m = new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.12, metalness: 0.2 });
      this.eyeMats.push(m);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.046, 14, 12), m);
      eye.position.set(sx * 0.115, 0.03, 0.13);
      this.head.add(eye);
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(0.013, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(sx * 0.115 - 0.012, 0.05, 0.176);
      this.head.add(glint);
    };
    makeEye(-1);
    makeEye(1);
    // Cream muzzle protruding front-down.
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), cream);
    muzzle.scale.set(1, 0.82, 1.15);
    muzzle.position.set(0, -0.07, 0.14);
    this.head.add(muzzle);

    // Face plane on the muzzle front: nose + mouth (swappable for mood).
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 18),
      new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true })
    );
    facePlane.position.set(0, -0.06, 0.27);
    this.head.add(facePlane);

    this.head.position.y = 0.5;
    this.neck.add(this.head);
    this.neck.position.set(0, 1.18, 0.3); // front-top of torso (+Z)
    this.neck.rotation.x = 0.16; // gentle forward lean
    this.group.add(this.neck);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    if (mood === 'calm') {
      // Embroidered dark nose (Λ) + the alpaca smile, on the cream muzzle.
      ctx.strokeStyle = '#3a2a1e';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(c - 26, c - 24);
      ctx.lineTo(c, c - 4);
      ctx.lineTo(c + 26, c - 24);
      ctx.stroke();
      // Smile dropping from the nose.
      ctx.beginPath();
      ctx.moveTo(c, c - 4);
      ctx.lineTo(c, c + 16);
      ctx.moveTo(c - 34, c + 34);
      ctx.quadraticCurveTo(c, c + 22, c, c + 16);
      ctx.quadraticCurveTo(c, c + 22, c + 34, c + 34);
      ctx.stroke();
    } else {
      // Menacing: flared nose + bared herbivore teeth.
      ctx.strokeStyle = '#3a2018';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(c - 28, c - 26);
      ctx.lineTo(c, c - 4);
      ctx.lineTo(c + 28, c - 26);
      ctx.stroke();
      ctx.fillStyle = '#3a201c';
      ctx.beginPath();
      ctx.ellipse(c, c + 30, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8e2d2';
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(c + i * 13 - 5, c + 14, 10, 16);
      }
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 2.4;
    const amp = speed > 0 ? 0.38 : 0.03;
    // Trot: diagonal pairs (FL+HR / FR+HL) swing about the hip.
    this.legs[0].rotation.x = Math.sin(phase) * amp;
    this.legs[3].rotation.x = Math.sin(phase) * amp;
    this.legs[1].rotation.x = Math.sin(phase + Math.PI) * amp;
    this.legs[2].rotation.x = Math.sin(phase + Math.PI) * amp;
    // Neck/head bob forward each stride; idle = slow scanning sweep.
    if (speed > 0) {
      this.neck.rotation.x = 0.16 + Math.sin(phase * 2) * 0.06;
      this.neck.rotation.y *= Math.max(0, 1 - 6 * dt);
      if (Math.abs(Math.sin(phase)) < 0.06 && dt > 0) this.onGaitBeat?.('hoof');
    } else {
      this.neck.rotation.y = Math.sin(t * 0.4) * 0.45;
      this.neck.rotation.x += (0.16 - this.neck.rotation.x) * Math.min(1, 6 * dt);
    }
    // Ears pin back when menacing; a red ember bleeds into the eyes.
    const pin = this.mood === 'menacing' ? 0.9 : 0;
    this.earL.rotation.x = -pin;
    this.earR.rotation.x = -pin;
    const red = this.mood === 'menacing';
    for (const m of this.eyeMats) {
      m.emissive.setHex(red ? 0x3a0000 : 0x000000);
      m.emissiveIntensity = red ? 0.6 : 0;
    }
  }
}
