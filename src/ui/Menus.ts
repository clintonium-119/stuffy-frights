import { DIFFICULTY_META, DIFFICULTY_ORDER, type DifficultyLevel } from '../core/difficulty';
import type { StatsSummary } from '../core/Settings';

/** Per-difficulty accent font-family (bundled in public/fonts/, declared in index.html). */
export const DIFFICULTY_FONTS: Record<DifficultyLevel, string> = {
  easy: "'Patrick Hand', cursive",
  medium: "'Special Elite', 'Courier New', monospace",
  hard: "'Eater', cursive",
  nightmare: "'Nosifer', cursive",
};

/** Internal enemy id → player-facing display name (game-over screen). */
export const ENEMY_NAMES: Record<string, string> = {
  charles: 'LITTLE TIMMY',
  poo: 'POU',
  newYama: 'NEW YAMA',
  fuggie: 'FUGGIE',
};

const CONTROLS_HTML = `
  <table style="margin:0 auto;text-align:left;border-spacing:14px 6px;color:#cfc3a2">
    <tr><td><b>Mouse</b></td><td>look around</td></tr>
    <tr><td><b>W A S D</b></td><td>move</td></tr>
    <tr><td><b>Shift</b></td><td>run (loud!)</td></tr>
    <tr><td><b>C</b></td><td>crouch / crawl (quiet, fits in vents)</td></tr>
    <tr><td><b>F</b></td><td>flashlight</td></tr>
    <tr><td><b>E</b></td><td>interact — hide, charge, grab, try doors</td></tr>
    <tr><td><b>M / Tab</b></td><td>the map (the house does NOT wait for you)</td></tr>
    <tr><td><b>Esc</b></td><td>pause</td></tr>
  </table>
  <p style="max-width:520px;margin:18px auto;color:#a99c7c;line-height:1.5">
    Find the <b style="color:#d8c372">keys</b> hidden somewhere in the house.
    Only <b>one</b> of the three front doors matches them.
    The flashlight keeps the stuffies honest — but the battery won't last.
    Charging stations glow green. Hide in the dark. Listen.
  </p>`;

/**
 * Title / how-to-play / pause / game-over / win screens. One overlay root;
 * buttons resolve through injected actions. First click also unlocks audio.
 */
export class Menus {
  private root: HTMLDivElement;
  onStart: (() => void) | null = null;
  onResume: (() => void) | null = null;
  onRetry: (() => void) | null = null;
  /** Player chose to quit back to the main menu (from pause / game-over / win). */
  onQuitToMenu: (() => void) | null = null;
  /** Player chose a difficulty on the select screen (main persists + starts/reloads). */
  onSelectDifficulty: ((level: DifficultyLevel) => void) | null = null;
  /** Player asked to view the stats screen. */
  onShowStats: (() => void) | null = null;
  /** Player started an ironman ladder run from the title. */
  onStartIronman: (() => void) | null = null;
  /** Player clicked Continue on a winning ironman screen (advance a rung). */
  onContinueIronman: (() => void) | null = null;
  /** Any first interaction (audio unlock). */
  onFirstInteraction: (() => void) | null = null;
  private interacted = false;
  /** The currently-applied difficulty (boot level) — pre-highlighted on the select screen. */
  private current: DifficultyLevel = 'medium';

  constructor(ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'clickable';
    // Scroll container: a block root that scrolls, holding a min-height flex box
    // that centers content when it fits and grows scrollable when it doesn't —
    // so nothing is clipped out of view on short (landscape phone) screens.
    this.root.style.cssText =
      'position:absolute;inset:0;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;' +
      'text-align:center;background:rgba(2,2,5,0.88);color:#e8dcc0;' +
      "font-family:'Trebuchet MS',Verdana,sans-serif";
    ui.appendChild(this.root);
    this.root.addEventListener('click', () => {
      if (!this.interacted) {
        this.interacted = true;
        this.onFirstInteraction?.();
      }
    });
  }

  hide(): void {
    this.root.style.display = 'none';
  }

  private screen(html: string): void {
    this.root.innerHTML =
      '<div style="min-height:100%;box-sizing:border-box;display:flex;flex-direction:column;' +
      `align-items:center;justify-content:center;padding:28px 16px">${html}</div>`;
    this.root.style.display = 'block';
  }

  private button(label: string, id: string): string {
    return (
      `<button id="${id}" style="margin:10px;padding:12px 34px;font:700 18px 'Trebuchet MS';` +
      `background:#3a2f22;color:#e8dcc0;border:2px solid #6b6149;border-radius:6px;cursor:pointer">` +
      `${label}</button>`
    );
  }

  /** Set the applied (boot) difficulty so the select screen pre-highlights it. */
  setCurrentDifficulty(level: DifficultyLevel): void {
    this.current = level;
  }

