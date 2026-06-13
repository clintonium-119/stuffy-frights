import { Battery } from './Battery';
import { ChargingStation } from './ChargingStation';
import { PlayerController } from '../player/PlayerController';
import { Input } from '../core/Input';

/**
 * The vulnerable-charging loop: plugged in, the flashlight is forced off,
 * movement is locked (look stays free — scan the dark), and charge trickles
 * in at the slow config rate. ANY movement key (or E) unplugs instantly,
 * keeping whatever charge accumulated.
 */
export class ChargingSystem {
  /** Active station, or null. */
  session: ChargingStation | null = null;
  /** Hook for AI hearing: charging emits a faint hum noise event. */
  onHumTick: ((station: ChargingStation) => void) | null = null;
  /** Fired on plug/unplug for audio + HUD. */
  onPlugChange: ((charging: boolean) => void) | null = null;
  private humTimer = 0;
  /**
   * The keystroke that plugged in is still "just pressed" for the rest of this
   * fixed step, so the unplug check below would fire on the very same step and
   * tear the session down before it charges. This one-shot guard absorbs that
   * first step; from the next step on, E (or movement) unplugs as normal.
   */
  private justPlugged = false;

  constructor(
    private battery: Battery,
    private player: PlayerController,
    private input: Input,
    private forceLightOff: () => void
  ) {}

  get isCharging(): boolean {
    return this.session !== null;
  }

  plugIn(station: ChargingStation): void {
    if (this.session) return;
    this.session = station;
    station.charging = true;
    this.justPlugged = true;
    this.forceLightOff();
    this.player.movementLocked = true;
    this.onPlugChange?.(true);
  }

  unplug(): void {
    if (!this.session) return;
    this.session.charging = false;
    this.session = null;
    this.player.movementLocked = false;
    this.onPlugChange?.(false);
  }

  /** Per fixed step. */
  update(dt: number): void {
    if (!this.session) return;
    // Absorb the plug-in keystroke's lingering edge for one step so the
    // session survives to actually charge.
    if (this.justPlugged) {
      this.justPlugged = false;
    } else if (this.input.anyMovementDown() || this.input.justPressed('KeyE')) {
      // Any movement intent (or another E press) breaks the session instantly.
      this.unplug();
      return;
    }
    this.battery.charge(dt);
    this.humTimer -= dt;
    if (this.humTimer <= 0) {
      this.humTimer = 1.2;
      this.onHumTick?.(this.session);
    }
  }
}
