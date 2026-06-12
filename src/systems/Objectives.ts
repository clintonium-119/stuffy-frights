import { Rng } from '../core/rng';
import { CellPos, ExitId, House } from '../world/layoutTypes';

export interface ObjectiveSetup {
  keyLocation: CellPos;
  correctExit: ExitId;
}

/** Pure, seeded objective roll — same seed, same run. */
export function rollObjectives(house: House, seed: number): ObjectiveSetup {
  const rng = new Rng(seed);
  return {
    keyLocation: rng.pick(house.keyCandidates),
    correctExit: rng.pick(house.exits.map((e) => e.id)),
  };
}

export type ExitResult = 'locked' | 'wrongKey' | 'open';

/**
 * The run objective: find the randomly hidden key ring, then find WHICH
 * of the three front-door exits it opens. Wrong exits reject the key;
 * nothing visually betrays the right one before trying.
 */
export class Objectives {
  readonly setup: ObjectiveSetup;
  hasKey = false;
  escaped = false;
  /** Exits the player has tried (win-screen recap + map could use it). */
  readonly triedExits = new Set<ExitId>();
  onKeyTaken: (() => void) | null = null;
  onWin: (() => void) | null = null;
  /** Feedback line for the HUD toaster. */
  onMessage: ((text: string) => void) | null = null;

  constructor(house: House, seed: number) {
    this.setup = rollObjectives(house, seed);
  }

  takeKey(): void {
    if (this.hasKey) return;
    this.hasKey = true;
    this.onMessage?.('A ring of old keys. One of the doors out front should take these…');
    this.onKeyTaken?.();
  }

  tryExit(id: ExitId): ExitResult {
    this.triedExits.add(id);
    if (!this.hasKey) {
      this.onMessage?.("Locked tight. There's a keyhole…");
      return 'locked';
    }
    if (id !== this.setup.correctExit) {
      this.onMessage?.("The key doesn't fit this lock. There must be another door…");
      return 'wrongKey';
    }
    this.escaped = true;
    this.onWin?.();
    return 'open';
  }
}
