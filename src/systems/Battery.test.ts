import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Battery } from './Battery';
import { ChargingSystem } from './Charging';
import { ChargingStation } from './ChargingStation';
import { PlayerController } from '../player/PlayerController';
import { Input } from '../core/Input';
import { ControlManager } from '../core/Controls';
import { ColliderSet } from '../core/Collision';
import { config } from '../core/config';

const DT = 1 / 60;

function simulate(battery: Battery, seconds: number, lightOn: boolean) {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps; i++) battery.update(DT, lightOn);
}

describe('Battery', () => {
  it('drains from full to empty in config drainSeconds (±1 s)', () => {
    const b = new Battery(1);
    simulate(b, config.battery.drainSeconds - 1, true);
    expect(b.level).toBeGreaterThan(0);
    simulate(b, 2, true);
    expect(b.level).toBe(0);
  });

  it('does not drain while the light is off', () => {
    const b = new Battery(0.5);
    simulate(b, 60, false);
    expect(b.level).toBe(0.5);
  });

  it('clamps at 0 and 1', () => {
    const b = new Battery(0.01);
    simulate(b, 10, true);
    expect(b.level).toBe(0);
    b.charge(1e9);
    expect(b.level).toBe(1);
  });

  it('canLight is false only at empty', () => {
    const b = new Battery(0.05);
    expect(b.canLight()).toBe(true);
    simulate(b, 20, true);
    expect(b.canLight()).toBe(false);
  });

  it('fires the low warning exactly once per crossing', () => {
    const b = new Battery(1);
    let warnings = 0;
    b.onLowWarning = () => warnings++;
    simulate(b, config.battery.drainSeconds * (1 - config.flashlight.lowThreshold) + 1, true);
    expect(b.isLow).toBe(true);
    expect(warnings).toBe(1);
    // Stay low: no repeat.
    simulate(b, 2, true);
    expect(warnings).toBe(1);
    // Recover above threshold, then cross again → second warning.
    b.charge(config.battery.drainSeconds * config.battery.chargeRatio * 0.3);
    expect(b.isLow).toBe(false);
    simulate(b, config.battery.drainSeconds * 0.35, true);
    expect(b.isLow).toBe(true);
    expect(warnings).toBe(2);
  });

  it('charging never out-paces draining (chargeRatio ≥ 1)', () => {
    expect(config.battery.chargeRatio).toBeGreaterThanOrEqual(1);
  });

  it('drains noticeably faster than the old balance (conservation matters)', () => {
    expect(config.battery.drainSeconds).toBeLessThanOrEqual(100);
  });

  it('charge rate is chargeRatio× slower than drain', () => {
    const b = new Battery(0);
    const seconds = 30;
    for (let i = 0; i < seconds / DT; i++) b.charge(DT);
    const gained = b.level;
    const b2 = new Battery(1);
    simulate(b2, seconds, true);
    const lost = 1 - b2.level;
    expect(lost / gained).toBeCloseTo(config.battery.chargeRatio, 1);
  });

  it('mixed cycle nets correctly (drain 50%, charge 25%)', () => {
    const b = new Battery(1);
    simulate(b, config.battery.drainSeconds / 2, true);
    expect(b.level).toBeCloseTo(0.5, 2);
    const chargeSeconds = config.battery.drainSeconds * config.battery.chargeRatio * 0.25;
    for (let i = 0; i < chargeSeconds / DT; i++) b.charge(DT);
    expect(b.level).toBeCloseTo(0.75, 2);
  });
});

describe('ChargingSystem', () => {
  function setup(level = 0.2) {
    const battery = new Battery(level);
    const input = new Input();
    const player = new PlayerController(new THREE.PerspectiveCamera(), new ControlManager(), new ColliderSet());
    let lightForcedOff = false;
    const charging = new ChargingSystem(battery, player, input, () => {
      lightForcedOff = true;
    });
    const station = new ChargingStation(
      { floor: 1, x: 1, z: 5 },
      new THREE.Vector3(3, 3.5, 11),
      new THREE.Vector3(-1, 0, 0)
    );
    return { battery, input, player, charging, station, lightOff: () => lightForcedOff };
  }

  it('plugIn forces light off, locks movement, starts charging', () => {
    const s = setup();
    s.charging.plugIn(s.station);
    expect(s.lightOff()).toBe(true);
    expect(s.player.movementLocked).toBe(true);
    expect(s.station.charging).toBe(true);
    const before = s.battery.level;
    for (let i = 0; i < 600; i++) s.charging.update(DT);
    expect(s.battery.level).toBeGreaterThan(before);
  });

  it('survives the plug-in keystroke and charges (same-step E race)', () => {
    const s = setup(0.2);
    // Reproduce the real flow: E is "just pressed" this step, the interaction
    // plugs in, then the charging update runs in the SAME step with E still on.
    (s.input as unknown as { pressedThisStep: Set<string> })['pressedThisStep'].add('KeyE');
    s.charging.plugIn(s.station);
    const before = s.battery.level;
    s.charging.update(DT); // same step, E still pressed
    expect(s.charging.isCharging).toBe(true);
    expect(s.battery.level).toBeGreaterThan(before);
    // A genuine E press on a LATER step unplugs.
    s.charging.update(DT); // E edge cleared in real code by endStep; here re-add to assert
    (s.input as unknown as { pressedThisStep: Set<string> })['pressedThisStep'].add('KeyE');
    s.charging.update(DT);
    expect(s.charging.isCharging).toBe(false);
  });

  it('movement input unplugs instantly, retaining charge', () => {
    const s = setup();
    s.charging.plugIn(s.station);
    for (let i = 0; i < 300; i++) s.charging.update(DT);
    const gained = s.battery.level;
    // Simulate a held movement key directly (no DOM in this environment):
    (s.input as unknown as { down: Set<string> })['down'].add('KeyW');
    s.charging.update(DT);
    expect(s.charging.isCharging).toBe(false);
    expect(s.player.movementLocked).toBe(false);
    expect(s.battery.level).toBe(gained);
  });

  it('charge-to-full from empty takes ratio× drain time', () => {
    const s = setup(0);
    s.charging.plugIn(s.station);
    const fullSeconds = config.battery.drainSeconds * config.battery.chargeRatio;
    for (let i = 0; i < (fullSeconds + 2) / DT; i++) s.charging.update(DT);
    expect(s.battery.level).toBe(1);
  });

  it('emits hum ticks while charging (AI hearing hook)', () => {
    const s = setup();
    let hums = 0;
    s.charging.onHumTick = () => hums++;
    s.charging.plugIn(s.station);
    for (let i = 0; i < 600; i++) s.charging.update(DT); // 10 s
    expect(hums).toBeGreaterThanOrEqual(7);
  });
});
