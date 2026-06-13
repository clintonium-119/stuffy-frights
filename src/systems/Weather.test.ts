import { describe, it, expect } from 'vitest';
import { WeatherSystem } from './Weather';
import { config } from '../core/config';

const DT = 1 / 60;

describe('WeatherSystem', () => {
  it('fires a lightning strike + flash on schedule, then the flash decays', () => {
    // rng=0.5 → nextInterval = mean (jitter term is zero).
    const w = new WeatherSystem({ rng: () => 0.5 });
    let strikes = 0;
    w.onLightning = () => strikes++;
    const mean = config.weather.strikeIntervalMean;

    let t = 0;
    while (t < mean - 0.5) {
      w.update(DT);
      t += DT;
    }
    expect(strikes).toBe(0);
    expect(w.flash).toBe(0);

    while (strikes === 0) {
      w.update(DT);
      t += DT;
    }
    expect(strikes).toBe(1);
    expect(w.flash).toBeGreaterThan(0.6); // blazes on the strike

    // Flash eases back to dark within ~flashDecaySeconds (+ the double-flicker).
    const steps = Math.ceil((config.weather.flashDecaySeconds + 0.3) / DT);
    for (let i = 0; i < steps; i++) w.update(DT);
    expect(w.flash).toBeLessThan(0.05);
  });

  it('exposes a steady rain intensity from config, clamped 0..1', () => {
    const w = new WeatherSystem();
    expect(w.rainIntensity).toBe(config.weather.rainIntensity);
    expect(w.rainIntensity).toBeGreaterThanOrEqual(0);
    expect(w.rainIntensity).toBeLessThanOrEqual(1);
  });

  it('schedules strikes within the configured interval window (min vs max jitter)', () => {
    const { strikeIntervalMean: m, strikeIntervalJitter: j } = config.weather;
    const timeToFirstStrike = (rng: () => number) => {
      const w = new WeatherSystem({ rng });
      let struck = false;
      w.onLightning = () => (struck = true);
      let t = 0;
      while (!struck) {
        w.update(DT);
        t += DT;
      }
      return t;
    };
    const lo = timeToFirstStrike(() => 0); // mean - jitter
    const hi = timeToFirstStrike(() => 1); // mean + jitter
    expect(lo).toBeGreaterThan(m - j - 0.1);
    expect(lo).toBeLessThan(m - j + 0.5);
    expect(hi).toBeGreaterThan(m + j - 0.1);
    expect(hi).toBeLessThan(m + j + 0.5);
  });
});
