import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Engine } from './core/Engine';
import { Input } from './core/Input';
import { ControlManager, KeyboardMouseSource } from './core/Controls';
import { isMobile } from './core/Platform';
import { TouchControls } from './ui/TouchControls';
import { OrientationGate } from './ui/OrientationGate';
import { EnterVRButton } from './vr/EnterVRButton';
import { XRSession } from './vr/XRSession';
import { XRControllerSource } from './vr/XRControllerSource';
import { VRMessage } from './vr/VRMessage';
import { VRHud } from './vr/VRHud';
import { VRMap } from './vr/VRMap';
import { VRFade } from './vr/VRFade';
import { VRMenu, type VRMenuItem } from './vr/VRMenu';
import { PlayerController } from './player/PlayerController';
import { InteractionSystem } from './player/Interaction';
import { Flashlight } from './player/Flashlight';
import { config } from './core/config';
import { house } from './world/houseLayout';
import { HouseBuilder } from './world/HouseBuilder';
import { initMaterials } from './world/materialLibrary';
import { worldToCell, CELL_SIZE, floorY } from './world/layoutTypes';
import { HidingSystem } from './systems/HidingSpot';
import { PassageSystem } from './systems/SecretPassage';
import { WeatherSystem } from './systems/Weather';
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
import { Menus, ENEMY_NAMES } from './ui/Menus';
import { AudioEngine } from './audio/AudioEngine';
import { SettingsStore } from './core/Settings';
import { applyDifficulty, DIFFICULTY_META, DIFFICULTY_ORDER, type DifficultyLevel } from './core/difficulty';

// Apply the persisted difficulty into `config` BEFORE any system reads it — every
// importer shares the same config object, so this one in-place merge sets the
// whole run's knobs. An active ironman ladder dictates the level (its current
// rung); otherwise the player's last choice. Switching persists + reloads.
const settings = new SettingsStore();
// `let` so the VR menu can switch difficulty / ironman live (applyDifficulty is
// safe to re-apply; see difficulty.ts). Desktop still persists + reloads.
let ironmanOnBoot = settings.isIronmanActive();
let bootDifficulty = ironmanOnBoot
  ? settings.getIronman().currentLevel
  : settings.getLastDifficulty();
applyDifficulty(bootDifficulty);

/** Set the auto-start flag and reload into the (already-persisted) boot level. */
function reloadIntoRun(): void {
  try {
    sessionStorage.setItem('sf-autoplay', '1');
  } catch {
    // sessionStorage may be unavailable; the reload just lands on the title.
  }
  window.location.reload();
}

// ---------------------------------------------------------------- bootstrap
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ui = document.getElementById('ui') as HTMLDivElement;
const engine = new Engine(canvas);
const input = new Input();
input.attach(canvas);

// Source-agnostic control layer: keyboard/mouse is the first source; touch + XR
// register here on their platforms. Player + main loop read controls.intent.
const controls = new ControlManager();
controls.add(new KeyboardMouseSource(input));

// Mobile: register the touch source + the landscape gate. Desktop leaves both
// null and behaves exactly as before.
const mobile = isMobile();
const touch = mobile ? new TouchControls(ui) : null;
if (touch) controls.add(touch);
if (mobile) new OrientationGate(ui);