  showTitle(): void {
    this.screen(`
      <h1 style="font-family:'Creepster',cursive;font-size:84px;letter-spacing:3px;margin:0;color:#cdb98a;
        text-shadow:0 0 22px #6a1212,0 0 6px #000">STUFFY FRIGHTS</h1>
      <p style="color:#8a7d65;letter-spacing:2px;margin-top:6px">the stuffed animals are awake</p>
      <div style="margin-top:36px">${this.button('PLAY', 'btn-play')}<br>${this.button('ESCAPE LOOP', 'btn-iron')}<br>${this.button('HOW TO PLAY', 'btn-how')}<br>${this.button('STATS', 'btn-stats')}</div>
      <p style="color:#7a6f58;max-width:430px;margin:16px auto 0;font-size:13px;line-height:1.5">
        Escape Loop: win all four frights back-to-back, Tuck-In through Stuffy FrightMare.
        One hug and you're back to the start.</p>
      <p style="position:absolute;bottom:10px;left:0;right:0;margin:0;color:#5f5746;
        font-size:12px;letter-spacing:1px">v${__APP_VERSION__}</p>
    `);
    this.root.querySelector('#btn-play')!.addEventListener('click', () => this.showDifficultySelect());
    this.root.querySelector('#btn-iron')!.addEventListener('click', () => this.onStartIronman?.());
    this.root.querySelector('#btn-how')!.addEventListener('click', () => this.showHowTo());
    this.root.querySelector('#btn-stats')!.addEventListener('click', () => this.onShowStats?.());
  }

  /**
   * Difficulty picker. Four level buttons in their accent fonts; the highlighted
   * level's tier + tuned-knobs description shows below and updates on hover/focus.
   * Choosing a level fires `onSelectDifficulty` (main persists + starts/reloads).
   */
  showDifficultySelect(): void {
    const buttons = DIFFICULTY_ORDER.map((lvl) => {
      const m = DIFFICULTY_META[lvl];
      const sel = lvl === this.current;
      return (
        `<button data-level="${lvl}" class="diff-opt" style="display:block;margin:8px auto;width:340px;` +
        `padding:12px 18px;font-family:${DIFFICULTY_FONTS[lvl]};font-size:26px;` +
        `background:${sel ? '#4a3c28' : '#2c241a'};color:#e8dcc0;` +
        `border:2px solid ${sel ? '#b59f6a' : '#5a5141'};border-radius:6px;cursor:pointer">` +
        `${m.name}</button>`
      );
    }).join('');
    this.screen(`
      <h2 style="font-family:'Creepster',cursive;letter-spacing:2px;color:#cdb98a;
        text-shadow:0 0 14px #6a1212">CHOOSE YOUR FRIGHT</h2>
      <div style="margin-top:14px">${buttons}</div>
      <div id="diff-desc" style="max-width:460px;min-height:84px;margin:14px auto 4px;
        color:#cfc3a2;line-height:1.5"></div>
      <div style="margin-top:10px">${this.button('BACK', 'btn-back')}</div>
    `);
    const desc = this.root.querySelector('#diff-desc') as HTMLDivElement;
    const paint = (lvl: DifficultyLevel) => {
      const m = DIFFICULTY_META[lvl];
      desc.innerHTML = `<b style="color:#d8c9a0">${m.name} — ${m.tier}.</b> ${m.description}`;
    };
    paint(this.current);
    this.root.querySelectorAll<HTMLButtonElement>('.diff-opt').forEach((b) => {
      const lvl = b.dataset.level as DifficultyLevel;
      b.addEventListener('mouseenter', () => paint(lvl));
      b.addEventListener('focus', () => paint(lvl));
      b.addEventListener('click', () => this.onSelectDifficulty?.(lvl));
    });
    this.root.querySelector('#btn-back')!.addEventListener('click', () => this.showTitle());
  }

  /** Stats screen: per-difficulty win % + best streak + games, plus ironman best. */
  showStats(summary: StatsSummary): void {
    const rows = DIFFICULTY_ORDER.map((lvl) => {
      const m = DIFFICULTY_META[lvl];
      const d = summary.perDifficulty[lvl];
      return (
        `<tr><td style="text-align:left;padding:4px 16px;color:#d8c9a0">${m.name}` +
        ` <span style="color:#7a6f58">· ${m.tier}</span></td>` +
        `<td style="padding:4px 16px">${d.winRate}%</td>` +
        `<td style="padding:4px 16px">${d.bestStreak}</td>` +
        `<td style="padding:4px 16px;color:#8a7d65">${d.games}</td></tr>`
      );
    }).join('');
    const im = summary.ironman;
    const reached = im.bestLevelReached ? DIFFICULTY_META[im.bestLevelReached].name : '—';
    this.screen(`
      <h2 style="font-family:'Creepster',cursive;letter-spacing:2px;color:#cdb98a;
        text-shadow:0 0 14px #6a1212">YOUR FRIGHTS</h2>
      <table style="margin:16px auto 6px;border-spacing:0;color:#cfc3a2">
        <tr style="color:#9a8d6c;font-size:13px;letter-spacing:1px">
          <td style="text-align:left;padding:4px 16px">DIFFICULTY</td>
          <td style="padding:4px 16px">WIN %</td>
          <td style="padding:4px 16px">BEST STREAK</td>
          <td style="padding:4px 16px">GAMES</td>
        </tr>
        ${rows}
      </table>
      <p style="color:#d8a35a;margin:6px auto">Escape Loop — best streak <b>${im.bestStreak}/${DIFFICULTY_ORDER.length}</b> · furthest reached <b>${reached}</b></p>
      <div style="margin-top:12px">${this.button('BACK', 'btn-back')}</div>
    `);
    this.root.querySelector('#btn-back')!.addEventListener('click', () => this.showTitle());
  }

