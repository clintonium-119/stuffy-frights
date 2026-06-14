import { describe, it, expect } from 'vitest';
import { parseViewerRoute, ENEMY_KEYS } from './enemyViewerRoute';

describe('parseViewerRoute', () => {
  it('resolves every alias to its canonical enemy key', () => {
    const cases: Record<string, string> = {
      poo: 'poo',
      pou: 'poo',
      fuggie: 'fuggie',
      fuggler: 'fuggie',
      charles: 'charles',
      gorilla: 'charles',
      timmy: 'charles',
      newyama: 'newyama',
      yama: 'newyama',
      llama: 'newyama',
    };
    for (const [alias, key] of Object.entries(cases)) {
      expect(parseViewerRoute(alias)?.enemy).toBe(key);
    }
  });

  it('accepts hash, search-param, and path forms', () => {
    expect(parseViewerRoute('#llama')?.enemy).toBe('newyama');
    expect(parseViewerRoute('#viewer/gorilla')?.enemy).toBe('charles');
    expect(parseViewerRoute('?enemy=pou')?.enemy).toBe('poo');
    expect(parseViewerRoute('?foo=1&enemy=fuggler')?.enemy).toBe('fuggie');
  });

  it('is case-insensitive', () => {
    expect(parseViewerRoute('#LLAMA')?.enemy).toBe('newyama');
    expect(parseViewerRoute('Gorilla')?.enemy).toBe('charles');
  });

  it('returns null for absent or unknown routes', () => {
    expect(parseViewerRoute(null)).toBeNull();
    expect(parseViewerRoute('')).toBeNull();
    expect(parseViewerRoute('#')).toBeNull();
    expect(parseViewerRoute('?enemy=dragon')).toBeNull();
    expect(parseViewerRoute('nonsense')).toBeNull();
  });

  it('exposes the four canonical keys in order', () => {
    expect(ENEMY_KEYS).toEqual(['poo', 'fuggie', 'charles', 'newyama']);
  });
});
