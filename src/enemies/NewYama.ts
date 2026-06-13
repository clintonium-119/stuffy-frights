import * as THREE from 'three';
import { EnemyBase, Mood, fabricTexture } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';

/**
 * New Yama — the big fluffy llama. Golden-brown curly fleece, tall upright
 * neck, small head with pale muzzle and a fleece tuft, white sock hooves.
 * The largest stuffy: her silhouette filling a doorway IS the scare.
 * Trots on diagonal leg pairs with a bobbing head.
 */
export class NewYama extends EnemyBase {
  private legs: THREE.Mesh[] = [];
  private neck!: THREE.Group;
  private earL!: THREE.Mesh;
  private earR!: THREE.Mesh;

  constructor() {
    super('newYama');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const fleece = plushMaterial({
      map: fabricTexture('#c69a55', '#b4884a', '#e0b97a', 2.2),
      sheenColor: 0xe0b97a,
      sheenRoughness: 0.55,
      roughness: 1,
      fuzz: 0.5, // curly fleece
    });
    const pale = plushMaterial({
      map: fabricTexture('#efe8d8', '#e0d6c0', '#fffdf2', 0.8),
      sheenColor: 0xfffdf2,
      roughness: 0.95,
    });

    // Torso — long axis runs front-to-back along +Z (model-forward convention).
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.6, 6, 14), fleece);
    torso.rotation.x = Math.PI / 2;
    torso.position.y = 0.95;
    this.group.add(torso);

    // Legs with white socks. fx selects the front/back pair (+Z front),
    // fz selects the left/right side (±X).
    const makeLeg = (fx: number, fz: number) => {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.62, 5, 8), fleece);
      leg.position.set(fz * 0.16, 0.48, fx * 0.3);
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.22, 10), pale);
      sock.position.y = -0.32;
      leg.add(sock);
      this.group.add(leg);
      this.legs.push(leg);
      return leg;
    };
    makeLeg(1, 1); // front-left etc: order FL, FR, HL, HR
    makeLeg(1, -1);
    makeLeg(-1, 1);
    makeLeg(-1, -1);

    // Neck + head group (bobs together).
    this.neck = new THREE.Group();
    const neckMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.5, 5, 10), fleece);
    neckMesh.position.y = 0.25;
    this.neck.add(neckMesh);

    const head = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 12), fleece);
    head.add(skull);
    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.13, 0.2), pale);
    muzzle.position.set(0, -0.04, 0.16);
    head.add(muzzle);
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), fleece);
    tuft.position.set(0, 0.15, -0.02);
    head.add(tuft);
    this.earL = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 8), fleece);
    this.earL.position.set(-0.09, 0.16, 0.02);
    head.add(this.earL);
    this.earR = this.earL.clone();
    this.earR.position.x = 0.09;
    head.add(this.earR);

    // Face plane on the head front.
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 16),
      new THREE.MeshStandardMaterial({ roughness: 0.9 })
    );
    facePlane.position.set(0, 0.02, 0.15);
    head.add(facePlane);

    head.position.y = 0.62;
    this.neck.add(head);
    this.neck.position.set(0, 1.05, 0.32); // front of torso (+Z)
    this.neck.rotation.x = 0.12; // gentle forward lean toward +Z
    this.group.add(this.neck);

    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    if (mood === 'calm') {
      // Soft dark doe eyes.
      ctx.fillStyle = '#2c1f14';
      for (const dx of [-44, 44]) {
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 16, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Gentle nostril curves on the muzzle area.
      ctx.strokeStyle = '#9a8a72';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(c - 14, c + 52);
      ctx.quadraticCurveTo(c, c + 60, c + 14, c + 52);
      ctx.stroke();
    } else {
      // Wide white-ringed eyes + bared herbivore teeth.
      for (const dx of [-44, 44]) {
        ctx.fillStyle = '#f2efe6';
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 16, 22, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a0f08';
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 12, 9, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#3a201c';
      ctx.beginPath();
      ctx.ellipse(c, c + 52, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8e2d2';
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(c + i * 13 - 5, c + 34, 10, 14);
      }
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 2.4;
    const amp = speed > 0 ? 0.38 : 0.03;
    // Trot: diagonal pairs (FL+HR / FR+HL).
    this.legs[0].rotation.x = Math.sin(phase) * amp;
    this.legs[3].rotation.x = Math.sin(phase) * amp;
    this.legs[1].rotation.x = Math.sin(phase + Math.PI) * amp;
    this.legs[2].rotation.x = Math.sin(phase + Math.PI) * amp;
    // Neck/head bob forward each stride; idle = slow scanning sweep.
    if (speed > 0) {
      this.neck.rotation.x = 0.12 + Math.sin(phase * 2) * 0.07;
      this.neck.rotation.y *= Math.max(0, 1 - 6 * dt); // settle any idle sweep
      if (Math.abs(Math.sin(phase)) < 0.06 && dt > 0) this.onGaitBeat?.('hoof');
    } else {
      this.neck.rotation.y = Math.sin(t * 0.4) * 0.5;
      this.neck.rotation.x += (0.12 - this.neck.rotation.x) * Math.min(1, 6 * dt);
    }
    // Ears pin back when menacing.
    const pin = this.mood === 'menacing' ? 0.9 : 0;
    this.earL.rotation.x = -pin;
    this.earR.rotation.x = -pin;
  }
}
