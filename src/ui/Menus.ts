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
  /** Any first interaction (audio unlock). */
  onFirstInteraction: (() => void) | null = null;
  private interacted = false;

  constructor(ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'clickable';
    this.root.style.cssText =
      'position:absolute;inset:0;display:none;align-items:center;justify-content:center;' +
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
    this.root.innerHTML = `<div>${html}</div>`;
    this.root.style.display = 'flex';
  }

  private button(label: string, id: string): string {
    return (
      `<button id="${id}" style="margin:10px;padding:12px 34px;font:700 18px 'Trebuchet MS';` +
      `background:#3a2f22;color:#e8dcc0;border:2px solid #6b6149;border-radius:6px;cursor:pointer">` +
      `${label}</button>`
    );
  }

  showTitle(): void {
    this.screen(`
      <h1 style="font-size:64px;letter-spacing:6px;margin:0;color:#d8c9a0;
        text-shadow:0 0 18px #5a1010,0 0 4px #000">STUFFY FRIGHTS</h1>
      <p style="color:#8a7d65;letter-spacing:2px;margin-top:6px">the stuffed animals are awake</p>
      <div style="margin-top:36px">${this.button('PLAY', 'btn-play')}<br>${this.button('HOW TO PLAY', 'btn-how')}</div>
    `);
    this.root.querySelector('#btn-play')!.addEventListener('click', () => this.onStart?.());
    this.root.querySelector('#btn-how')!.addEventListener('click', () => this.showHowTo());
  }

  showHowTo(): void {
    this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">HOW TO SURVIVE</h2>
      ${CONTROLS_HTML}
      <div>${this.button('GOT IT — PLAY', 'btn-play')}</div>
    `);
    this.root.querySelector('#btn-play')!.addEventListener('click', () => this.onStart?.());
  }

  showPause(): void {
    this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">PAUSED</h2>
      <p style="color:#8a7d65">the stuffies are waiting…</p>
      ${CONTROLS_HTML}
      <div>${this.button('KEEP PLAYING', 'btn-resume')}</div>
    `);
    this.root.querySelector('#btn-resume')!.addEventListener('click', () => this.onResume?.());
  }

  showGameOver(enemyId: string): void {
    const name = ENEMY_NAMES[enemyId] ?? 'SOMETHING SOFT';
    this.screen(`
      <h1 style="font-size:46px;letter-spacing:4px;color:#c0392b;text-shadow:0 0 14px #400">
        ${name} GOT YOU</h1>
      <p style="color:#8a7d65;max-width:440px;margin:14px auto">
        Squeezed in a very firm hug until everything went dark.<br>
        The house resets. The keys move. Try again?</p>
      <div>${this.button('TRY AGAIN', 'btn-retry')}</div>
    `);
    this.root.querySelector('#btn-retry')!.addEventListener('click', () => this.onRetry?.());
  }

  showWin(stats: { seconds: number; exitsTried: number }): void {
    const mins = Math.floor(stats.seconds / 60);
    const secs = Math.round(stats.seconds % 60);
    this.screen(`
      <h1 style="font-size:52px;letter-spacing:5px;color:#7fbf6a;text-shadow:0 0 14px #042">
        YOU ESCAPED!</h1>
      <p style="color:#a99c7c;max-width:460px;margin:14px auto;line-height:1.6">
        Out the front door and into the night, keys jingling.<br>
        Behind you, four fuzzy silhouettes crowd the doorway… waving?<br><br>
        <b>Time:</b> ${mins}m ${secs}s &nbsp;·&nbsp; <b>Doors tried:</b> ${stats.exitsTried} of 3</p>
      <div>${this.button('PLAY AGAIN', 'btn-retry')}</div>
    `);
    this.root.querySelector('#btn-retry')!.addEventListener('click', () => this.onRetry?.());
  }
}
