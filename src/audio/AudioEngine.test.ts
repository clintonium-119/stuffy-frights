import { describe, it, expect } from 'vitest';
import { rainGainForWindow, musicSwell } from './AudioEngine';
import { config } from '../core/config';

describe('rain gain vs window distance', () => {
  const a = config.audio;

  it('is loudest at the glass and faint far away (clamped)', () => {
    expect(rainGainForWindow(0)).toBeCloseTo(a.rainMaxGain, 5);
    expect(rainGainForWindow(a.rainWindowFalloff)).toBeCloseTo(a.rainMinGain, 5);
    expect(rainGainForWindow(1000)).toBeCloseTo(a.rainMinGain, 5); // clamped past falloff
  });

  it('decreases monotonically with distance', () => {
    let prev = Infinity;
    for (let d = 0; d <= 14; d += 1) {
      const g = rainGainForWindow(d);
      expect(g).toBeLessThanOrEqual(prev + 1e-9);
      prev = g;
    }
    expect(rainGainForWindow(0)).toBeGreaterThan(rainGainForWindow(a.rainWindowFalloff));
  });
});

describe('music swell vs enemy distance', () => {
  const a = config.audio;

  it('is zero beyond the swell range (and when no enemy)', () => {
    expect(musicSwell(Infinity)).toBe(0);
    expect(musicSwell(a.musicSwellRange)).toBe(0);
    expect(musicSwell(a.musicSwellRange + 5)).toBe(0);
  });

  it('rises as the enemy closes, clamped at the max', () => {
    expect(musicSwell(0)).toBeCloseTo(a.musicSwellMax, 5); // right on top
    expect(musicSwell(2)).toBeGreaterThan(musicSwell(8));
    expect(musicSwell(8)).toBeGreaterThan(musicSwell(13));
    expect(musicSwell(0)).toBeLessThanOrEqual(a.musicSwellMax + 1e-9);
  });
});

describe('thunder delay config', () => {
  it('has a valid positive delay window after the flash', () => {
    expect(config.audio.thunderDelayMin).toBeGreaterThan(0);
    expect(config.audio.thunderDelayMax).toBeGreaterThan(config.audio.thunderDelayMin);
  });
});
