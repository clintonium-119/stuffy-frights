import * as THREE from 'three';
import { config } from './config';

export interface Updatable {
  update(dt: number): void;
}

/**
 * Owns renderer/scene/camera and the loop: fixed-timestep simulation
 * (accumulator with substep clamp) decoupled from per-frame rendering.
 */
export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  private updatables: Updatable[] = [];
  private accumulator = 0;
  private lastTime: number | null = null;
  /** Gate: when false, simulation is frozen but rendering continues (pause). */
  simulationRunning = true;
  /** Optional per-frame hook (HUD vignette etc.) that runs even when paused. */
  onFrame: ((dt: number) => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.05,
      80
    );

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  addUpdatable(u: Updatable): void {
    this.updatables.push(u);
  }

  removeUpdatable(u: Updatable): void {
    const i = this.updatables.indexOf(u);
    if (i >= 0) this.updatables.splice(i, 1);
  }

  start(): void {
    this.renderer.setAnimationLoop((timeMs) => this.frame(timeMs / 1000));
  }

  private frame(time: number): void {
    if (this.lastTime === null) this.lastTime = time;
    const frameDt = Math.min(time - this.lastTime, config.timestep * config.maxSubsteps);
    this.lastTime = time;

    if (this.simulationRunning) {
      this.accumulator += frameDt;
      while (this.accumulator >= config.timestep) {
        for (const u of this.updatables) u.update(config.timestep);
        this.accumulator -= config.timestep;
      }
    }

    this.onFrame?.(frameDt);
    this.renderer.render(this.scene, this.camera);
  }
}
