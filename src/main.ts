import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Input } from './core/Input';
import { PlayerController } from './player/PlayerController';
import { InteractionSystem } from './player/Interaction';
import { Flashlight } from './player/Flashlight';
import { config } from './core/config';
import { house } from './world/houseLayout';
import { HouseBuilder } from './world/HouseBuilder';
import { initMaterials } from './world/materialLibrary';
import { worldToCell } from './world/layoutTypes';
import { HidingSystem } from './systems/HidingSpot';
import { PassageSystem } from './systems/SecretPassage';
import { ChargingStation } from './systems/ChargingStation';
import { ExitDoor, KeyProp } from './world/ExitDoor';
import { Battery } from './systems/Battery';
import { ChargingSystem } from './systems/Charging';
import { Jumpscare } from './enemies/Jumpscare';
import { NavGraph } from './ai/NavGraph';
import { Director } from './ai/Director';
import { NoiseBus, PlayerSnapshot, canSee } from './ai/Perception';
import { Rng } from './core/rng';
import { GameState } from './core/GameState';
import { Objectives } from './systems/Objectives';
import { MapOverlay } from './ui/MapOverlay';
import { HUD } from './ui/HUD';
import { Menus } from './ui/Menus';
import { AudioEngine } from './audio/AudioEngine';

// ---------------------------------------------------------------- bootstrap
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ui = document.getElementById('ui') as HTMLDivElement;
const engine = new Engine(canvas);
const input = new Input();
input.attach(canvas);

engine.scene.background = new THREE.Color(config.visibility.fogColor);
engine.scene.fog = new THREE.FogExp2(
  config.visibility.fogColor,
  config.visibility.fogDensityByFloor[1]
);
engine.renderer.toneMappingExposure = config.visibility.toneExposure;

// Wire renderer anisotropy into the PBR material library before any material builds.
initMaterials(engine.renderer);

const world = HouseBuilder.build(house);
engine.scene.add(world.group);

const ambientLight = new THREE.AmbientLight(
  config.visibility.ambientColor,
  config.visibility.ambientIntensityByFloor[1]
);
engine.scene.add(ambientLight);
const hemisphereLight = new THREE.HemisphereLight(
  0x303a52,
  0x14100c,
  config.visibility.hemisphereIntensityByFloor[1]
);
engine.scene.add(hemisphereLight);

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

hiding.isLightOn = () => flashlight.isOn;
hiding.forceLightOff = () => flashlight.setOn(false);
passages.isLightOn = () => flashlight.isOn;

const battery = new Battery();
const charging = new ChargingSystem(battery, player, input, () => flashlight.setOn(false));

// ------------------------------------------------------------------- AI
const rng = new Rng((Math.random() * 0xffffffff) >>> 0);
const nav = new NavGraph(house, world.solidCells);
const noiseBus = new NoiseBus();
const jumpscare = new Jumpscare();

const director = new Director(
  house,
  nav,
  rng,
  {
    hiding,
    onFoundHidden: (spot, enemy) => {
      // A closet is flung open as the stuffy finds you inside (a miss leaves it shut).
      if (spot.kind === 'closet') {
        const c = worldToCell(spot.position.x, spot.position.z);
        world.openCloset({ floor: world.floorIndexOfY(spot.position.y), x: c.x, z: c.z });
      }
      hiding.exit();
      noiseBus.emit({ position: spot.position, floor: player.floorIndex, radius: 8 });
      (enemy as { catchEnabled?: boolean }).catchEnabled = true;
    },
    onChaseLost: () => director.notifyNearMiss(),
  },
  engine.scene,
  (pos) => world.markerWorld(pos)
);
const enemies = director.residents.map((r) => r.enemy);
// Telegraph floor migrations with a distant stair-creak so the house's
// unpredictability reads as dread, not a glitch.
director.onMigrate = (r) => audio.migrationCue(r.enemy.position.clone());

