import { describe, it, expect } from 'vitest';
import { config } from './config';

describe('config invariants', () => {
  it('keeps image-based lighting gated low so darkness is preserved', () => {
    // IBL adds material realism, not visibility — must stay a small fraction.
    expect(config.visibility.environmentIntensity).toBeGreaterThan(0);
    expect(config.visibility.environmentIntensity).toBeLessThanOrEqual(0.15);
  });

  it('the basement is the darkest floor', () => {
    const amb = config.visibility.ambientIntensityByFloor;
    expect(Math.min(...amb)).toBe(amb[0]); // floor 0 = basement
  });

  it('vent grilles fold open over a brief, positive duration', () => {
    expect(config.passage.ventFoldSeconds).toBeGreaterThan(0);
    expect(config.passage.ventFoldSeconds).toBeLessThanOrEqual(2);
  });
});
