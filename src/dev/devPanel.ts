import { DevFlags } from './devFlags';

/**
 * Hand-rolled DOM toolkit for the in-game dev overlay — collapsible sections and
 * slider / checkbox / select / color rows promoted from the floors-editor row
 * factories, plus pure formatters and a localStorage (de)serializer. No
 * third-party panel library; importing this module mounts nothing.
 */

/** What a tuned value affects, surfaced as a tag on its row. */
export type DevScope = 'global' | 'floor' | 'enemy';

/** Human label for a scope tag (so a floor-scoped knob isn't mistaken global). */
export function scopeLabel(scope: DevScope): string {
  switch (scope) {
    case 'global':
      return 'GLOBAL';
    case 'floor':
      return 'FLOOR';
    case 'enemy':
      return 'per-enemy';
  }
}

/** Clamp a value into [min, max] (NaN → min). */
export function clampValue(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/** Compact numeric label: trims trailing zeros, caps at 3 decimals. */
export function formatValue(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return parseFloat(value.toFixed(3)).toString();
}

const ROW = 'display:flex;justify-content:space-between;align-items:center;gap:6px;margin:2px 0';
const TAG: Record<DevScope, string> = {
  global: '#6a7',
  floor: '#a86',
  enemy: '#86a',
};

function scopeTag(scope?: DevScope): HTMLElement | null {
  if (!scope) return null;
  const s = document.createElement('span');
  s.textContent = scopeLabel(scope);
  s.style.cssText = `font-size:9px;color:${TAG[scope]};border:1px solid ${TAG[scope]};border-radius:3px;padding:0 3px;opacity:0.85`;
  return s;
}

/** A collapsible section (`<details>`) the overlay groups rows under. */
export interface DevSection {
  el: HTMLDetailsElement;
  body: HTMLElement;
  readonly open: boolean;
  setOpen(open: boolean): void;
}

export function section(title: string, onToggle?: (open: boolean) => void): DevSection {
  const el = document.createElement('details');
  el.style.cssText = 'margin:4px 0;border-top:1px solid #1c232c';
  const summary = document.createElement('summary');
  summary.textContent = title;
  summary.style.cssText = 'cursor:pointer;color:#8af;padding:3px 0;user-select:none';
  const body = document.createElement('div');
  body.style.cssText = 'padding:2px 0 4px 4px';
  el.append(summary, body);
  el.ontoggle = () => onToggle?.(el.open);
  return {
    el,
    body,
    get open() {
      return el.open;
    },
    setOpen(open: boolean) {
      el.open = open;
    },
  };
}

/** A row that can re-read its bound value after an external change. */
export interface SyncRow {
  el: HTMLElement;
  sync(): void;
}

/** Label + range + number, bound live to a getter/setter over `config`. */
export function sliderRow(
  label: string,
  get: () => number,
  set: (v: number) => void,
  opts: { min: number; max: number; step: number; scope?: DevScope }
): SyncRow {
  const row = document.createElement('label');
  row.style.cssText = ROW;
  const name = document.createElement('span');
  name.textContent = label;
  name.style.cssText = 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis';
  const range = document.createElement('input');
  range.type = 'range';
  range.min = String(opts.min);
  range.max = String(opts.max);
  range.step = String(opts.step);
  range.style.cssText = 'flex:1';
  const num = document.createElement('input');
  num.type = 'number';
  num.step = String(opts.step);
  num.style.cssText = 'width:56px;background:#11161c;color:#cde;border:1px solid #2a333d';
  const apply = (raw: number) => {
    const v = clampValue(raw, opts.min, opts.max);
    set(v);
    range.value = String(v);
    num.value = formatValue(v);
  };
  range.oninput = () => apply(+range.value);
  num.oninput = () => apply(+num.value);
  const tag = scopeTag(opts.scope);
  row.append(name, ...(tag ? [tag] : []), range, num);
  const sync = () => {
    const v = get();
    range.value = String(v);
    num.value = formatValue(v);
  };
  sync();
  return { el: row, sync };
}

/** Label + checkbox bound to a boolean getter/setter. */
export function checkboxRow(label: string, get: () => boolean, set: (v: boolean) => void): SyncRow {
  const row = document.createElement('label');
  row.style.cssText = ROW + ';cursor:pointer';
  const name = document.createElement('span');
  name.textContent = label;
  name.style.flex = '1';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.onchange = () => set(box.checked);
  row.append(name, box);
  const sync = () => {
    box.checked = get();
  };
  sync();
  return { el: row, sync };
}

/** Label + `<select>` over string-valued options. */
export function selectRow<T extends string>(
  label: string,
  options: Array<{ value: T; label: string }>,
  get: () => T,
  set: (v: T) => void
): SyncRow {
  const row = document.createElement('label');
  row.style.cssText = ROW;
  const name = document.createElement('span');
  name.textContent = label;
  name.style.flex = '1';
  const sel = document.createElement('select');
  sel.style.cssText = 'background:#11161c;color:#cde;border:1px solid #2a333d';
  for (const o of options) {
    const opt = document.createElement('option');
    opt.value = o.value;
    opt.textContent = o.label;
    sel.appendChild(opt);
  }
  sel.onchange = () => set(sel.value as T);
  row.append(name, sel);
  const sync = () => {
    sel.value = get();
  };
  sync();
  return { el: row, sync };
}

/** Label + color input bound to a hex-number getter/setter. */
export function colorRow(
  label: string,
  get: () => number,
  set: (v: number) => void,
  scope?: DevScope
): SyncRow {
  const row = document.createElement('label');
  row.style.cssText = ROW;
  const name = document.createElement('span');
  name.textContent = label;
  name.style.flex = '1';
  const inp = document.createElement('input');
  inp.type = 'color';
  inp.oninput = () => set(parseInt(inp.value.slice(1), 16));
  const tag = scopeTag(scope);
  row.append(name, ...(tag ? [tag] : []), inp);
  const sync = () => {
    inp.value = `#${(get() & 0xffffff).toString(16).padStart(6, '0')}`;
  };
  sync();
  return { el: row, sync };
}

// ---- session persistence (localStorage) ------------------------------------

/** Persisted overlay session state: cheat flags + which sections are open. */
export interface DevOverlayState {
  flags: DevFlags;
  openSections: Record<string, boolean>;
}

export function serializeDevState(state: DevOverlayState): string {
  return JSON.stringify(state);
}

/**
 * Parse persisted overlay state, tolerating absent/malformed input — always
 * returns a valid object (defaults applied) and never throws.
 */
export function deserializeDevState(raw: string | null): DevOverlayState {
  const fallback: DevOverlayState = {
    flags: { invincible: false, invisible: false, inaudible: false, revealEnemies: false, warpFloor: null },
    openSections: {},
  };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<DevOverlayState>;
    const f = (parsed.flags ?? {}) as Partial<DevFlags>;
    return {
      flags: {
        invincible: !!f.invincible,
        invisible: !!f.invisible,
        inaudible: !!f.inaudible,
        revealEnemies: !!f.revealEnemies,
        warpFloor: typeof f.warpFloor === 'number' ? f.warpFloor : null,
      },
      openSections:
        parsed.openSections && typeof parsed.openSections === 'object'
          ? (parsed.openSections as Record<string, boolean>)
          : {},
    };
  } catch {
    return fallback;
  }
}