function witnessSnapshot(at: THREE.Vector3): PlayerSnapshot {
  return {
    position: at,
    floor: player.floorIndex,
    lightOn: flashlight.isOn,
    crouched: player.isCrouched,
    noiseLevel: player.noiseLevel,
    hidden: false,
  };
}
hiding.onEnter = (spot) => {
  audio.hideRustle();
  for (const r of director.residents) {
    const witnessed = canSee(
      house,
      r.enemy.position,
      r.enemy.group.rotation.y,
      r.enemy.floorIndex,
      witnessSnapshot(spot.position)
    );
    r.brain.notePlayerEnteredHiding(spot.position, witnessed);
  }
};
hiding.onExit = (spot) => {
  audio.hideRustle();
  noiseBus.emit({ position: spot.position, floor: player.floorIndex, radius: 4 });
};
passages.onPlayerEnter = (passage) => {
  const tracked = passage as unknown as {
    vent?: { floor: number; cells: { x: number; z: number }[] };
    chute?: {
      from: { floor: number; x: number; z: number };
      to: { floor: number; x: number; z: number };
    };
  };
  let at: THREE.Vector3;
  let exit: THREE.Vector3;
  if (tracked.chute) {
    at = world.markerWorld(tracked.chute.from);
    exit = world.markerWorld(tracked.chute.to);
  } else if (tracked.vent) {
    const c = tracked.vent.cells[0];
    at = world.markerWorld({ floor: tracked.vent.floor, x: c.x, z: c.z });
    exit = at.clone();
  } else {
    return;
  }
  for (const r of director.residents) {
    const witnessed = canSee(
      house,
      r.enemy.position,
      r.enemy.group.rotation.y,
      r.enemy.floorIndex,
      witnessSnapshot(at)
    );
    r.brain.notePlayerEnteredPassage(at, exit, witnessed);
  }
};
passages.onOpen = () => {
  audio.grateCreak(player.position);
  noiseBus.emit({ position: player.position.clone(), floor: player.floorIndex, radius: 7 });
};
charging.onHumTick = (station) => {
  audio.chargeHum(station.position);
  noiseBus.emit({
    position: station.position.clone(),
    floor: station.cell.floor,
    radius: config.ai.hearChargingHum,
  });
};
noiseBus.subscribe((e) => {
  for (const r of director.residents) {
    if (r.enemy.floorIndex !== e.floor) continue;
    r.brain.hearNoise(e.position, e.radius);
  }
});

// -------------------------------------------------------- objectives + UI
const gs = new GameState();
const seed = (Math.random() * 0xffffffff) >>> 0;
const objectives = new Objectives(house, seed);
// Re-spawn the player at this run's seeded main-floor spawn point.
const spawnWorld = world.markerWorld(objectives.setup.playerSpawn);
player.teleport(spawnWorld.x, spawnWorld.y, spawnWorld.z, Math.PI);
const keyProp = new KeyProp();
engine.scene.add(keyProp.group);
const keyWorld = world.markerWorld(objectives.setup.keyLocation);
keyProp.showAt(keyWorld);
director.setKeyLocation(keyWorld);

const hud = new HUD(ui);
const menus = new Menus(ui);
const map = new MapOverlay(house, ui);
const audio = new AudioEngine();

interactions.add({
  position: keyWorld.clone().add(new THREE.Vector3(0, 0.5, 0)),
  radius: 1.9,
  label: 'Take the keys',
  enabled: () => !objectives.hasKey,
  onInteract: () => {
    objectives.takeKey();
    keyProp.hide();
    audio.keyJingle(player.position);
    hud.setHasKey(true);
    director.notifyKeyTaken();
  },
});

const exitDoors = house.exits.map((def) => {
  const door = new ExitDoor(def, house);
  door.tryOpen = () => {
    const result = objectives.tryExit(def.id);
    if (result === 'locked') audio.doorRattle(door.position);
    else if (result === 'wrongKey') audio.wrongKeyClunk(door.position);
    else audio.doorOpenWin();
    return result;
  };
  door.register(interactions);
  engine.scene.add(door.group);
  return door;
});

