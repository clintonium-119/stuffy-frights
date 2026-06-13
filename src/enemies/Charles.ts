import * as THREE from 'three';
import { EnemyBase, Mood, fabricTexture } from './EnemyBase';

/**
 * Charles (displayed in-game as "Little Timmy") — the Gorilla Tag plush. Mint-teal fuzzy body, grey face and
 * chest patch, bold white-rimmed eyes, rainbow cone party hat. Walks on
 * his hands: long planted arms vault the body forward, stubby legs trail.
 */
export class Charles extends EnemyBase {
  private armL!: THREE.Group;
  private armR!: THREE.Group;
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

    // Gorilla-Tag silhouette: a single rounded legless body mass — broad
    // shoulders tapering down — that rests on its long planted arms. No legs.
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 16), mint);
    body.scale.set(1.15, 1.0, 0.95); // broad, slightly squat torso
    body.position.y = 0.62;
    this.torso.add(body);

    // Grey chest/belly patch (the GT two-tone).
    const chest = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), grey);
    chest.position.set(0, 0.58, 0.42);
    chest.scale.y = 1.3;
    this.torso.add(chest);

    // Head sits low on the body (short gorilla neck), grey gorilla face front.
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 14), mint);
    head.scale.set(1.0, 0.92, 0.95);
    head.position.set(0, 1.06, 0.04);
    this.torso.add(head);
    // Heavy brow ridge over the face.
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.12), grey);
    brow.position.set(0, 1.16, 0.27);
    brow.rotation.x = 0.15;
    this.torso.add(brow);
    const facePlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.24, 20),
      new THREE.MeshStandardMaterial({ roughness: 0.85 })
    );
    facePlane.position.set(0, 1.02, 0.29);
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
    hat.position.set(0.03, 1.4, 0.0);
    hat.rotation.z = -0.15;
    this.torso.add(hat);

    // Long broad arms with big mitt hands, planted forward on the ground — the
    // legless body rests on these (the Gorilla-Tag hand-walk).
    const makeArm = (side: number) => {
      const arm = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.82, 5, 10), mint);
      upper.position.y = -0.45;
      arm.add(upper);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), mint);
      hand.position.y = -0.94;
      hand.scale.set(1.3, 0.65, 1.45);
      arm.add(hand);
      arm.position.set(side * 0.48, 0.9, 0.16); // broad shoulders
      arm.rotation.x = -0.5; // reach forward-down
      this.torso.add(arm);
      return arm;
    };
    this.armL = makeArm(-1);
    this.armR = makeArm(1);

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
    // Alternating arm vaults — the whole body swings forward over the hands.
    this.armL.rotation.x = -0.5 + Math.sin(phase) * 0.55 * amp;
    this.armR.rotation.x = -0.5 + Math.sin(phase + Math.PI) * 0.55 * amp;
    // Legless body rocks side to side and bobs as the knuckles plant.
    this.torso.rotation.z = Math.sin(phase) * 0.18 * amp;
    this.torso.position.y = Math.abs(Math.sin(phase)) * 0.1 * amp;
    // Gait beat: hand plants (audio hook).
    if (speed > 0 && Math.abs(Math.sin(phase)) < 0.08 && dt > 0) this.onGaitBeat?.('knuckle');
  }
}
