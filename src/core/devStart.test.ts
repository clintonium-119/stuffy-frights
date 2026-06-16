import { describe, it, expect } from 'vitest';
import { parseDevStart } from './devStart';

describe('parseDevStart', () => {
  it('parses a valid floor + difficulty', () => {
    expect(parseDevStart('?floor=3&difficulty=hard')).toEqual({ floor: 3, difficulty: 'hard' });
    expect(parseDevStart('?floor=0')).toEqual({ floor: 0 });
  });

  it('drops an out-of-range or non-integer floor', () => {
    expect(parseDevStart('?floor=99')).toEqual({});
    expect(parseDevStart('?floor=-1')).toEqual({});
    expect(parseDevStart('?floor=1.5')).toEqual({});
    expect(parseDevStart('?floor=abc')).toEqual({});
  });

  it('drops an unknown difficulty', () => {
    expect(parseDevStart('?difficulty=dragon')).toEqual({});
  });

  it('returns empty for no params (normal boot)', () => {
    expect(parseDevStart('')).toEqual({});
    expect(parseDevStart('?other=1')).toEqual({});
  });
});