// VR: an Enter-VR button appears on the title when the device supports it.
const enterVR = new EnterVRButton(ui, engine.renderer);
let xrSession: XRSession | null = null;
let xrControls: XRControllerSource | null = null;
const vrMessage = new VRMessage();
const vrHud = new VRHud();
const vrFade = new VRFade();
const vrMenu = new VRMenu();
/** Which head-locked overlay is up (drives the controller poll in onFrame). */
let vrOverlay: 'none' | 'gameover' | 'win' | 'pause' = 'none';
// VR mirrors of DOM-only HUD state (prompt / toast / charging / threat / fades).
let vrPrompt: string | null = null;
let vrToast: string | null = null;
let vrToastUntil = 0;
let vrCharging = false;
let vrThreat = 0;
let vrRed = 0;
let vrBlack = 0;
engine.renderer.xr.addEventListener('sessionstart', () => {
  // Headset owns the camera + look; the body still moves from the left stick.
  player.lookLocked = true;
  player.cameraOwnedExternally = true;
  xrSession = new XRSession(engine, player);
  xrControls = new XRControllerSource(engine.renderer);
  controls.add(xrControls);
  vrHud.show(engine.camera);
  vrFade.show(engine.camera);
  // Show the in-headset main menu (choose difficulty / ironman) instead of
  // auto-starting, unless a run is already underway.
  if (gs.state === 'menu') openVRMenu();
});
engine.renderer.xr.addEventListener('sessionend', () => {
  player.lookLocked = false;
  player.cameraOwnedExternally = false;
  if (xrControls) controls.remove(xrControls);
  xrControls = null;
  xrSession?.dispose();
  xrSession = null;
  vrHud.hide();
  vrFade.hide();
  vrMap.hide();
  vrMessage.hide();
  vrMenu.hide();
  vrOverlay = 'none';
});

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

// Image-based lighting: a dim, abandoned-interior CC0 HDRI gives PBR surfaces
// realistic environment reflectance. Used for reflectance only — the visible
// background stays near-black and environmentIntensity is gated low, so the
// scene without the flashlight stays as dark as before.
engine.scene.environmentIntensity = config.visibility.environmentIntensity;
{
  const pmrem = new THREE.PMREMGenerator(engine.renderer);
  pmrem.compileEquirectangularShader();
  new RGBELoader().load(`${import.meta.env.BASE_URL}hdri/abandoned_games_room_01_1k.hdr`, (hdr) => {
    engine.scene.environment = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
    pmrem.dispose();
  });
}

const flashlight = new Flashlight(engine.scene);
const interactions = new InteractionSystem();
const player = new PlayerController(engine.camera, controls, world.colliders);
const spawn = world.markerWorld(house.playerSpawn);
player.teleport(spawn.x, spawn.y, spawn.z, Math.PI);

const hiding = new HidingSystem(
  player,
  interactions,
  house.hidingSpots.map((def) => ({ def, worldPos: world.markerWorld(def.pos) }))
);
const passages = new PassageSystem(house, world.colliders, player, interactions, world.group);
const weather = new WeatherSystem();

hiding.isLightOn = () => flashlight.isOn;
hiding.forceLightOff = () => flashlight.setOn(false);
passages.isLightOn = () => flashlight.isOn;

const battery = new Battery();
const charging = new ChargingSystem(
  battery,
  player,
  // Unplug on any movement or interact, from any input source (keyboard WASD,
  // touch joystick, or VR stick all feed the intent's move vector).
  () => {
    const i = controls.intent;
    return i.moveX !== 0 || i.moveY !== 0 || i.interact;
  },
  () => flashlight.setOn(false)
);

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
// Stair foot-placement sampler: a downward ray against the house finds the
// walking surface under each foot (floor or stair tread). Only legged stuffies
// (NewYama) query this, so the cost is a handful of rays per frame.
const _footRay = new THREE.Raycaster();
_footRay.far = 3.2;
const _footDown = new THREE.Vector3(0, -1, 0);
const _footOrigin = new THREE.Vector3();
const sampleFloorHeight = (x: number, z: number, floorIndex: number): number => {
  _footOrigin.set(x, floorY(floorIndex) + 1.4, z);
  _footRay.set(_footOrigin, _footDown);
  const hits = _footRay.intersectObject(world.group, true);
  return hits.length ? hits[0].point.y : floorY(floorIndex);
};
for (const enemy of enemies) enemy.floorHeightAt = sampleFloorHeight;
// Enemy bodies are the Meshy textured + rigged GLBs, built by EnemyBase.init();
// no flag, no procedural fallback.
// Telegraph floor migrations with a distant stair-creak so the house's
// unpredictability reads as dread, not a glitch.
director.onMigrate = (r) => audio.migrationCue(r.enemy.position.clone());

