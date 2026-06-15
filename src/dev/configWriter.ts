import { RigConfig } from '../enemies/rigWeights';
import { EnemyTuning } from '../enemies/tuningConfig';
import { EyeConfig } from '../enemies/eyeConfig';
import { serializeRig } from './rigEditorMath';

/**
 * Pure (no fs / DOM / three) helpers backing the dev write-to-source round-trip.
 * `replaceMarkedRegion` swaps the text between sentinel comment markers in a
 * source string; the `serialize*` helpers regenerate a config file's
 * marked-region body as a pasteable TS literal. The Vite middleware wraps these
 * with the fs read/write; the browser panel POSTs the serialized body. Keeping
 * the transform pure makes it unit-testable in the default node env.
 */

const START = (blockId: string): string => `// <apo:gen ${blockId}>`;
const END = '// </apo:gen>';

/**
 * Replace the lines strictly between `// <apo:gen ${blockId}>` and
 * `// </apo:gen>` with `body`, preserving the markers, their indentation, and
 * all surrounding code. Throws if either marker is missing or appears more than
 * once (an ambiguous region is never silently half-written).
 */
export function replaceMarkedRegion(source: string, blockId: string, body: string): string {
  const lines = source.split('\n');
  const startTok = START(blockId);
  const startIdxs: number[] = [];
  const endIdxs: number[] = [];
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (t === startTok) startIdxs.push(i);
    if (t === END) endIdxs.push(i);
  });
  if (startIdxs.length === 0) throw new Error(`missing start marker "${startTok}"`);
  if (startIdxs.length > 1) throw new Error(`duplicate start marker "${startTok}"`);
  const start = startIdxs[0];
  // The closing marker is the first `// </apo:gen>` after the start marker.
  const endAfter = endIdxs.filter((i) => i > start);
  if (endAfter.length === 0) throw new Error(`missing end marker "${END}" after "${startTok}"`);
  const end = endAfter[0];
  if (endIdxs.filter((i) => i > start && i <= end).length > 1) {
    throw new Error(`duplicate end marker "${END}"`);
  }
  const bodyLines = body.split('\n');
  const next = [...lines.slice(0, start + 1), ...bodyLines, ...lines.slice(end)];
  return next.join('\n');
}

/**
 * Resolve a client-supplied config path to an absolute path under `<repoRoot>/src/`,
 * or null if it escapes that root. Pure string logic (no node `path`) so it stays
 * importable in the browser bundle: rejects absolute paths, backslashes, and any
 * `.`/`..`/empty segment, and requires the first segment to be `src`.
 */
export function resolveSafeConfigPath(repoRoot: string, file: string): string | null {
  if (!file || file.startsWith('/') || file.includes('\\')) return null;
  const parts = file.split('/');
  if (parts[0] !== 'src') return null;
  if (parts.some((p) => p === '' || p === '.' || p === '..')) return null;
  return `${repoRoot}/${file}`;
}

/** Serialize a whole `RIG_CONFIG` record to its `export const` declaration. */
export function serializeRigConfigRecord(record: Record<string, RigConfig>): string {
  const entries = Object.entries(record)
    .map(([model, bones]) => serializeRig(model, bones))
    .join('\n');
  return `export const RIG_CONFIG: Record<string, RigConfig> = {\n${entries}\n};`;
}

/** A plain value → TS-literal string (numbers trimmed, object keys unquoted). */
export function tsLiteral(v: unknown): string {
  if (typeof v === 'number') return String(+v.toFixed(4));
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.map(tsLiteral).join(', ')}]`;
  if (v && typeof v === 'object') {
    const inner = Object.entries(v)
      .map(([k, val]) => `${k}: ${tsLiteral(val)}`)
      .join(', ');
    return `{ ${inner} }`;
  }
  return 'null';
}

/** Serialize a whole `EYE_CONFIG` record to its `export const` declaration. */
export function serializeEyeConfigRecord(record: Record<string, EyeConfig>): string {
  const entries = Object.entries(record)
    .map(([id, eye]) => `  ${id}: ${tsLiteral(eye)},`)
    .join('\n');
  return `export const EYE_CONFIG: Record<string, EyeConfig> = {\n${entries}\n};`;
}

/** Serialize a whole `ENEMY_TUNING` record to its `export const` declaration. */
export function serializeTuningRecord(record: Record<string, EnemyTuning>): string {
  const entries = Object.entries(record)
    .map(([id, tuning]) => `  ${id}: ${tsLiteral(tuning)},`)
    .join('\n');
  return `export const ENEMY_TUNING: Record<string, EnemyTuning> = {\n${entries}\n};`;
}
