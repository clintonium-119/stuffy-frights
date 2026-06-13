/**
 * Persistent player settings + stats, stored under one versioned localStorage
 * key. All access goes through this class; reads are defensive (absent/corrupt
 * data resolves to defaults and never throws) and writes are best-effort. When
 * no `localStorage` exists (tests / headless), an in-memory backend is used so
 * the store works everywhere.
 */
import {
  DIFFICULTY_ORDER,
  DEFAULT_DIFFICULTY,
  type DifficultyLevel,
} from './difficulty';

const STORAGE_KEY = 'stuffy-frights-v1';
const SCHEMA_VERSION = 1;

/** Per-difficulty running tally. */
export interface DifficultyStats {
  wins: number;
  losses: number;
  /** Best consecutive wins at this difficulty. */
  bestStreak: number;
  /** Current consecutive wins (resets to 0 on a loss). */
  currentStreak: number;
}

/** The ironman ladder run (a single attempt at winning all four in a row). */
export interface IronmanSession {
  active: boolean;
  currentLevel: DifficultyLevel;
  /** Best number of consecutive rungs ever cleared in one ladder. */
  bestStreak: number;
  /** Hardest rung ever reached across all ladder attempts. */
  bestLevelReached: DifficultyLevel | null;
}

export interface PersistedState {
  version: number;
  lastDifficulty: DifficultyLevel;
  stats: Record<DifficultyLevel, DifficultyStats>;
  ironman: IronmanSession;
}

/** Minimal storage surface — satisfied by `localStorage` or the in-memory shim. */
type Backend = Pick<Storage, 'getItem' | 'setItem'>;

function emptyStats(): DifficultyStats {
  return { wins: 0, losses: 0, bestStreak: 0, currentStreak: 0 };
}

function defaults(): PersistedState {
  return {
    version: SCHEMA_VERSION,
    lastDifficulty: DEFAULT_DIFFICULTY,
    stats: {
      easy: emptyStats(),
      medium: emptyStats(),
      hard: emptyStats(),
      nightmare: emptyStats(),
    },
    ironman: { active: false, currentLevel: 'easy', bestStreak: 0, bestLevelReached: null },
  };
}

function isLevel(v: unknown): v is DifficultyLevel {
  return typeof v === 'string' && (DIFFICULTY_ORDER as string[]).includes(v);
}

/** In-memory backend used when `localStorage` is unavailable. */
function memoryBackend(): Backend {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => void map.set(k, v),
  };
}

function defaultBackend(): Backend {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // accessing localStorage can throw (privacy mode) — fall through to memory
  }
  return memoryBackend();
}

export class SettingsStore {
  private readonly backend: Backend;

  constructor(backend?: Backend) {
    this.backend = backend ?? defaultBackend();
  }

  // --- difficulty selection ---

  getLastDifficulty(): DifficultyLevel {
    return this.read().lastDifficulty;
  }

  setLastDifficulty(level: DifficultyLevel): void {
    const s = this.read();
    s.lastDifficulty = level;
    this.write(s);
  }

  // --- per-difficulty stats ---

  recordRun(run: { difficulty: DifficultyLevel; won: boolean }): void {
    const s = this.read();
    const st = s.stats[run.difficulty];
    if (run.won) {
      st.wins += 1;
      st.currentStreak += 1;
      if (st.currentStreak > st.bestStreak) st.bestStreak = st.currentStreak;
    } else {
      st.losses += 1;
      st.currentStreak = 0;
    }
    this.write(s);
  }

  getStats(): Record<DifficultyLevel, DifficultyStats> {
    return this.read().stats;
  }

  /** Win percentage (0..100, rounded). 0 when no games played. */
  winRate(level: DifficultyLevel): number {
    const st = this.read().stats[level];
    const games = st.wins + st.losses;
    return games === 0 ? 0 : Math.round((st.wins / games) * 100);
  }

  // --- ironman ladder ---

