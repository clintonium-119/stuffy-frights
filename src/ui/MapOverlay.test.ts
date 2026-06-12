import { describe, it, expect } from 'vitest';
import { floorDrawRecord } from './MapOverlay';
import { house } from '../world/houseLayout';

describe('map information rules', () => {
  it('shows hiding spots and stations on their floors', () => {
    for (let floor = 0; floor < 4; floor++) {
      const ops = floorDrawRecord(house, floor);
      const hides = ops.filter((o) => o.kind === 'hide');
      const stations = ops.filter((o) => o.kind === 'station');
      expect(hides.length).toBe(house.hidingSpots.filter((h) => h.pos.floor === floor).length);
      expect(stations.length).toBe(
        house.chargingStations.filter((c) => c.floor === floor).length
      );
    }
  });

  it('shows the exits only on the main floor', () => {
    expect(floorDrawRecord(house, 1).filter((o) => o.kind === 'exit')).toHaveLength(3);
    for (const floor of [0, 2, 3]) {
      expect(floorDrawRecord(house, floor).filter((o) => o.kind === 'exit')).toHaveLength(0);
    }
  });

  it('NEVER reveals secret passages: vent cells render as plain wall', () => {
    for (const vent of house.vents) {
      const ops = floorDrawRecord(house, vent.floor);
      for (const cell of vent.cells) {
        const at = ops.filter((o) => o.x === cell.x && o.z === cell.z);
        expect(at).toHaveLength(1);
        expect(at[0].kind).toBe('wall'); // indistinguishable from the wall
      }
    }
  });

  it('never marks chute mouths, enemies, or the key (no such op kinds exist)', () => {
    for (let floor = 0; floor < 4; floor++) {
      const kinds = new Set(floorDrawRecord(house, floor).map((o) => o.kind));
      for (const k of kinds) {
        expect(['wall', 'door', 'stair', 'hide', 'station', 'exit']).toContain(k);
      }
    }
    // Chute mouth cells carry no special marker.
    for (const chute of house.chutes) {
      const ops = floorDrawRecord(house, chute.from.floor);
      const at = ops.filter((o) => o.x === chute.from.x && o.z === chute.from.z);
      expect(at).toHaveLength(0); // plain floor — nothing drawn
    }
  });

  it('draws stairs on both connected floors', () => {
    for (const stair of house.stairs) {
      for (const floor of [stair.lower, stair.upper]) {
        const ops = floorDrawRecord(house, floor).filter((o) => o.kind === 'stair');
        for (const cell of stair.cells) {
          expect(ops.some((o) => o.x === cell.x && o.z === cell.z)).toBe(true);
        }
      }
    }
  });
});
