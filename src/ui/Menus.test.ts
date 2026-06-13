import { describe, it, expect } from 'vitest';
import { ENEMY_NAMES } from './Menus';

describe('ENEMY_NAMES display names', () => {
  it('renders the Gorilla Tag plush as Little Timmy and the blob as Pou', () => {
    expect(ENEMY_NAMES.charles).toBe('LITTLE TIMMY');
    expect(ENEMY_NAMES.poo).toBe('POU');
  });

  it('leaves New Yama and Fuggie unchanged', () => {
    expect(ENEMY_NAMES.newYama).toBe('NEW YAMA');
    expect(ENEMY_NAMES.fuggie).toBe('FUGGIE');
  });
});
