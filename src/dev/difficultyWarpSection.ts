import { type AddSection, type DevOverlayCtx } from './DevOverlay';
import { DIFFICULTY_ORDER, DIFFICULTY_META } from '../core/difficulty';
import { FLOOR_NAMES } from '../world/layoutTypes';
import { selectRow } from './devPanel';

/**
 * Build the Difficulty + warp section: a difficulty dropdown that re-applies the
 * level live (and re-syncs every panel slider, since `applyDifficulty` resets
 * manual edits) and a floor dropdown that requests a warp via `devFlags.warpFloor`
 * (consumed and cleared by the main loop). Both are GLOBAL.
 */
export function buildDifficultyWarpSection(
  add: AddSection,
  ctx: DevOverlayCtx,
  syncAllRows: () => void
): void {
  add('Difficulty + warp', (body, register) => {
    let current = ctx.difficulty;
    const difficulty = register(
      selectRow(
        'difficulty',
        DIFFICULTY_ORDER.map((d) => ({ value: d, label: `${DIFFICULTY_META[d].tier}: ${DIFFICULTY_META[d].name}` })),
        () => current,
        (v) => {
          current = v;
          ctx.applyDifficulty(v);
          syncAllRows(); // applyDifficulty resets manual edits → refresh displayed values
        }
      )
    );
    body.appendChild(difficulty.el);

    const note = document.createElement('div');
    note.textContent = 'GLOBAL — switching difficulty resets manual knob edits.';
    note.style.cssText = 'color:#a86;font-size:10px;margin:2px 0 4px';
    body.appendChild(note);

    const warp = register(
      selectRow(
        'warp to floor',
        FLOOR_NAMES.map((n, i) => ({ value: String(i), label: n })),
        () => String(ctx.player.floorIndex),
        (v) => {
          ctx.devFlags.warpFloor = Number(v);
        }
      )
    );
    body.appendChild(warp.el);
  });
}