const stations = house.chargingStations.map((cell) => {
  const wp = world.markerWorld(cell);
  const grid = house.grids[cell.floor];
  // Charging stations must mount flush against an adjacent wall. The layout
  // guarantees every station cell abuts one (asserted in the layout tests); if
  // that invariant is ever broken, surface it loudly rather than floating the
  // unit in open space.
  let dir = new THREE.Vector3(0, 0, 0);
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
  if (dir.lengthSq() < 1e-6) {
    console.warn(
      `Charging station at ${cell.floor}:${cell.x},${cell.z} has no adjacent wall — check the layout.`
    );
  }
  const station = new ChargingStation(cell, wp, dir);
  station.onPlugIn = () => charging.plugIn(station);
  station.register(interactions);
  engine.scene.add(station.group);
  return station;
});

// ------------------------------------------------------ jumpscare + flow
// Red wash (suggests blood, no gore) underneath the black cut-to-dark.
const redFlash = document.createElement('div');
redFlash.style.cssText =
  'position:absolute;inset:0;background:radial-gradient(ellipse at center,#7a0000 0%,#3a0000 100%);opacity:0;pointer-events:none';
ui.appendChild(redFlash);
const blackout = document.createElement('div');
blackout.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;pointer-events:none';
ui.appendChild(blackout);
jumpscare.onRedFade = (a) => (redFlash.style.opacity = String(a * 0.85));
jumpscare.onBlackout = (a) => (blackout.style.opacity = String(a));
jumpscare.onSting = () => audio.sting();
jumpscare.onGameOver = (enemyId) => {
  gs.transition('gameOverShown');
  // The overlays sit above the menu root in the DOM; clear them so the
  // game-over screen (and its restart button) is visible and clickable. The
  // menu's own near-black background carries the darkness from here.
  redFlash.style.opacity = '0';
  blackout.style.opacity = '0';
  menus.showGameOver(enemyId);
  input.exitPointerLock();
};
for (const enemy of enemies) {
  enemy.onCatch = () => {
    if (!gs.transition('caught')) return;
    map.close();
    jumpscare.trigger(enemy, engine.camera);
  };
  enemy.onGaitBeat = (kind) => audio.gaitBeat(kind, enemy.position);
}

let runSeconds = 0;
objectives.onMessage = (text) => hud.showMessage(text);
objectives.onWin = () => {
  gs.transition('win');
  hud.show(false);
  window.setTimeout(() => {
    menus.showWin({ seconds: runSeconds, exitsTried: objectives.triedExits.size });
    input.exitPointerLock();
  }, 1400);
};

battery.onChange = (level) => hud.setBattery(level, battery.isLow);
battery.onLowWarning = () => hud.showMessage('The flashlight is dying…');
charging.onPlugChange = (on) => hud.setCharging(on);
interactions.onPromptChange = (label) => hud.setPrompt(label);

menus.onFirstInteraction = () => audio.unlock();
menus.onStart = () => {
  if (!gs.transition('start')) return;
  menus.hide();
  hud.show(true);
  hud.setBattery(battery.level, battery.isLow);
  hud.setStamina(player.stamina, player.staminaLocked);
  input.requestPointerLock();
};
menus.onResume = () => {
  if (!gs.transition('resume')) return;
  menus.hide();
  input.requestPointerLock();
};
menus.onRetry = () => window.location.reload(); // fresh seed, fresh house

// Browser Esc exits pointer lock — make it a clean pause instead of chaos.
input.onPointerLockLost = () => {
  if (gs.state === 'playing' || gs.state === 'mapOpen') {
    map.close();
    if (gs.transition('pause')) menus.showPause();
  }
};
canvas.addEventListener('click', () => {
  if (gs.state === 'playing' || gs.state === 'mapOpen') input.requestPointerLock();
});

menus.showTitle();

// ------------------------------------------------------------- main loop
let footstepDistance = 0;
const prevPos = new THREE.Vector3().copy(player.position);

