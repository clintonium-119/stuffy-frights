import { describe, it, expect } from 'vitest';
import {
  CELL_SIZE,
  FLOOR_SPACING,
  cellToWorld,
  worldToCell,
  floorY,
} from './layoutTypes';
import { config } from '../core/config';

describe('layout coordinate helpers', () => {
  it('sources the grid pitch from config (one knob, no scattered literal)', () => {
    expect(CELL_SIZE).toBe(config.world.cellSize);
  });

  it('cellToWorld/worldToCell round-trip every cell at the configured pitch', () => {
    for (let z = 0; z < 12; z++) {
      for (let x = 0; x < 12; x++) {
        const w = cellToWorld(x, z);
        // Cell centers sit half a pitch into the cell.
        expect(w.x).toBeCloseTo((x + 0.5) * CELL_SIZE);
        expect(w.z).toBeCloseTo((z + 0.5) * CELL_SIZE);
        const back = worldToCell(w.x, w.z);
        expect(back).toEqual({ x, z });
      }
    }
  });

  it('floorY is linear in the floor index for an arbitrary floor count', () => {
    expect(floorY(0)).toBe(0);
    // No floor cap: spacing is constant for any N, including > 4 floors.
    for (let n = 0; n < 9; n++) {
      expect(floorY(n)).toBeCloseTo(n * FLOOR_SPACING);
      expect(floorY(n + 1) - floorY(n)).toBeCloseTo(FLOOR_SPACING);
    }
  });
});
