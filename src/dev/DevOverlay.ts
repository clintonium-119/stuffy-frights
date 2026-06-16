import { type GameConfig } from '../core/config';
import { type DifficultyLevel } from '../core/difficulty';
import { PlayerController } from '../player/PlayerController';
import { Director } from '../ai/Director';
import { MapOverlay } from '../ui/MapOverlay';
import { DevFlags } from './devFlags';
import {
  DevSection,
  SyncRow,
  section,
  serializeDevState,
  deserializeDevState,
} from './devPanel';
import { buildAiSection } from './aiSection';
import { buildAtmosphereSection } from './atmosphereSection';
import { buildDifficultyWarpSection } from './difficultyWarpSection';
import { buildCheatsSection } from './cheatsSection';

/** Registers a collapsible section; section builders (per phase) receive this. */
export type AddSection = (
  title: string,
  build: (body: HTMLElement, register: (r: SyncRow) => SyncRow) => void
) => void;

/** Live handles the overlay sections bind to. Dev-only; never used in prod. */
export interface DevOverlayCtx {
  config: GameConfig;
  devFlags: DevFlags;
  player: PlayerController;
  director: Director;
  map: MapOverlay;
  applyDifficulty: (level: DifficultyLevel) => void;
  /** The difficulty the run booted at — initial value for the selector. */
  difficulty: DifficultyLevel;
}

const STORAGE_KEY = 'sf-dev-overlay';

/**
 * Build and mount the in-game dev tuning overlay: a fixed, collapsible panel
 * toggled by the backtick key (hidden by default), with one collapsible section
 * per concern that later phases populate. Cheat-flag + open-section state is
 * restored from / saved to localStorage. Mounted only under `import.meta.env.DEV`
 * via a dynamic import, so none of this reaches the production bundle.
 */
export function mountDevOverlay(ctx: DevOverlayCtx): void {
  const restored = deserializeDevState(safeRead());
  Object.assign(ctx.devFlags, restored.flags); // apply persisted cheats

  const panel = document.createElement('div');
  panel.style.cssText =
    'position:fixed;top:8px;right:8px;width:300px;max-height:92vh;overflow-y:auto;overflow-x:hidden;' +
    'background:#0b0e12f2;color:#cdd;font:11px ui-monospace,monospace;padding:10px;border-radius:8px;' +
    'z-index:50;display:none';
  const header = document.createElement('div');
  header.textContent = 'DEV OVERLAY  ·  ` to toggle';
  header.style.cssText = 'color:#8af;font-weight:bold;margin-bottom:4px';
  const hint = document.createElement('div');
  hint.textContent = 'Live edits are in-memory; switching difficulty resets them.';
  hint.style.cssText = 'color:#667;margin-bottom:6px;font-size:10px';
  panel.append(header, hint);
  document.body.appendChild(panel);

  // Section + row registry — later phases call addSection(...); difficulty
  // re-sync calls syncAllRows() after applyDifficulty.
  const allRows: SyncRow[] = [];
  const sections: Array<{ title: string; sec: DevSection }> = [];

  const save = (): void => {
    const openSections: Record<string, boolean> = {};
    for (const { title, sec } of sections) openSections[title] = sec.open;
    safeWrite(serializeDevState({ flags: ctx.devFlags, openSections }));
  };

  /** Register a collapsible section; `build` adds rows and registers them for re-sync. */
  function addSection(title: string, build: (body: HTMLElement, register: (r: SyncRow) => SyncRow) => void): void {
    const sec = section(title, save);
    sec.setOpen(restored.openSections[title] ?? false);
    build(sec.body, (r) => {
      allRows.push(r);
      return r;
    });
    sections.push({ title, sec });
    panel.appendChild(sec.el);
  }

  const syncAllRows = (): void => {
    for (const r of allRows) r.sync();
  };

  // Persist on any control change (checkboxes/sliders/selects) + section toggle.
  panel.addEventListener('change', save);

  // Sections (one concern each). Later phases add their builders here.
  buildAiSection(addSection, ctx);
  buildAtmosphereSection(addSection, ctx);
  buildDifficultyWarpSection(addSection, ctx, syncAllRows);
  buildCheatsSection(addSection, ctx);

  // Backtick toggles the panel; release pointer-lock while open so the cursor
  // can reach the controls. The keypress is consumed so game input never sees it.
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Backquote') return;
    e.preventDefault();
    e.stopPropagation();
    const opening = panel.style.display === 'none';
    panel.style.display = opening ? 'block' : 'none';
    if (opening && document.pointerLockElement) document.exitPointerLock();
  });
}

function safeRead(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeWrite(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage may be unavailable (private mode); persistence is best-effort.
  }
}
