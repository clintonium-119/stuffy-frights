import { describe, it, expect } from 'vitest';
import { replaceMarkedRegion, serializeRigConfigRecord, resolveSafeConfigPath } from './configWriter';
import { RigConfig } from '../enemies/rigWeights';

describe('replaceMarkedRegion', () => {
  const wrap = (inner: string): string =>
    ['import { X } from "y";', '// <apo:gen blk>', inner, '// </apo:gen>', 'export const after = 1;'].join(
      '\n'
    );

  it('replaces only the marked region, preserving surrounding code', () => {
    const src = wrap('OLD BODY');
    const out = replaceMarkedRegion(src, 'blk', 'NEW BODY');
    expect(out).toBe(wrap('NEW BODY'));
    expect(out).toContain('import { X } from "y";');
    expect(out).toContain('export const after = 1;');
    expect(out).not.toContain('OLD BODY');
  });

  it('is idempotent when the body is unchanged', () => {
    const src = wrap('BODY');
    expect(replaceMarkedRegion(src, 'blk', 'BODY')).toBe(src);
  });

  it('handles a multi-line replacement body', () => {
    const out = replaceMarkedRegion(wrap('a'), 'blk', 'l1\nl2\nl3');
    expect(out).toContain('// <apo:gen blk>\nl1\nl2\nl3\n// </apo:gen>');
  });

  it('throws on a missing start marker', () => {
    expect(() => replaceMarkedRegion('no markers here', 'blk', 'x')).toThrow(/missing start marker/);
  });

  it('throws on a missing end marker', () => {
    const src = ['// <apo:gen blk>', 'body'].join('\n');
    expect(() => replaceMarkedRegion(src, 'blk', 'x')).toThrow(/missing end marker/);
  });

  it('throws on a duplicate start marker', () => {
    const src = ['// <apo:gen blk>', '// <apo:gen blk>', '// </apo:gen>'].join('\n');
    expect(() => replaceMarkedRegion(src, 'blk', 'x')).toThrow(/duplicate start marker/);
  });

  it('matches markers regardless of leading indentation', () => {
    const src = ['  // <apo:gen blk>', '  old', '  // </apo:gen>'].join('\n');
    const out = replaceMarkedRegion(src, 'blk', '  new');
    expect(out).toBe(['  // <apo:gen blk>', '  new', '  // </apo:gen>'].join('\n'));
  });
});

describe('resolveSafeConfigPath', () => {
  const root = '/repo';
  it('accepts a path under src/', () => {
    expect(resolveSafeConfigPath(root, 'src/enemies/rigConfig.ts')).toBe('/repo/src/enemies/rigConfig.ts');
  });
  it('rejects traversal', () => {
    expect(resolveSafeConfigPath(root, '../etc/passwd')).toBeNull();
    expect(resolveSafeConfigPath(root, 'src/../package.json')).toBeNull();
  });
  it('rejects absolute paths', () => {
    expect(resolveSafeConfigPath(root, '/etc/passwd')).toBeNull();
  });
  it('rejects paths outside src/', () => {
    expect(resolveSafeConfigPath(root, 'package.json')).toBeNull();
    expect(resolveSafeConfigPath(root, 'docs/index.html')).toBeNull();
  });
  it('rejects backslashes and empty input', () => {
    expect(resolveSafeConfigPath(root, 'src\\enemies\\x.ts')).toBeNull();
    expect(resolveSafeConfigPath(root, '')).toBeNull();
  });
});

describe('serializeRigConfigRecord', () => {
  it('emits a stable export const declaration for a fixture record', () => {
    const fixture: Record<string, RigConfig> = {
      pou: [
        { name: 'root', pivot: [0.5, 0.4, 0.5] },
        { name: 'head', pivot: [0.5, 0.64, 0.42], box: { min: [0.12, 0.64, 0.28], max: [0.88, 1, 1] }, falloff: 0.1 },
      ],
    };
    const out = serializeRigConfigRecord(fixture);
    const expected = [
      'export const RIG_CONFIG: Record<string, RigConfig> = {',
      '  pou: [',
      "    { name: 'root', pivot: [0.5, 0.4, 0.5] },",
      "    { name: 'head', pivot: [0.5, 0.64, 0.42], box: { min: [0.12, 0.64, 0.28], max: [0.88, 1, 1] }, falloff: 0.1 },",
      '  ],',
      '};',
    ].join('\n');
    expect(out).toBe(expected);
  });

  it('round-trips through the marked region', () => {
    const fixture: Record<string, RigConfig> = {
      llama: [{ name: 'root', pivot: [0.5, 0.5, 0.5] }],
    };
    const file = [
      '// <apo:gen rigConfig>',
      'export const RIG_CONFIG: Record<string, RigConfig> = {',
      '  STALE: [],',
      '};',
      '// </apo:gen>',
    ].join('\n');
    const out = replaceMarkedRegion(file, 'rigConfig', serializeRigConfigRecord(fixture));
    expect(out).toContain('llama: [');
    expect(out).not.toContain('STALE');
  });
});