  getIronman(): IronmanSession {
    return this.read().ironman;
  }

  isIronmanActive(): boolean {
    return this.read().ironman.active;
  }

  /** 1-based rung index of the current ironman level (1 = Easy). */
  ironmanRung(): number {
    return DIFFICULTY_ORDER.indexOf(this.read().ironman.currentLevel) + 1;
  }

  /** Begin a fresh ladder at Easy. Best-streak / best-rung history is preserved. */
  startIronman(): void {
    const s = this.read();
    s.ironman.active = true;
    s.ironman.currentLevel = 'easy';
    this.write(s);
  }

  /**
   * Record a ladder win and advance one rung. Winning the last rung
   * (Nightmare) completes the ladder (session goes inactive, resets to Easy).
   * Updates best streak + best rung reached.
   */
  advanceIronman(): void {
    const s = this.read();
    const im = s.ironman;
    const idx = DIFFICULTY_ORDER.indexOf(im.currentLevel);
    const rungsCleared = idx + 1;
    if (rungsCleared > im.bestStreak) im.bestStreak = rungsCleared;
    im.bestLevelReached = harderOf(im.bestLevelReached, im.currentLevel);
    if (idx >= DIFFICULTY_ORDER.length - 1) {
      // Cleared the whole ladder.
      im.active = false;
      im.currentLevel = 'easy';
    } else {
      im.currentLevel = DIFFICULTY_ORDER[idx + 1];
    }
    this.write(s);
  }

  /** Record a death during a ladder run and reset to Easy. */
  failIronman(): void {
    const s = this.read();
    const im = s.ironman;
    im.bestLevelReached = harderOf(im.bestLevelReached, im.currentLevel);
    im.active = false;
    im.currentLevel = 'easy';
    this.write(s);
  }

  /** Leave the ladder without recording a death (e.g. player chose a normal run). */
  abandonIronman(): void {
    const s = this.read();
    s.ironman.active = false;
    s.ironman.currentLevel = 'easy';
    this.write(s);
  }

  // --- persistence ---

  private read(): PersistedState {
    let raw: string | null = null;
    try {
      raw = this.backend.getItem(STORAGE_KEY);
    } catch {
      return defaults();
    }
    if (!raw) return defaults();
    try {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (!parsed || parsed.version !== SCHEMA_VERSION) return defaults();
      return reconcile(parsed);
    } catch {
      return defaults();
    }
  }

  private write(state: PersistedState): void {
    try {
      this.backend.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // best-effort: a quota / serialization failure must not break gameplay
    }
  }
}

function harderOf(a: DifficultyLevel | null, b: DifficultyLevel): DifficultyLevel {
  if (a === null) return b;
  return DIFFICULTY_ORDER.indexOf(b) > DIFFICULTY_ORDER.indexOf(a) ? b : a;
}

/** Merge a parsed (possibly partial) state onto defaults, validating shape. */
function reconcile(parsed: Partial<PersistedState>): PersistedState {
  const base = defaults();
  if (isLevel(parsed.lastDifficulty)) base.lastDifficulty = parsed.lastDifficulty;
  if (parsed.stats) {
    for (const lvl of DIFFICULTY_ORDER) {
      const s = parsed.stats[lvl];
      if (s && typeof s === 'object') {
        base.stats[lvl] = {
          wins: numOr(s.wins, 0),
          losses: numOr(s.losses, 0),
          bestStreak: numOr(s.bestStreak, 0),
          currentStreak: numOr(s.currentStreak, 0),
        };
      }
    }
  }
  if (parsed.ironman && typeof parsed.ironman === 'object') {
    const im = parsed.ironman;
    base.ironman = {
      active: im.active === true,
      currentLevel: isLevel(im.currentLevel) ? im.currentLevel : 'easy',
      bestStreak: numOr(im.bestStreak, 0),
      bestLevelReached: isLevel(im.bestLevelReached) ? im.bestLevelReached : null,
    };
  }
  return base;
}

function numOr(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
