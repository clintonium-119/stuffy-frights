import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Input } from './core/Input';
import { PlayerController } from './player/PlayerController';
import { InteractionSystem } from './player/Interaction';
import { house } from './world/houseLayout';
import { HouseBuilder } from './world/HouseBuilder';
import { worldToCell } from './world/layoutTypes';
import { HidingSystem } from './systems/HidingSpot';
import { PassageSystem } from './systems/SecretPassage';
import { ChargingStation } from './systems/ChargingStation';
import { ExitDoor, KeyProp } from './world/ExitDoor';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new Engine(canvas);
const input = new Input();
input.attach(canvas);
canvas.addEventListener('click', () => input.requestPointerLock());

engine.scene.background = new THREE.Color(0x07070c);

const world = HouseBuilder.build(house);
engine.scene.add(world.group);

// Inspection lighting — replaced by the darkness model in the survival phase.
engine.scene.add(new THREE.AmbientLight(0x8888aa, 1.6));
const inspect = new THREE.PointLight(0xffeedd, 50, 30);
engine.scene.add(inspect);

const interactions = new InteractionSystem();
const player = new PlayerController(engine.camera, input, world.colliders);
const spawn = world.markerWorld(house.playerSpawn);
player.teleport(spawn.x, spawn.y, spawn.z, Math.PI);

const hiding = new HidingSystem(
  player,
  interactions,
  house.hidingSpots.map((def) => ({ def, worldPos: world.markerWorld(def.pos) }))
);
const passages = new PassageSystem(house, world.colliders, player, interactions, world.group);

// Charging stations (shells — behavior lands with the battery system).
const stations = house.chargingStations.map((cell) => {
  const wp = world.markerWorld(cell);
  // Mount direction: toward the nearest adjacent wall cell.
  const grid = house.grids[cell.floor];
  let dir = new THREE.Vector3(0, 0, 1);
  for (const [dx, dz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const) {
    if (grid[cell.z + dz]?.[cell.x + dx] === 'wall') {
      dir = new THREE.Vector3(dx, 0, dz);
      break;
    }
  }
  const station = new ChargingStation(cell, wp, dir);
  station.register(interactions);
  engine.scene.add(station.group);
  return station;
});

// Exit doors (lock logic lands with objectives).
const exitDoors = house.exits.map((def) => {
  const door = new ExitDoor(def, house);
  door.register(interactions);
  engine.scene.add(door.group);
  return door;
});

// Key prop (shown by objectives; debug force-show via __game).
const keyProp = new KeyProp();
engine.scene.add(keyProp.group);

// Dev handle for scripted verification (guarded; not part of gameplay).
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__game = {
    player,
    engine,
    house,
    world,
    hiding,
    passages,
    interactions,
    input,
    stations,
    exitDoors,
    keyProp,
  };
}

// Debug overlay (removed when the real HUD lands)
const ui = document.getElementById('ui') as HTMLDivElement;
const debug = document.createElement('div');
debug.style.cssText =
  'position:absolute;top:8px;left:8px;color:#8f8;font:12px monospace;text-shadow:0 0 2px #000';
ui.appendChild(debug);

engine.addUpdatable({
  update(dt: number) {
    player.update(dt);

    // World queries: current floor + forced crouch inside vent bores
    // (hiding poses also force the crouch).
    player.floorIndex = world.floorIndexOfY(player.position.y);
    const cell = worldToCell(player.position.x, player.position.z);
    const kind = house.grids[player.floorIndex]?.[cell.z]?.[cell.x];
    const hidingCrouch =
      hiding.active !== null && (hiding.active.kind === 'underBed' || hiding.active.kind === 'cabinet');
    player.forceCrouch = kind === 'vent' || hidingCrouch;

    passages.update();
    interactions.update(player.position, player.viewDir());
    if (input.justPressed('KeyE')) {
      // Hidden players exit first; otherwise normal interaction.
      if (!hiding.exit()) interactions.interact();
    }

    inspect.position.set(player.position.x, player.position.y + 2.2, player.position.z);
    for (const s of stations) s.updateVisual(dt);
    keyProp.updateVisual(dt);

    debug.textContent =
      `floor ${player.floorIndex} cell ${cell.x},${cell.z} | ` +
      `pos ${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)}, ` +
      `${player.position.z.toFixed(1)} | ${player.isCrouched ? 'crouched' : 'standing'}` +
      `${player.sprinting ? ' sprint' : ''}`;
    input.endStep();
  },
});

engine.start();