engine.addUpdatable({
  update(dt: number) {
    if (!gs.simulationTicks) {
      input.endStep();
      return;
    }
    runSeconds += dt;

    // Movement/look gating from every source of truth.
    player.movementLocked =
      !gs.movementAllowed || hiding.active !== null || charging.isCharging || jumpscare.running;
    player.lookLocked = !gs.lookAllowed || jumpscare.running;

    player.update(dt);
    player.floorIndex = world.floorIndexOfY(player.position.y);
    const cell = worldToCell(player.position.x, player.position.z);
    const kind = house.grids[player.floorIndex]?.[cell.z]?.[cell.x];
    const hidingCrouch =
      hiding.active !== null && (hiding.active.kind === 'underBed' || hiding.active.kind === 'cabinet');
    player.forceCrouch = kind === 'vent' || hidingCrouch;

    passages.update(dt);
    interactions.update(player.position, player.viewDir());

    if (gs.state === 'playing') {
      if (input.justPressed('KeyE') && !charging.isCharging) {
        if (!hiding.exit()) interactions.interact();
      }
      if (input.justPressed('KeyF') && hiding.active === null && !charging.isCharging) {
        if (battery.canLight() || flashlight.isOn) flashlight.toggle();
      }
      if (input.justPressed('KeyM') || input.justPressed('Tab')) {
        if (gs.transition('openMap')) map.open();
      }
    } else if (gs.state === 'mapOpen') {
      if (input.justPressed('KeyM') || input.justPressed('Tab') || input.justPressed('KeyE')) {
        if (gs.transition('closeMap')) map.close();
      }
    }

    // Footsteps by distance walked.
    footstepDistance += player.position.distanceTo(prevPos);
    prevPos.copy(player.position);
    if (footstepDistance > 0.85) {
      footstepDistance = 0;
      audio.footstep(player.noiseLevel);
      // Movement noise reaches enemy ears via the snapshot radius check.
    }

    const fog = engine.scene.fog as THREE.FogExp2 | null;
    if (fog) fog.density = config.visibility.fogDensityByFloor[player.floorIndex];
    // Per-floor gloom: ease ambient/hemisphere toward this floor's target so
    // the basement reads markedly darker without popping on stairs.
    const fi = player.floorIndex;
    const ambTarget = config.visibility.ambientIntensityByFloor[fi];
    const hemTarget = config.visibility.hemisphereIntensityByFloor[fi];
    ambientLight.intensity += (ambTarget - ambientLight.intensity) * Math.min(1, 3 * dt);
    hemisphereLight.intensity += (hemTarget - hemisphereLight.intensity) * Math.min(1, 3 * dt);

    const catchable = hiding.active === null && !jumpscare.running;
    const snapshot: PlayerSnapshot = {
      position: player.position,
      floor: player.floorIndex,
      lightOn: flashlight.isOn,
      crouched: player.isCrouched,
      noiseLevel: player.noiseLevel,
      hidden: hiding.active !== null,
    };
    director.update(dt, player.floorIndex);
    let nearest = Infinity;
    let anyChasing = false;
    for (const r of director.residents) {
      r.brain.update(dt, snapshot);
      r.enemy.update(dt, player.position, catchable);
      if (r.enemy.floorIndex === player.floorIndex) {
        nearest = Math.min(nearest, r.enemy.position.distanceTo(player.position));
      }
      anyChasing ||= r.brain.state === 'chase';
    }
    jumpscare.update(dt, engine.camera);

    charging.update(dt);
    battery.update(dt, flashlight.isOn);
    flashlight.setLevel(battery.level);
    flashlight.setFlickering(battery.isLow && !battery.isEmpty);

    hud.setStamina(player.stamina, player.staminaLocked);
    hud.setThreat(jumpscare.running ? 0 : nearest);
    audio.setListener(player.position, player.yaw);
    audio.update(dt, nearest, anyChasing);

    if (map.visible) map.update(player.position.x, player.position.z, player.yaw, player.floorIndex);

    input.endStep();
  },
});

engine.onFrame = (dt) => {
  flashlight.update(dt, engine.camera);
  world.updateFixtures(dt);
  for (const s of stations) s.updateVisual(dt);
  keyProp.updateVisual(dt);
};

engine.start();

