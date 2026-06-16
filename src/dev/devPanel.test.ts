import { describe, it, expect } from 'vitest';
import { devFlags, resetDevFlags } from './devFlags';
import {
  scopeLabel,
  clampValue,
  formatValue,
  serializeDevState,
  deserializeDevState,
} from './devPanel';

describe('devFlags', () => {
  it('defaults to all-false with a null warp floor', () => {
    resetDevFlags();
    expect(devFlags.invincible).toBe(false);
    expect(devFlags.invisible).toBe(false);
    expect(devFlags.inaudible).toBe(false);
    expect(devFlags.revealEnemies).toBe(false);
    expect(devFlags.warpFloor).toBeNull();
  });

  it('resetDevFlags restores defaults in place (same reference)', () => {
    const ref = devFlags;
    devFlags.invincible = true;
    devFlags.warpFloor = 2;
    resetDevFlags();
    expect(devFlags).toBe(ref);
    expect(devFlags.invincible).toBe(false);
    expect(devFlags.warpFloor).toBeNull();
  });
});

describe('devPanel pure helpers', () => {
  it('scopeLabel maps scopes to readable tags', () => {
    expect(scopeLabel('global')).toBe('GLOBAL');
    expect(scopeLabel('floor')).toBe('FLOOR');
    expect(scopeLabel('enemy')).toBe('per-enemy');
  });

  it('clampValue clamps into range and handles NaN', () => {
    expect(clampValue(5, 0, 10)).toBe(5);
    expect(clampValue(-3, 0, 10)).toBe(0);
    expect(clampValue(99, 0, 10)).toBe(10);
    expect(clampValue(NaN, 2, 10)).toBe(2);
  });

  it('formatValue trims trailing zeros and caps decimals', () => {
    expect(formatValue(1)).toBe('1');
    expect(formatValue(0.5)).toBe('0.5');
    expect(formatValue(0.123456)).toBe('0.123');
    expect(formatValue(2.0)).toBe('2');
  });
});

describe('dev overlay persistence', () => {
  const state = {
    flags: { invincible: true, invisible: false, inaudible: true, revealEnemies: false, warpFloor: 3 },
    openSections: { AI: true, Atmosphere: false },
  };

  it('serialize → deserialize round-trips losslessly', () => {
    expect(deserializeDevState(serializeDevState(state))).toEqual(state);
  });

  it('deserialize falls back to defaults for absent input', () => {
    const d = deserializeDevState(null);
    expect(d.flags.invincible).toBe(false);
    expect(d.flags.warpFloor).toBeNull();
    expect(d.openSections).toEqual({});
  });

  it('deserialize tolerates malformed input without throwing', () => {
    expect(() => deserializeDevState('{not json')).not.toThrow();
    const d = deserializeDevState('{"flags":42,"openSections":"nope"}');
    expect(d.flags.invincible).toBe(false);
    expect(d.openSections).toEqual({});
  });
});
