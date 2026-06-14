import * as THREE from 'three';
import { EnemyBase, Mood } from './EnemyBase';
import { plushMaterial } from '../world/materialLibrary';
import { furTexture } from '../world/furTexture';
import { faceDecal } from './faceDecal';

/**
 * Charles (displayed in-game as "Little Timmy") — the Gorilla-Tag plush.
 * Mint-teal fuzzy body + head, a grey embroidered gorilla face (white-rimmed
 * eyes, flat nostril nose, brow, mouth), grey chest oval, small ears, a rainbow
 * cone party hat, and very long thick arms with mitt hands. Walks on his hands:
 * the long planted arms vault the legless body forward.
 */
export class Charles extends EnemyBase {
  private armL!: THREE.Group;
  private armR!: THREE.Group;
  private torso!: THREE.Group;
  private head!: THREE.Group;

  constructor() {
    super('charles');
    this.init();
  }

  protected buildBody(): THREE.Mesh {
    const fur = furTexture({
      base: '#7ed9c4',
      tip: '#a8f0dd',
      shade: '#5cb6a2',
      fiberLen: 5,
      density: 1.0,
      thickness: 1.3,
      curl: 0.12,
      repeat: [2, 2],
    });
    const mint = plushMaterial({
      map: fur.map,
      normalMap: fur.normal,
      sheenColor: 0x9aeeda,
      roughness: 0.95,
      fuzz: 0.3,
    });
    // Grey embroidered felt: smooth, faint nap.
    const grey = plushMaterial({
      color: 0x9aa0a8,
      sheenColor: 0xc2c8d0,
      sheenRoughness: 0.8,
      roughness: 0.9,
      fuzz: 0.12,
    });

    this.torso = new THREE.Group();

    // Gorilla-Tag silhouette: a rounded legless body mass, broad up top and
    // tapering to a rounded seat, resting on its long planted arms.
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 26), mint);
    body.scale.set(1.1, 1.08, 0.95);
    body.position.y = 0.6;
    this.torso.add(body);

    // Grey chest/belly patch (the GT two-tone) — a tall oval.
    const chest = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), grey);
    chest.position.set(0, 0.56, 0.41);
    chest.scale.set(1.0, 1.5, 1);
    this.torso.add(chest);

    // Head group (pivot at the short neck) so PHASE-03 gaze can aim it.
    this.head = new THREE.Group();
    this.head.position.set(0, 1.04, 0);
    this.torso.add(this.head);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 30, 24), mint);
    headMesh.scale.set(1.04, 0.96, 0.9);
    headMesh.position.set(0, 0.16, -0.02);
    this.head.add(headMesh);

    // Small rounded ears on the head sides.
    const earGeo = new THREE.SphereGeometry(0.07, 10, 8);
    for (const sx of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, mint);
      ear.scale.set(0.7, 1, 0.6);
      ear.position.set(sx * 0.3, 0.18, 0.0);
      this.head.add(ear);
    }

    // Grey embroidered gorilla face on a transparent decal plane.
    const facePlane = new THREE.Mesh(
      faceDecal(0.23, 0.33, 44),
      new THREE.MeshStandardMaterial({ roughness: 0.85, transparent: true })
    );
    facePlane.position.set(0, 0.14, 0.262);
    this.head.add(facePlane);

    // Rainbow cone hat — horizontal rainbow rings, red at the tip.
    const hatCanvas = document.createElement('canvas');
    hatCanvas.width = hatCanvas.height = 128;
    const hctx = hatCanvas.getContext('2d')!;
    const stripes = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa']; // red at the tip
    stripes.forEach((col, i) => {
      hctx.fillStyle = col;
      hctx.fillRect(0, (128 / stripes.length) * i, 128, 128 / stripes.length + 1);
    });
    const hatTex = new THREE.CanvasTexture(hatCanvas);
    hatTex.colorSpace = THREE.SRGBColorSpace;
    const hat = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.36, 18),
      new THREE.MeshStandardMaterial({ map: hatTex, roughness: 0.7 })
    );
    hat.position.set(0.04, 0.5, -0.02);
    hat.rotation.z = -0.22;
    this.head.add(hat);

    // Long broad arms with big mitt hands, planted forward — the legless body
    // rests on these (the Gorilla-Tag hand-walk).
    const makeArm = (side: number) => {
      const arm = new THREE.Group();
      // Shoulder blob that embeds into the torso so the arm reads attached.
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 16), mint);
      shoulder.position.y = 0.02;
      arm.add(shoulder);
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.86, 8, 16), mint);
      upper.position.y = -0.47;
      arm.add(upper);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 16), mint);
      hand.position.y = -0.98;
      hand.scale.set(1.3, 0.7, 1.5);
      arm.add(hand);
      arm.position.set(side * 0.42, 0.86, 0.12); // tucked in so the shoulder overlaps the body
      arm.rotation.x = -0.5;
      this.torso.add(arm);
      return arm;
    };
    this.armL = makeArm(-1);
    this.armR = makeArm(1);

    this.group.add(this.torso);
    return facePlane;
  }

  protected getHead(): { obj: THREE.Object3D; maxYaw: number; maxPitch: number } {
    return { obj: this.head, maxYaw: 0.6, maxPitch: 0.5 };
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number, mood: Mood): void {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    const menace = mood === 'menacing';

    // Grey gorilla-face patch: a rounded face with a lighter muzzle lobe.
    ctx.fillStyle = '#9aa0a8';
    ctx.beginPath();
    ctx.ellipse(c, c - 14, c * 0.92, c * 0.78, 0, 0, Math.PI * 2); // upper face
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c, c + 44, c * 0.66, c * 0.6, 0, 0, Math.PI * 2); // muzzle lobe
    ctx.fill();
    // Lighter muzzle highlight.
    ctx.fillStyle = '#b4bac2';
    ctx.beginPath();
    ctx.ellipse(c, c + 50, c * 0.5, c * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!menace) {
      // Bold white-rimmed cartoon eyes, set fairly close (the GT look).
      for (const dx of [-34, 34]) {
        ctx.fillStyle = '#f6f6f4';
        ctx.beginPath();
        ctx.ellipse(c + dx, c - 30, 28, 33, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2a2e34';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fillStyle = '#141414';
        ctx.beginPath();
        ctx.ellipse(c + dx + 2, c - 22, 11, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Brow ridge.
      ctx.strokeStyle = '#6f757d';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(c - 60, c - 54);
      ctx.quadraticCurveTo(c, c - 64, c + 60, c - 54);
      ctx.stroke();
      // Flat nose + two nostrils.
      ctx.fillStyle = '#5a6068';
      ctx.beginPath();
      ctx.ellipse(c - 13, c + 36, 6, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(c + 13, c + 36, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Calm mouth.
      ctx.strokeStyle = '#3c4248';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(c - 22, c + 64);
      ctx.quadraticCurveTo(c, c + 70, c + 22, c + 64);
      ctx.stroke();
    } else {
      // Menacing: slanted angry eyes + heavy brow, open snarl with teeth.
      for (const dx of [-34, 34]) {
        const s = Math.sign(dx);
        ctx.save();
        ctx.translate(c + dx, c - 28);
        ctx.rotate(s * 0.32);
        ctx.fillStyle = '#f6f6f4';
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fillStyle = '#7a0000';
        ctx.beginPath();
        ctx.ellipse(0, 4, 10, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#23272d';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(-30, -22);
        ctx.lineTo(26, -8);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#5a6068';
      ctx.beginPath();
      ctx.ellipse(c - 13, c + 30, 6, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(c + 13, c + 30, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Open snarl with sharp pointed fangs.
      ctx.fillStyle = '#2a0f12';
      ctx.beginPath();
      ctx.ellipse(c, c + 60, 42, 27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ece6d6';
      const n = 7;
      for (let i = 0; i < n; i++) {
        const x = c - 36 + (i * 72) / (n - 1);
        ctx.beginPath(); // upper fang
        ctx.moveTo(x - 6, c + 36);
        ctx.lineTo(x + 6, c + 36);
        ctx.lineTo(x, c + 36 + (i % 2 ? 26 : 18));
        ctx.fill();
        ctx.beginPath(); // lower fang
        ctx.moveTo(x - 5, c + 84);
        ctx.lineTo(x + 5, c + 84);
        ctx.lineTo(x, c + 84 - (i % 2 ? 22 : 14));
        ctx.fill();
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
    if (speed > 0 && Math.abs(Math.sin(phase)) < 0.08 && dt > 0) this.onGaitBeat?.('knuckle');
  }
}
