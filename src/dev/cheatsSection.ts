import { type AddSection, type DevOverlayCtx } from './DevOverlay';
import { checkboxRow } from './devPanel';

/**
 * Build the Cheats section: checkboxes bound to the `devFlags` singleton. The
 * gameplay read-sites (catchable / canSee / noiseLevel / map markers) live in
 * `main.ts`, each DEV-guarded so they fold away in production.
 */
export function buildCheatsSection(add: AddSection, ctx: DevOverlayCtx): void {
  add('Cheats', (body, register) => {
    const f = ctx.devFlags;
    const toggles: Array<[string, () => boolean, (v: boolean) => void]> = [
      ['invincible (never caught)', () => f.invincible, (v) => (f.invincible = v)],
      ['invisible (never seen)', () => f.invisible, (v) => (f.invisible = v)],
      ['inaudible (never heard)', () => f.inaudible, (v) => (f.inaudible = v)],
      ['reveal enemies on map', () => f.revealEnemies, (v) => (f.revealEnemies = v)],
    ];
    for (const [label, get, set] of toggles) {
      const row = register(checkboxRow(label, get, set));
      body.appendChild(row.el);
    }
  });
}
