export type GameStateName =
  | 'menu'
  | 'playing'
  | 'mapOpen'
  | 'paused'
  | 'jumpscare'
  | 'gameOver'
  | 'won';

export type GameEvent =
  | 'start'
  | 'openMap'
  | 'closeMap'
  | 'pause'
  | 'resume'
  | 'caught'
  | 'gameOverShown'
  | 'retry'
  | 'win'
  | 'toMenu';

/**
 * The run's state machine as a pure transition table. Key semantics from
 * the brief + controls decision: the MAP DOES NOT PAUSE the simulation
 * (movement locks, the world keeps hunting); Esc is a true pause.
 */
const TABLE: Record<GameStateName, Partial<Record<GameEvent, GameStateName>>> = {
  menu: { start: 'playing' },
  playing: { openMap: 'mapOpen', pause: 'paused', caught: 'jumpscare', win: 'won' },
  mapOpen: { closeMap: 'playing', pause: 'paused', caught: 'jumpscare', win: 'won' },
  paused: { resume: 'playing', toMenu: 'menu' },
  jumpscare: { gameOverShown: 'gameOver' },
  gameOver: { retry: 'playing', toMenu: 'menu' },
  won: { retry: 'playing', toMenu: 'menu' },
};

export class GameState {
  state: GameStateName = 'menu';
  onChange: ((state: GameStateName, prev: GameStateName) => void) | null = null;

  /** Apply an event. Returns false (no change) for illegal transitions. */
  transition(event: GameEvent): boolean {
    const next = TABLE[this.state][event];
    if (!next) return false;
    const prev = this.state;
    this.state = next;
    this.onChange?.(next, prev);
    return true;
  }

  /** The world simulates in these states (map view keeps the danger live). */
  get simulationTicks(): boolean {
    return this.state === 'playing' || this.state === 'mapOpen' || this.state === 'jumpscare';
  }

  /** The player may move only while plainly playing. */
  get movementAllowed(): boolean {
    return this.state === 'playing';
  }

  get lookAllowed(): boolean {
    return this.state === 'playing';
  }
}