// True when a prop/cover cell sits within cover range of the player — used to
// reward crouching behind furniture (a lightweight detection penalty, not a raycast).
function playerNearCover(): boolean {
  const r = Math.max(1, Math.ceil(config.ai.coverBonusRadius / CELL_SIZE));
  const c = worldToCell(player.position.x, player.position.z);
  const f = player.floorIndex;
  for (let dz = -r; dz <= r; dz++) {
    for (let dx = -r; dx <= r; dx++) {
      if (world.solidCells.has(`${f}:${c.x + dx},${c.z + dz}`)) return true;
    }
  }
  return false;
}

function witnessSnapshot(at: THREE.Vector3): PlayerSnapshot {
  return {
    position: at,
    floor: player.floorIndex,
    lightOn: flashlight.isOn,
    crouched: player.isCrouched,
    noiseLevel: player.noiseLevel,
    hidden: false,
    nearCover: false,
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
// Fair start: no enemy in the player's room or walking toward them.
director.seedSafeSpawns(spawnWorld, objectives.setup.playerSpawn, objectives.setup.playerSpawn.floor);
const keyProp = new KeyProp();
engine.scene.add(keyProp.group);
let keyWorld = world.markerWorld(objectives.setup.keyLocation);
// Live position object the key interactable reads each step — updated in place
// when the run re-rolls (the keys move) so the prompt follows the new location.
const keyInteractPos = keyWorld.clone().add(new THREE.Vector3(0, 0.5, 0));
keyProp.showAt(keyWorld);
director.setKeyLocation(keyWorld);

const hud = new HUD(ui);
const menus = new Menus(ui);
const map = new MapOverlay(house, ui);
const vrMap = new VRMap(map.mapCanvas);
const audio = new AudioEngine();
// Thunder follows each lightning flash after a realistic delay.
weather.onLightning = () => {
  const a = config.audio;
  const delay = a.thunderDelayMin + Math.random() * (a.thunderDelayMax - a.thunderDelayMin);
  window.setTimeout(() => audio.thunder(), delay * 1000);
};

interactions.add({
  position: keyInteractPos,
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
jumpscare.onRedFade = (a) => {
  redFlash.style.opacity = String(a * 0.85);
  vrRed = a;
};
jumpscare.onBlackout = (a) => {
  blackout.style.opacity = String(a);
  vrBlack = a;
};
jumpscare.onSting = () => audio.sting();
jumpscare.onGameOver = (enemyId) => {
  gs.transition('gameOverShown');
  // The overlays sit above the menu root in the DOM; clear them so the
  // game-over screen (and its restart button) is visible and clickable. The
  // menu's own near-black background carries the darkness from here.
  redFlash.style.opacity = '0';
  blackout.style.opacity = '0';
  vrRed = vrBlack = vrThreat = 0; // clear the VR fade so the panel is unobstructed
  settings.recordRun({ difficulty: bootDifficulty, won: false });
  // A death anywhere in an ironman ladder resets it to Easy.
  if (ironmanOnBoot) settings.failIronman();
  menus.showGameOver(enemyId, ironmanOnBoot);
  touch?.hide();
  if (xrSession) {
    const name = ENEMY_NAMES[enemyId] ?? 'SOMETHING SOFT';
    vrMessage.show(
      engine.camera,
      `${name} GOT YOU`,
      'Squeezed in a very firm hug\nuntil everything went dark.',
      '#c0392b',
      'Pull the right trigger to try again'
    );
    vrOverlay = 'gameover';
  }
  input.exitPointerLock();
};
for (const enemy of enemies) {
  enemy.onCatch = () => {
    if (!gs.transition('caught')) return false; // already caught/jumpscaring — don't disable this enemy
    map.close();
    jumpscare.trigger(enemy, engine.camera);
    return true;
  };
  enemy.onGaitBeat = (kind) => audio.gaitBeat(kind, enemy.position);
}

let runSeconds = 0;
objectives.onMessage = (text) => {
  hud.showMessage(text);
  vrToast = text;
  vrToastUntil = performance.now() + 3600;
};
objectives.onWin = () => {
  gs.transition('win');
  hud.show(false);
  settings.recordRun({ difficulty: bootDifficulty, won: true });
  // Ironman: a non-final win offers Continue (the rung advances on the click);
  // winning the last rung completes the ladder right here.
  let ironman: 'complete' | { rung: number; total: number; nextName: string } | null = null;
  if (ironmanOnBoot) {
    const idx = DIFFICULTY_ORDER.indexOf(bootDifficulty);
    if (idx >= DIFFICULTY_ORDER.length - 1) {
      settings.advanceIronman(); // completes + records the full-ladder streak
      ironman = 'complete';
    } else {
      ironman = {
        rung: settings.ironmanRung(),
        total: DIFFICULTY_ORDER.length,
        nextName: DIFFICULTY_META[DIFFICULTY_ORDER[idx + 1]].name,
      };
    }
  }
  window.setTimeout(() => {
    menus.showWin({ seconds: runSeconds, exitsTried: objectives.triedExits.size }, ironman);
    touch?.hide();
    if (xrSession) {
      const mins = Math.floor(runSeconds / 60);
      const secs = Math.round(runSeconds % 60);
      vrMessage.show(
        engine.camera,
        'YOU ESCAPED!',
        `Out the front door, keys jingling.\nTime: ${mins}m ${secs}s`,
        '#7fbf6a',
        'Pull the right trigger to play again'
      );
      vrOverlay = 'win';
    }
    input.exitPointerLock();
  }, 1400);
};

battery.onChange = (level) => hud.setBattery(level, battery.isLow);
battery.onLowWarning = () => hud.showMessage('The flashlight is dying…');
charging.onPlugChange = (on) => {
  hud.setCharging(on);
  vrCharging = on;
};
interactions.onPromptChange = (label) => {
  hud.setPrompt(label);
  vrPrompt = label;
};

menus.onFirstInteraction = () => audio.resumeIfSuspended();
// Resume audio on the first real input regardless of start path — covers drop-ins
// that begin a run without a menu click (e.g. the difficulty-change autoplay reload),
// where the menu's first-interaction click never fires. resumeIfSuspended is a no-op
// once the context is running, so leaving these attached is cheap + also recovers from
// the browser auto-suspending a backgrounded tab.
const resumeAudio = () => audio.resumeIfSuspended();
window.addEventListener('pointerdown', resumeAudio, { capture: true });
window.addEventListener('keydown', resumeAudio, { capture: true });

/** Show the in-run chrome + acquire input. Shared by start and play-again. */
function enterPlayingChrome(): void {
  menus.hide();
  vrMessage.hide();
  vrMenu.hide();
  vrOverlay = 'none';
  hud.show(true);
  hud.setBattery(battery.level, battery.isLow);
  hud.setStamina(player.stamina, player.staminaLocked);
  const m = DIFFICULTY_META[bootDifficulty];
  hud.setDifficultyInfo(
    m.name,
    m.tier,
    ironmanOnBoot ? `Ironman ${settings.ironmanRung()}/${DIFFICULTY_ORDER.length}` : null
  );
  enterVR.hide();
  if (mobile) {
    goFullscreenMobile();
    touch?.show();
  } else if (!engine.renderer.xr.isPresenting) {
    input.requestPointerLock();
  }
}

function startRun(): void {
  if (!gs.transition('start')) return;
  enterPlayingChrome();
}

/**
 * Reset the world for a fresh run WITHOUT reloading the page — the keys move,
 * the player + enemies + battery reset, AI memory clears. Lets VR replay in
 * place instead of a reload that would end the XR session.
 */
function startNewRun(): void {
  const newSeed = (Math.random() * 0xffffffff) >>> 0;
  objectives.reroll(newSeed);
  const sp = world.markerWorld(objectives.setup.playerSpawn);
  player.teleport(sp.x, sp.y, sp.z, Math.PI);
  player.resetState();
  keyWorld = world.markerWorld(objectives.setup.keyLocation);
  keyInteractPos.copy(keyWorld);
  keyInteractPos.y += 0.5;
  keyProp.showAt(keyWorld);
  director.setKeyLocation(keyWorld);
  director.restart(sp, objectives.setup.playerSpawn, objectives.setup.playerSpawn.floor);
  battery.reset();
  flashlight.setOn(false);
  hiding.exit();
  charging.unplug();
  jumpscare.reset();
  map.close();
  runSeconds = 0;
  hud.setHasKey(false);
  hud.setPrompt(null);
  hud.setCharging(false);
  vrPrompt = null;
  vrToast = null;
  vrCharging = false;
  vrThreat = vrRed = vrBlack = 0;
}

/** In-place "play again" from game-over / win (keeps the VR session alive). */
function playAgain(): void {
  // An ironman run always ends before this fires — a death resets the ladder,
  // a full clear completes it (both leave the saved ladder inactive at Easy).
  // "Play again" should therefore start a brand-new ladder from Tuck-In, not a
  // single-difficulty run at whatever level the ladder ended on. Re-arm the
  // ladder + re-apply Easy so the refreshed HUD/config match the new run.
  if (ironmanOnBoot) {
    settings.startIronman();
    bootDifficulty = settings.getIronman().currentLevel;
    applyDifficulty(bootDifficulty);
  }
  startNewRun();
  if (!gs.transition('retry')) return;
  enterPlayingChrome();
}

/** Launch a fresh run in place from the VR menu (handles menu or post-death). */
function launchRun(): void {
  startNewRun();
  const event = gs.state === 'menu' ? 'start' : 'retry';
  if (!gs.transition(event)) return;
  enterPlayingChrome();
}

/**
 * Quit the current run back to the main menu — from the pause menu, the
 * game-over screen, or the win screen. Stages a fresh world (so the next PLAY
 * starts clean; the sim is frozen at the menu), drops the in-run chrome, and
 * shows the title (desktop / mobile) or the in-headset menu (VR).
 */
function quitToMenu(): void {
  if (!gs.transition('toMenu')) return;
  startNewRun();
  hud.show(false);
  touch?.hide();
  map.close();
  menus.hide();
  vrMessage.hide();
  if (engine.renderer.xr.isPresenting) {
    openVRMenu();
  } else {
    input.exitPointerLock();
    menus.showTitle();
  }
}

/** In-headset pause menu: resume the run, or quit back to the main menu. */
function openVRPauseMenu(): void {
  vrMessage.hide();
  vrOverlay = 'pause';
  vrMenu.show(engine.camera, 'PAUSED', [
    {
      label: 'RESUME',
      onSelect: () => {
        if (!gs.transition('resume')) return;
        vrMenu.hide();
        vrOverlay = 'none';
      },
    },
    { label: 'MAIN MENU', onSelect: () => quitToMenu() },
  ]);
}

/** Switch difficulty live (config re-applies cleanly) and refresh HUD/menu label. */
function setVRDifficulty(level: DifficultyLevel): void {
  if (ironmanOnBoot) settings.abandonIronman();
  ironmanOnBoot = false;
  bootDifficulty = level;
  applyDifficulty(level);
  settings.setLastDifficulty(level);
}

/** Build + show the in-headset main menu. */
function openVRMenu(): void {
  const items: VRMenuItem[] = [
    { label: `PLAY — ${DIFFICULTY_META[bootDifficulty].name}`, onSelect: () => launchRun() },
    ...DIFFICULTY_ORDER.map((lvl) => ({
      label: DIFFICULTY_META[lvl].name,
      onSelect: () => {
        setVRDifficulty(lvl);
        launchRun();
      },
    })),
    {
      label: 'IRONMAN',
      onSelect: () => {
        settings.startIronman();
        ironmanOnBoot = true;
        bootDifficulty = settings.getIronman().currentLevel;
        applyDifficulty(bootDifficulty);
        launchRun();
      },
    },
  ];
  vrMessage.hide();
  vrOverlay = 'none';
  vrMenu.show(engine.camera, 'STUFFY FRIGHTS', items);
}

/**
 * On a phone, take over the screen so the browser address bar + system bars get
 * out of the way, and pin to landscape. Both are best-effort (must run inside a
 * user gesture; orientation lock needs fullscreen first) — failures are benign.
 */
function goFullscreenMobile(): void {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
  };
  if (document.fullscreenElement) return;
  const req = el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el);
  if (!req) return;
  Promise.resolve(req())
    .then(() => {
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (o: string) => Promise<void>;
      };
      return orientation.lock?.('landscape');
    })
    .catch(() => {
      /* declined / unsupported — the manifest covers the installed-PWA case */
    });
}

menus.setCurrentDifficulty(bootDifficulty);
menus.onStart = startRun;
// Picking a specific level plays a NORMAL run: leave any active ladder, then
// start straight away if it's the applied level, else persist + reload into it.
menus.onSelectDifficulty = (level) => {
  if (ironmanOnBoot) settings.abandonIronman();
  if (level === bootDifficulty && !ironmanOnBoot) {
    startRun();
  } else {
    settings.setLastDifficulty(level);
    reloadIntoRun();
  }
};
// Ironman: start the ladder at Easy (reload applies it), or advance a rung.
menus.onStartIronman = () => {
  settings.startIronman();
  reloadIntoRun();
};
menus.onContinueIronman = () => {
  settings.advanceIronman();
  reloadIntoRun();
};
menus.onShowStats = () => menus.showStats(settings.statsSummary());
menus.onResume = () => {
  if (!gs.transition('resume')) return;
  menus.hide();
  if (mobile) touch?.show();
  else if (!engine.renderer.xr.isPresenting) input.requestPointerLock();
};
menus.onRetry = playAgain; // in-place restart (no reload) — fresh seed, keys move
menus.onQuitToMenu = quitToMenu;

// Browser Esc exits pointer lock — make it a clean pause instead of chaos.
input.onPointerLockLost = () => {
  if (gs.state === 'playing' || gs.state === 'mapOpen') {
    map.close();
    if (gs.transition('pause')) menus.showPause();
  }
};
canvas.addEventListener('click', () => {
  if (!mobile && (gs.state === 'playing' || gs.state === 'mapOpen')) input.requestPointerLock();
});

// After a difficulty-change reload, skip the title and drop straight into the run.
let autoplay = false;
try {
  autoplay = sessionStorage.getItem('sf-autoplay') === '1';
  if (autoplay) sessionStorage.removeItem('sf-autoplay');
} catch {
  autoplay = false;
}
if (autoplay) startRun();
else menus.showTitle();

// ------------------------------------------------------------- main loop
let footstepDistance = 0;
const prevPos = new THREE.Vector3().copy(player.position);

engine.addUpdatable({
  update(dt: number) {
    if (!gs.simulationTicks) {
      input.endStep();
      controls.endStep();
      return;
    }
    runSeconds += dt;

    // Movement/look gating from every source of truth.
    player.movementLocked =
      !gs.movementAllowed || hiding.active !== null || charging.isCharging || jumpscare.running;
    player.lookLocked = !gs.lookAllowed || jumpscare.running;

    controls.sample();
    const intent = controls.intent;
    player.update(dt);
    player.floorIndex = world.floorIndexOfY(player.position.y);
    const cell = worldToCell(player.position.x, player.position.z);
    const kind = house.grids[player.floorIndex]?.[cell.z]?.[cell.x];
    const hidingCrouch =
      hiding.active !== null && (hiding.active.kind === 'underBed' || hiding.active.kind === 'cabinet');
    player.forceCrouch = kind === 'vent' || hidingCrouch;

    passages.update(dt);
    weather.update(dt);
    interactions.update(player.position, player.viewDir());

    if (gs.state === 'playing') {
      if (intent.interact && !charging.isCharging) {
        if (!hiding.exit()) interactions.interact();
      }
      if (intent.flashlightToggle && hiding.active === null && !charging.isCharging) {
        if (battery.canLight() || flashlight.isOn) flashlight.toggle();
      }
      if (intent.mapToggle) {
        if (gs.transition('openMap')) map.open();
      }
    } else if (gs.state === 'mapOpen') {
      if (intent.mapToggle || intent.interact) {
        if (gs.transition('closeMap')) map.close();
      }
    }
    // Pause button (touch pause / VR A — neither has Esc + pointer-lock loss).
    if (intent.pause && (gs.state === 'playing' || gs.state === 'mapOpen')) {
      map.close();
      if (gs.transition('pause')) {
        menus.showPause();
        touch?.hide();
        if (xrSession) openVRPauseMenu();
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
      nearCover: player.isCrouched ? playerNearCover() : false,
    };
    director.update(dt, player.floorIndex);
    let nearest = Infinity;
    let anyChasing = false;
    for (const r of director.residents) {
      r.brain.update(dt, snapshot);
      // Procedural gaze: aware stuffies turn their head to track the player
      // (and look down when the player is crouched/hidden low). Unaware =
      // neutral, so a patrolling stuffy doesn't creepily stare.
      const gaze = r.brain.state === 'chase' ? 1 : r.brain.state === 'investigate' ? 0.6 : 0;
      r.enemy.setLookContext(gaze > 0 ? player.position : null, gaze);
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
    vrThreat = jumpscare.running ? 0 : Math.max(0, Math.min(1, 1 - nearest / 10));
    audio.setListener(player.position, player.yaw);
    let nearestWindow = Infinity;
    for (const wp of world.windowWorldPositions) {
      nearestWindow = Math.min(nearestWindow, wp.distanceTo(player.position));
    }
    audio.update(dt, nearest, anyChasing, nearestWindow);

    if (map.visible) map.update(player.position.x, player.position.z, player.yaw, player.floorIndex);

    input.endStep();
    controls.endStep();
  },
});

engine.onFrame = (dt) => {
  if (xrSession) {
    if (xrControls) xrSession.applyTurn(xrControls.takeSnapTurn());
    xrSession.sync();
    flashlight.update(dt, engine.camera, xrControls?.rightControllerPose() ?? undefined);
    vrHud.update({
      stamina: player.stamina,
      staminaLocked: player.staminaLocked,
      battery: battery.level,
      batteryLow: battery.isLow,
      prompt: vrPrompt,
      message: performance.now() < vrToastUntil ? vrToast : null,
      charging: vrCharging,
    });
    vrFade.update(vrThreat, vrRed, vrBlack);
    // Mirror the live map onto a head-locked panel while it's open.
    if (map.visible) {
      vrMap.show(engine.camera);
      vrMap.update();
    } else {
      vrMap.hide();
    }
    // Head-locked overlay (game-over / win / paused). The sim is frozen on these
    // screens, so poll the controller here (onFrame always runs). Trigger resumes
    // a pause; on game-over / win it reloads to the title (a reload ends the XR
    // session anyway) where the headset browser re-enters VR with one tap.
    if (vrMessage.visible && (vrOverlay === 'gameover' || vrOverlay === 'win')) {
      // Game-over / win panel → trigger returns to the in-headset main menu
      // (stays in VR). Pause now uses the VR menu (handled below), not this panel.
      xrControls?.sample();
      if (xrControls?.intent?.interact) openVRMenu();
    } else if (vrMenu.visible) {
      xrControls?.sample();
      const i = xrControls?.intent;
      if (i) {
        const nav = xrControls?.takeMenuNav() ?? 0;
        if (nav !== 0) vrMenu.move(nav);
        if (i.interact) vrMenu.select();
      }
    }
  } else {
    flashlight.update(dt, engine.camera);
  }
  world.updateFixtures(dt);
  world.updateWindows(dt, weather.flash);
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
    weather,
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
