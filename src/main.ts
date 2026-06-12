import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Input } from './core/Input';
import { ColliderSet, aabb } from './core/Collision';
import { PlayerController } from './player/PlayerController';
import { InteractionSystem } from './player/Interaction';

// Controller test arena — replaced by the house in the world phase.
const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new Engine(canvas);
const input = new Input();
input.attach(canvas);
canvas.addEventListener('click', () => input.requestPointerLock());

engine.scene.background = new THREE.Color(0x0a0a12);

const colliders = new ColliderSet();
const mat = (color: number) => new THREE.MeshStandardMaterial({ color });

const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), mat(0x222228));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
engine.scene.add(floor);

function box(x: number, y: number, z: number, w: number, h: number, d: number, color: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  engine.scene.add(m);
  colliders.add(aabb(x - w / 2, y, z - d / 2, x + w / 2, y + h, z + d / 2));
}

// Walls and obstacles
box(0, 0, -8, 12, 3, 0.4, 0x554433); // wall
box(-5, 0, 0, 1.5, 1.5, 1.5, 0x445566); // crate
box(4, 0, -2, 2, 0.25, 2, 0x666644); // low step (climbable)
box(6.5, 0, -2, 2, 0.5, 2, 0x666644); // second step
box(9, 0, -2, 2, 1.2, 2, 0x664444); // too tall to climb

engine.scene.add(new THREE.AmbientLight(0x404060, 1.2));
const lamp = new THREE.PointLight(0xffcc88, 40);
lamp.position.set(2, 4, 2);
lamp.castShadow = true;
engine.scene.add(lamp);

const player = new PlayerController(engine.camera, input, colliders);
player.teleport(0, 0, 4);

// Interaction test targets: two glowing orbs
const interactions = new InteractionSystem();
let orbACount = 0;
let orbBCount = 0;
function orb(x: number, z: number, color: number, name: string, onHit: () => void) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.5 })
  );
  m.position.set(x, 1.1, z);
  engine.scene.add(m);
  interactions.add({
    position: m.position,
    radius: 2.2,
    label: `Touch ${name}`,
    enabled: () => true,
    onInteract: onHit,
  });
}
orb(-2, 1, 0x44ffaa, 'orb A', () => orbACount++);
orb(-3.5, 1, 0xff8844, 'orb B', () => orbBCount++);

// Debug position overlay (removed when real HUD lands)
const ui = document.getElementById('ui') as HTMLDivElement;
const debug = document.createElement('div');
debug.style.cssText =
  'position:absolute;top:8px;left:8px;color:#8f8;font:12px monospace;text-shadow:0 0 2px #000';
ui.appendChild(debug);

engine.addUpdatable({
  update(dt: number) {
    player.update(dt);
    interactions.update(player.position, player.viewDir());
    if (input.justPressed('KeyE')) interactions.interact();
    const target = interactions.activeTarget;
    const label = target ? (typeof target.label === 'function' ? target.label() : target.label) : '-';
    debug.textContent =
      `pos ${player.position.x.toFixed(2)}, ${player.position.y.toFixed(2)}, ` +
      `${player.position.z.toFixed(2)} | ${player.mode}${player.sprinting ? ' sprint' : ''}` +
      ` | noise ${player.noiseLevel} | target: ${label} | A:${orbACount} B:${orbBCount}`;
    input.endStep();
  },
});

engine.start();
