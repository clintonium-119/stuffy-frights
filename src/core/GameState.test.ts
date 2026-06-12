import { describe, it, expect } from 'vitest';
import { GameState } from './GameState';

describe('GameState transition table', () => {
  it('runs the happy path: menu→playing→mapOpen→playing→won', () => {
    const gs = new GameState();
    expect(gs.transition('start')).toBe(true);
    expect(gs.transition('openMap')).toBe(true);
    expect(gs.state).toBe('mapOpen');
    expect(gs.transition('closeMap')).toBe(true);
    expect(gs.transition('win')).toBe(true);
    expect(gs.state).toBe('won');
  });

  it('map keeps the simulation ticking but blocks movement', () => {
    const gs = new GameState();
    gs.transition('start');
    gs.transition('openMap');
    expect(gs.simulationTicks).toBe(true); // the brief's risk mechanic
    expect(gs.movementAllowed).toBe(false);
    expect(gs.lookAllowed).toBe(false);
  });

  it('pause freezes the simulation entirely', () => {
    const gs = new GameState();
    gs.transition('start');
    gs.transition('pause');
    expect(gs.state).toBe('paused');
    expect(gs.simulationTicks).toBe(false);
    expect(gs.transition('resume')).toBe(true);
    expect(gs.simulationTicks).toBe(true);
  });

  it('catching works from both playing and mapOpen (map-gazing is lethal)', () => {
    const a = new GameState();
    a.transition('start');
    expect(a.transition('caught')).toBe(true);
    const b = new GameState();
    b.transition('start');
    b.transition('openMap');
    expect(b.transition('caught')).toBe(true);
    expect(b.state).toBe('jumpscare');
  });

  it('death flow: jumpscare→gameOver→retry→playing', () => {
    const gs = new GameState();
    gs.transition('start');
    gs.transition('caught');
    expect(gs.transition('gameOverShown')).toBe(true);
    expect(gs.state).toBe('gameOver');
    expect(gs.transition('retry')).toBe(true);
    expect(gs.state).toBe('playing');
  });

  it('rejects illegal transitions without changing state', () => {
    const gs = new GameState();
    expect(gs.transition('caught')).toBe(false); // can't be caught in the menu
    expect(gs.state).toBe('menu');
    gs.transition('start');
    gs.transition('pause');
    expect(gs.transition('caught')).toBe(false); // paused is safe
    expect(gs.transition('openMap')).toBe(false);
    expect(gs.state).toBe('paused');
  });

  it('fires onChange with both states', () => {
    const gs = new GameState();
    const seen: string[] = [];
    gs.onChange = (next, prev) => seen.push(`${prev}->${next}`);
    gs.transition('start');
    gs.transition('openMap');
    expect(seen).toEqual(['menu->playing', 'playing->mapOpen']);
  });
});
