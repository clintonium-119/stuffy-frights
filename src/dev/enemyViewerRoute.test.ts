import { describe, it, expect } from 'vitest';
import { parseViewerRoute, ENEMY_KEYS } from './enemyViewerRoute';

describe('parseViewerRoute', () => {
  it('resolves each canonical key (case-insensitively)', () => {
    expect(parseViewerRoute('pou')?.enemy).toBe('pou');
    expect(parseViewerRoute('fuggie')?.enemy).toBe('fuggie');
    expect(parseViewerRoute('littletimmy')?.enemy).toBe('littleTimmy');
    expect(parseViewerRoute('newyama')?.enemy).toBe('newYama');
  });

  it('accepts hash, search-param, and path forms', () => {
    expect(parseViewerRoute('#newYama')?.enemy).toBe('newYama');
    expect(parseViewerRoute('#viewer/littleTimmy')?.enemy).toBe('littleTimmy');
    expect(parseViewerRoute('?enemy=pou')?.enemy).toBe('pou');
    expect(parseViewerRoute('?foo=1&enemy=fuggie')?.enemy).toBe('fuggie');
  });

  it('is case-insensitive', () => {
    expect(parseViewerRoute('#NEWYAMA')?.enemy).toBe('newYama');
    expect(parseViewerRoute('LittleTimmy')?.enemy).toBe('littleTimmy');
  });

  it('no longer accepts the old aliases or names', () => {
    for (const old of ['poo', 'charles', 'gorilla', 'llama', 'timmy', 'yama', 'fuggler']) {
      expect(parseViewerRoute(old)).toBeNull();
    }
  });

  it('returns null for absent or unknown routes', () => {
    expect(parseViewerRoute(null)).toBeNull();
    expect(parseViewerRoute('')).toBeNull();
    expect(parseViewerRoute('#')).toBeNull();
    expect(parseViewerRoute('?enemy=dragon')).toBeNull();
    expect(parseViewerRoute('nonsense')).toBeNull();
  });

  it('exposes the four canonical keys in order', () => {
    expect(ENEMY_KEYS).toEqual(['pou', 'fuggie', 'littleTimmy', 'newYama']);
  });
});
