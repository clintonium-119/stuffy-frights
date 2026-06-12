import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Input } from './core/Input';
import { PlayerController } from './player/PlayerController';
import { InteractionSystem } from './player/Interaction';
import { Flashlight } from './player/Flashlight';
import { config } from './core/config';
import { house } from './world/houseLayout';
import { HouseBuilder } from './world/HouseBuilder';
import { worldToCell } from './world/layoutTypes';
import { HidingSystem } from './systems/HidingSpot';
import { PassageSystem } from './systems/SecretPassage';
import { ChargingStation } from './systems/ChargingStation';
import { ExitDoor, KeyProp } from './world/ExitDoor';
import { Battery } from './systems/Battery';
import { ChargingSystem } from './systems/Charging';
import { Charles } from './enemies/Charles';
import { Poo } from './enemies/Poo';
import { NewYama } from './enemies/NewYama';
import { Fuggie } from './enemies/Fuggie';
import { Jumpscare } from './enemies/Jumpscare';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new Engine(canvas);
const input = new Input();
input.attach(canvas);
canvas.addEventListener('click', () => input.requestPointerLock());

engine.scene.background = new THREE.Color(config.visibility.fogColor);
engine.scene.fog = new THREE.FogExp2(
  config.visibility.fogColor,
  config.visibility.fogDensityByFloor[1]
);
engine.renderer.toneMappingExposure = config.visibility.toneExposure;

const world = HouseBuilder.build(house);
engine.scene.add(world.group);

// The gloom: never pitch black, never comfortable.
engine.scene.add(
  new THREE.AmbientLight(config.visibility.ambientColor, config.visibility.ambientIntensity)
);
engine.scene.add(
  new THREE.HemisphereLight(0x303a52, 0x14100c, config.visibility.hemisphereIntensity)
);

const flashlight = new Flashlight(engine.scene);

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

// Concealment systems read and force the light state.
hiding.isLightOn = () => flashlight.isOn;
hiding.forceLightOff = () => flashlight.setOn(false);
passages.isLightOn = () => flashlight.isOn;

// Battery economy + vulnerable charging.
const battery = new Battery();
const charging = new ChargingSystem(battery, player, input, () => flashlight.setOn(false));

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
  station.onPlugIn = () => charging.plugIn(station);
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

// TEMP enemy showcase for visual verification — replaced by Director
// spawning in the AI phase. Lined up in the living room.
const enemies = [new Charles(), new Poo(), new NewYama(), new Fuggie()];
enemies.forEach((enemy, i) => {
  enemy.position.set(2.6 + i * 2.2, 3.5, 23.5); // living room line-up
  enemy.group.rotation.y = 0; // model fronts are +Z — face the camera spot south
  engine.scene.add(enemy.group);
});

// The catch → jumpscare → game over chain. Blackout overlay + debug
// restart until the real game-state machine lands.
const jumpscare = new Jumpscare();
const blackout = document.createElement('div');
blackout.style.cssText =
  'position:absolute;inset:0;background:#000;opacity:0;pointer-events:none';
(document.getElementById('ui') as HTMLDivElement).appendChild(blackout);
jumpscare.onBlackout = (a) => (blackout.style.opacity = String(a));
jumpscare.onGameOver = (enemyId) => {
  // Debug flow: brief hold, then respawn a fresh attempt.
  console.warn(`GAME OVER — caught by ${enemyId} (debug respawn)`);
  setTimeout(() => {
    jumpscare.reset();
    const sp = world.markerWorld(house.playerSpawn);
    player.teleport(sp.x, sp.y, sp.z, Math.PI);
    player.movementLocked = false;
    player.lookLocked = false;
    for (const enemy of enemies) enemy.catchEnabled = true;
  }, 800);
};
for (const enemy of enemies) {
  enemy.onCatch = () => {
    if (!jumpscare.trigger(enemy, engine.camera)) return;
    player.movementLocked = true;
    player.lookLocked = true;
  };
}

