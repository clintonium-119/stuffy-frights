import { config } from '../core/config';

/**
 * Flashlight battery economy. Pure logic — no DOM, no Three.js — so it
 * tests headless. Drains only while the light is on; never regenerates
 * passively; charging is pumped in by the charging session.
 */
export class Battery {
  /** Charge fraction 0..1. */
  level: number;
  /** Fired on every level change (HUD subscribes). */
  onChange: ((level: number) => void) | null = null;
  /** Fired once each time the level crosses below the low threshold. */
  onLowWarning: (() => void) | null = null;
  private wasLow = false;

  constructor(startLevel = config.battery.startCharge) {
    this.level = clamp01(startLevel);
    this.wasLow = this.isLow;
  }

  get isLow(): boolean {
    return this.level <= config.flashlight.lowThreshold;
  }

  get isEmpty(): boolean {
    return this.level <= 0;
  }

  /** Whether the flashlight is allowed to turn on. */
  canLight(): boolean {
    return this.level > 0;
  }

  /** Per fixed step. Drains only while the light is on. */
  update(dt: number, lightOn: boolean): void {
    if (!lightOn || this.level <= 0) return;
    this.set(this.level - dt / config.battery.drainSeconds);
  }

  /** Pumped by a charging session: dt seconds of slow charging. */
  charge(dt: number): void {
    this.set(this.level + dt / (config.battery.drainSeconds * config.battery.chargeRatio));
  }

  /** Refill to the run-start charge (fires onChange so the HUD updates). */
  reset(): void {
    this.wasLow = false;
    this.set(config.battery.startCharge);
  }

  private set(value: number): void {
    const next = clamp01(value);
    if (next === this.level) return;
    this.level = next;
    this.onChange?.(next);
    if (this.isLow && !this.wasLow) this.onLowWarning?.();
    this.wasLow = this.isLow;
  }
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