// ----------------------------------------------------------- dev harness
if (import.meta.env.DEV) {
  const params = new URLSearchParams(location.search);
  const anyDev = ['pose', 'warp', 'scare', 'report', 'showcase', 'scenario'].some((k) =>
    params.has(k)
  );
  if (anyDev && gs.state === 'menu') {
    gs.transition('start');
    menus.hide();
    hud.show(true);
  }
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
    const snap: PlayerSnapshot = {
      position: player.position,
      floor: player.floorIndex,
      lightOn: false,
      crouched: false,
      noiseLevel: 0,
      hidden: false,
    };
    for (let i = 0; i < warp * 60; i++) {
      director.update(1 / 60, player.floorIndex);
      for (const r of director.residents) {
        r.brain.update(1 / 60, snap);
        r.enemy.update(1 / 60, player.position, false);
      }
    }
  }
  if (pose) {
    player.update(1 / 60);
    flashlight.update(10, engine.camera);
  }
  if (params.get('scare')) {
    const which = enemies.find((e) => e.id === params.get('scare')) ?? enemies[3];
    player.update(1 / 60);
    jumpscare.trigger(which, engine.camera);
    const preroll = config.enemy.jumpscareTurn + config.enemy.jumpscareLunge * 0.55;
    for (let i = 0; i < Math.round(preroll * 60); i++) jumpscare.update(1 / 60, engine.camera);
    engine.simulationRunning = false;
  }
  if (params.get('map') === '1') {
    if (gs.transition('openMap')) {
      map.open();
      map.update(player.position.x, player.position.z, player.yaw, player.floorIndex);
    }
  }
  if (params.get('report') === '1') {
    document.title = JSON.stringify(
      director.residents.map((r) => ({
        id: r.enemy.id,
        s: r.brain.state,
        f: r.enemy.floorIndex,
        x: Math.round(r.enemy.position.x * 10) / 10,
        z: Math.round(r.enemy.position.z * 10) / 10,
      }))
    );
  }
  if (params.get('showcase') === '1') {
    engine.scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.5);
    keyLight.position.set(8, 10, 30);
    engine.scene.add(keyLight);
    engine.scene.fog = null;
  }
  if (params.get('scenario')) {
    // Deterministic end-to-end runs for ship verification (see the ship step).
    const step = (pressE = false) => {
      player.movementLocked =
        !gs.movementAllowed || hiding.active !== null || charging.isCharging || jumpscare.running;
      player.update(1 / 60);
      player.floorIndex = world.floorIndexOfY(player.position.y);
      passages.update(1 / 60);
      interactions.update(player.position, player.viewDir());
      if (pressE && !charging.isCharging) {
        if (!hiding.exit()) interactions.interact();
      }
      const snap: PlayerSnapshot = {
        position: player.position,
        floor: player.floorIndex,
        lightOn: flashlight.isOn,
        crouched: player.isCrouched,
        noiseLevel: player.noiseLevel,
        hidden: hiding.active !== null,
      };
      for (const r of director.residents) {
        r.brain.update(1 / 60, snap);
        r.enemy.update(1 / 60, player.position, hiding.active === null && !jumpscare.running);
      }
      jumpscare.update(1 / 60, engine.camera);
    };
    const goTo = (v: THREE.Vector3) => player.teleport(v.x, v.y, v.z, 0);
    const results: string[] = [];

    if (params.get('scenario') === 'win') {
      // 1. Grab the key (teleport-assisted; mechanics still real).
      goTo(keyWorld);
      step();
      step(true);
      results.push(`key:${objectives.hasKey}`);
      // 2. Try every exit until the right one opens.
      for (const door of exitDoors) {
        if (gs.state !== 'playing') break;
        goTo(door.position);
        step();
        step(true);
        results.push(`${door.def.id}:${objectives.triedExits.has(door.def.id) ? 'tried' : 'missed'}`);
      }
      results.push(`state:${gs.state}`, `escaped:${objectives.escaped}`);
    } else if (params.get('scenario') === 'death') {
      // Stand on Yama's nose until caught.
      const yama = director.residents.find((r) => r.enemy.id === 'newYama')!;
      yama.brain.passive = false;
      goTo(yama.enemy.position.clone().add(new THREE.Vector3(0.5, 0, 0)));
      for (let i = 0; i < 600 && gs.state !== 'gameOver'; i++) step();
      results.push(`state:${gs.state}`, `scare:${jumpscare.phase}`);
    }
    document.title = results.join(' ');
  }

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
    director,
    nav,
    noiseBus,
    gs,
    objectives,
    map,
    hud,
    menus,
    audio,
  };
}
