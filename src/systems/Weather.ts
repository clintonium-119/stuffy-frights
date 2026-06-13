import { config } from '../core/config';

/**
 * Storm weather: a steady rain intensity plus randomly-scheduled lightning
 * strikes. A strike fires `onLightning` (the audio layer hooks this for delayed
 * thunder) and drives a brief, decaying `flash` (0..1). The flash is realised
 * by the windows — the glass blazes and per-window flash lights spill into the
 * rooms nearest each window (see HouseBuilder.updateWindows) — so a strike lights
 * the areas by the windows, NOT the whole house, and windowless rooms (basement)
 * stay dark. The flash is brief + occasional so it never defeats the deep dark.
 *
 * Randomness is injected so the scheduler is unit-testable.
 */
export class WeatherSystem {
  /** Steady rain strength, 0..1 (audio + glass read this). */
  readonly rainIntensity: number;
  /** Fired once per lightning strike (thunder hooks here). */
  onLightning: (() => void) | null = null;

  private flashLevel = 0; // 0..1, decays after each strike
  private strikeTimer: number;
  private secondPop = 0; // schedules the characteristic double-flicker
  private readonly rng: () => number;

  constructor(opts: { rng?: () => number } = {}) {
    this.rng = opts.rng ?? Math.random;
    this.rainIntensity = config.weather.rainIntensity;
    this.strikeTimer = this.nextInterval();
  }

  /** Current flash level (0..1) — windows read this to blaze + spill light. */
  get flash(): number {
    return this.flashLevel;
  }

  private nextInterval(): number {
    const w = config.weather;
    return w.strikeIntervalMean + (this.rng() * 2 - 1) * w.strikeIntervalJitter;
  }

  private strike(): void {
    this.flashLevel = 1;
    this.secondPop = 0.11; // a quick dimmer re-flash for the lightning flicker
    this.onLightning?.();
  }

  /** Per fixed step: decay the flash, run the double-flicker, schedule strikes. */
  update(dt: number): void {
    const w = config.weather;
    if (this.flashLevel > 0) {
      this.flashLevel = Math.max(0, this.flashLevel - dt / w.flashDecaySeconds);
    }
    if (this.secondPop > 0) {
      this.secondPop -= dt;
      if (this.secondPop <= 0) this.flashLevel = Math.max(this.flashLevel, 0.7);
    }
    this.strikeTimer -= dt;
    if (this.strikeTimer <= 0) {
      this.strike();
      this.strikeTimer = this.nextInterval();
    }
  }
}
