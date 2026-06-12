import * as THREE from 'three';
import { EnemyBase, Mood, fabricTexture } from './EnemyBase';

/**
 * Charles — the Gorilla Tag plush. Mint-teal fuzzy body, grey face and
 * chest patch, bold white-rimmed eyes, rainbow cone party hat. Walks on
 * his hands: long planted arms vault the body forward, stubby legs trail.
 */
export class Charles extends EnemyBase {
  private armL!: THREE.Group;
  private armR!: THREE.Group;
  private legL!: THREE.Mesh;
  private legR!: THREE.Mesh;
  private torso!: THREE.Group;

  constructor() {
    super('charles');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const mint = new THREE.MeshStandardMaterial({
      map: fabricTexture('#7ed9c4', '#6cc4b0', '#9aeeda', 1.2),
      roughness: 0.95,
    });
    const grey = new THREE.MeshStandardMaterial({
      map: fabricTexture('#9aa0a8', '#8a9098', '#b5bcc4', 0.7),
      roughness: 0.9,
    });

    this.torso = new THREE.Group();

    // Torso: upright capsule leaning slightly forward.
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.5, 6, 14), mint);
    body.position.y = 0.78;
    body.rotation.x = 0.18;
    this.torso.add(body);

    // Chest patch.
    const chest = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20), grey);
    chest.position.set(0, 0.74, 0.31);
    chest.scale.y = 1.35;
    chest.rotation.x = -0.18;
    this.torso.add(chest);

    // Head + flat face.
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 14), mint);
    head.position.set(0, 1.32, 0.06);
    this.torso.add(head);
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.21, 20),
      new THREE.MeshStandardMaterial({ roughness: 0.85 })
    );
    facePlane.position.set(0, 1.3, 0.31);
    this.torso.add(facePlane);

    // Rainbow cone hat.
    const hatCanvas = document.createElement('canvas');
    hatCanvas.width = hatCanvas.height = 128;
    const hctx = hatCanvas.getContext('2d')!;
    const stripes = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa'];
    stripes.forEach((c, i) => {
      hctx.fillStyle = c;
      hctx.fillRect((128 / stripes.length) * i, 0, 128 / stripes.length + 1, 128);
    });
    const hatTex = new THREE.CanvasTexture(hatCanvas);
    hatTex.colorSpace = THREE.SRGBColorSpace;
    const hat = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.34, 16),
      new THREE.MeshStandardMaterial({ map: hatTex, roughness: 0.7 })
    );
    hat.position.set(0.03, 1.66, 0.02);
    hat.rotation.z = -0.15;
    this.torso.add(hat);

    // Long arms with mitt hands, planted forward on the ground.
    const makeArm = (side: number) => {
      const arm = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.78, 5, 10), mint);
      upper.position.y = -0.45;
      arm.add(upper);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), mint);
      hand.position.y = -0.92;
      hand.scale.set(1.25, 0.7, 1.4);
      arm.add(hand);
      arm.position.set(side * 0.42, 1.0, 0.18);
      arm.rotation.x = -0.5; // reach forward-down
      this.torso.add(arm);
      return arm;
    };
    this.armL = makeArm(-1);
    this.armR = makeArm(1);

    // Stubby trailing legs.
    const makeLeg = (side: number) => {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.3, 5, 8), mint);
      leg.position.set(side * 0.2, 0.32, -0.16);
      leg.rotation.x = 0.7;
      this.torso.add(leg);
      return leg;
    };
    this.legL = makeLeg(-1);
    this.legR = makeLeg(1);

    this.group.add(this.torso);
    return facePlane;
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    // Grey face disc.
    ctx.fillStyle = '#9aa0a8';
    ctx.beginPath();
    ctx.arc(c, c, c, 0, Math.PI * 2);
    ctx.fill();

    if (mood === 'calm') {
      // Bold white-rimmed cartoon eyes (the Gorilla Tag look).
      for (const dx of [-38, 38]) {
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 22, 30, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 14, 11, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Nostrils + small mouth.
      ctx.fillStyle = '#5a6068';
      ctx.beginPath();
      ctx.ellipse(c - 10, c + 38, 5, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(c + 10, c + 38, 5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3c4248';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(c - 22, c + 62);
      ctx.quadraticCurveTo(c, c + 70, c + 22, c + 62);
      ctx.stroke();
    } else {
      // Menacing: slanted angry eyes, open snarl with flat teeth.
      for (const dx of [-38, 38]) {
        const s = Math.sign(dx);
        ctx.save();
        ctx.translate(c + dx, c - 22);
        ctx.rotate(s * 0.35);
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.fillStyle = '#7a0000';
        ctx.beginPath();
        ctx.ellipse(0, 4, 10, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        // Heavy brow.
        ctx.strokeStyle = '#2a2e34';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-30, -22);
        ctx.lineTo(28, -10);
        ctx.stroke();
        ctx.restore();
      }
      // Open snarl.
      ctx.fillStyle = '#3a1518';
      ctx.beginPath();
      ctx.ellipse(c, c + 56, 36, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8e2d2';
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(c + i * 11 - 4, c + 36, 8, 12);
        ctx.fillRect(c + i * 11 - 4, c + 66, 8, 12);
      }
    }
  }

  protected animateGait(t: number, speed: number, dt: number): void {
    const phase = t * 3.2;
    const amp = speed > 0 ? 1 : 0.12; // tiny idle sway
    // Alternating arm vaults.
    this.armL.rotation.x = -0.5 + Math.sin(phase) * 0.55 * amp;
    this.armR.rotation.x = -0.5 + Math.sin(phase + Math.PI) * 0.55 * amp;
    // Body rocks side to side and bobs as the hands plant.
    this.torso.rotation.z = Math.sin(phase) * 0.17 * amp;
    this.torso.position.y = Math.abs(Math.sin(phase)) * 0.09 * amp;
    // Legs trail loosely.
    this.legL.rotation.x = 0.7 + Math.sin(phase + 1.2) * 0.25 * amp;
    this.legR.rotation.x = 0.7 + Math.sin(phase + Math.PI + 1.2) * 0.25 * amp;
    // Gait beat: hand plants (audio hook).
    if (speed > 0 && Math.abs(Math.sin(phase)) < 0.08 && dt > 0) this.onGaitBeat?.('knuckle');
  }
}