  showHowTo(): void {
    this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">HOW TO SURVIVE</h2>
      ${CONTROLS_HTML}
      <div>${this.button('GOT IT — PLAY', 'btn-play')}</div>
    `);
    this.root.querySelector('#btn-play')!.addEventListener('click', () => this.showDifficultySelect());
  }

  showPause(): void {
    this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">PAUSED</h2>
      <p style="color:#8a7d65">the stuffies are waiting…</p>
      ${CONTROLS_HTML}
      <div>${this.button('KEEP PLAYING', 'btn-resume')}${this.button('MAIN MENU', 'btn-quit')}</div>
    `);
    this.root.querySelector('#btn-resume')!.addEventListener('click', () => this.onResume?.());
    this.root.querySelector('#btn-quit')!.addEventListener('click', () => this.onQuitToMenu?.());
  }

  showGameOver(enemyId: string, ironmanReset = false): void {
    const name = ENEMY_NAMES[enemyId] ?? 'SOMETHING SOFT';
    const ironLine = ironmanReset
      ? `<p style="color:#d8a35a;max-width:440px;margin:8px auto">Your Escape Loop is over — try again starts a fresh run at Tuck-In.</p>`
      : '';
    this.screen(`
      <h1 style="font-size:46px;letter-spacing:4px;color:#c0392b;text-shadow:0 0 14px #400">
        ${name} GOT YOU</h1>
      <p style="color:#8a7d65;max-width:440px;margin:14px auto">
        Squeezed in a very firm hug until everything went dark.<br>
        The house resets. The keys move. Try again?</p>
      ${ironLine}
      <div>${this.button('TRY AGAIN', 'btn-retry')}${this.button('MAIN MENU', 'btn-quit')}</div>
    `);
    this.root.querySelector('#btn-retry')!.addEventListener('click', () => this.onRetry?.());
    this.root.querySelector('#btn-quit')!.addEventListener('click', () => this.onQuitToMenu?.());
  }

  /**
   * Win screen. With `ironman` set, shows ladder progress + a CONTINUE button
   * (advance a rung) for a non-final win, or a gauntlet-complete message when
   * the whole ladder is cleared.
   */
  showWin(
    stats: { seconds: number; exitsTried: number },
    ironman: 'complete' | { rung: number; total: number; nextName: string } | null = null
  ): void {
    const mins = Math.floor(stats.seconds / 60);
    const secs = Math.round(stats.seconds % 60);
    let heading = 'YOU ESCAPED!';
    let ladderLine = '';
    let buttons = this.button('PLAY AGAIN', 'btn-retry');
    if (ironman === 'complete') {
      heading = 'ESCAPE LOOP COMPLETE!';
      ladderLine = `<p style="color:#d8a35a;max-width:460px;margin:6px auto">
        All four frights, back-to-back. The whole house fears <b>you</b> now.</p>`;
    } else if (ironman) {
      ladderLine = `<p style="color:#d8a35a;max-width:460px;margin:6px auto">
        Escape Loop ${ironman.rung}/${ironman.total} cleared — next up: <b>${ironman.nextName}</b>.</p>`;
      buttons = this.button(`CONTINUE → ${ironman.nextName}`, 'btn-continue');
    }
    this.screen(`
      <h1 style="font-size:52px;letter-spacing:5px;color:#7fbf6a;text-shadow:0 0 14px #042">
        ${heading}</h1>
      <p style="color:#a99c7c;max-width:460px;margin:14px auto;line-height:1.6">
        Out the front door and into the night, keys jingling.<br>
        Behind you, four fuzzy silhouettes crowd the doorway… waving?<br><br>
        <b>Time:</b> ${mins}m ${secs}s &nbsp;·&nbsp; <b>Doors tried:</b> ${stats.exitsTried} of 3</p>
      ${ladderLine}
      <div>${buttons}${this.button('MAIN MENU', 'btn-quit')}</div>
    `);
    this.root
      .querySelector('#btn-continue')
      ?.addEventListener('click', () => this.onContinueIronman?.());
    this.root.querySelector('#btn-retry')?.addEventListener('click', () => this.onRetry?.());
    this.root.querySelector('#btn-quit')!.addEventListener('click', () => this.onQuitToMenu?.());
  }
}