// Dev screenshot poses: ?pose=x,y,z,yaw,pitch&light=1&mood=menacing&warp=8
// lets headless-Chrome captures frame any view (guarded; dev only).
if (import.meta.env.DEV) {
  const params = new URLSearchParams(location.search);
  const pose = params.get('pose');
  if (pose) {
    const [px, py, pz, yaw = '0', pitch = '0'] = pose.split(',');
    player.teleport(Number(px), Number(py), Number(pz), Number(yaw));
    player.pitch = Number(pitch);
  }
  if (params.get('light') === '1') flashlight.setOn(true);
  if (params.get('mood') === 'menacing') {
    for (const enemy of enemies) enemy.isChasing = true;
  }
  const warp = Number(params.get('warp') ?? '0');
  if (warp > 0) {
    // Pre-roll the simulation so gaits/moods settle before the screenshot.
    for (let i = 0; i < warp * 60; i++) {
      for (const enemy of enemies) enemy.update(1 / 60, player.position, false);
    }
  }
  if (pose) {
    // Settle the camera + beam immediately (no lag frames in headless).
    player.update(1 / 60);
    flashlight.update(10, engine.camera);
  }
  if (params.get('scare')) {
    // Freeze a deterministic mid-lunge frame for screenshot review.
    const which = enemies.find((e) => e.id === params.get('scare')) ?? enemies[3];
    player.update(1 / 60);
    jumpscare.trigger(which, engine.camera);
    const preroll = config.enemy.jumpscareTurn + config.enemy.jumpscareLunge * 0.55;
    for (let i = 0; i < Math.round(preroll * 60); i++) {
      jumpscare.update(1 / 60, engine.camera);
    }
    engine.simulationRunning = false;
  }
  if (params.get('showcase') === '1') {
    // Bright neutral light for model-likeness review only.
    engine.scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.5);
    keyLight.position.set(8, 10, 30);
    engine.scene.add(keyLight);
    engine.scene.fog = null;
  }
}

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
    flashlight,
    battery,
    charging,
    enemies,
    jumpscare,
  };
}

// Debug overlay (removed when the real HUD lands)
const ui = document.getElementById('ui') as HTMLDivElement;
const debug = document.createElement('div');
debug.style.cssText =
  'position:absolute;top:8px;left:8px;color:#8f8;font:12px monospace;text-shadow:0 0 2px #000';
ui.appendChild(debug);

// Functional battery bar (restyled by the real HUD phase).
const batteryWrap = document.createElement('div');
batteryWrap.style.cssText =
  'position:absolute;bottom:18px;left:18px;width:140px;height:12px;border:1px solid #555;background:#111a';
const batteryBar = document.createElement('div');
batteryBar.style.cssText = 'height:100%;width:100%;background:#7a6;transition:background .3s';
batteryWrap.appendChild(batteryBar);
ui.appendChild(batteryWrap);

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
    if (input.justPressed('KeyE') && !charging.isCharging) {
      // Hidden players exit first; otherwise normal interaction.
      // (While charging, E is consumed by the unplug in charging.update.)
      if (!hiding.exit()) interactions.interact();
    }
    if (input.justPressed('KeyF') && hiding.active === null && !charging.isCharging) {
      if (battery.canLight() || flashlight.isOn) flashlight.toggle();
    }
    const catchable = hiding.active === null && !jumpscare.running;
    for (const enemy of enemies) enemy.update(dt, player.position, catchable);
    jumpscare.update(dt, engine.camera);
    charging.update(dt);
    battery.update(dt, flashlight.isOn);
    flashlight.setLevel(battery.level);
    flashlight.setFlickering(battery.isLow && !battery.isEmpty);
    batteryBar.style.width = `${(battery.level * 100).toFixed(1)}%`;
    batteryBar.style.background = battery.isLow ? '#c33' : '#7a6';

    // Fog tracks the player's floor (basement/attic are thicker).
    const fog = engine.scene.fog as THREE.FogExp2 | null;
    if (fog) fog.density = config.visibility.fogDensityByFloor[player.floorIndex];

    flashlight.update(dt, engine.camera);
    world.updateFixtures(dt);
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
