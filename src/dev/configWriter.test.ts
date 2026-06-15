import { describe, it, expect } from 'vitest';
import {
  replaceMarkedRegion,
  serializeRigConfigRecord,
  resolveSafeConfigPath,
  serializeTuningRecord,
  serializeEyeConfigRecord,
} from './configWriter';
import { EnemyTuning } from '../enemies/tuningConfig';
import { EyeConfig } from '../enemies/eyeConfig';
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
      newYama: [{ name: 'root', pivot: [0.5, 0.5, 0.5] }],
    };
    const file = [
      '// <apo:gen rigConfig>',
      'export const RIG_CONFIG: Record<string, RigConfig> = {',
      '  STALE: [],',
      '};',
      '// </apo:gen>',
    ].join('\n');
    const out = replaceMarkedRegion(file, 'rigConfig', serializeRigConfigRecord(fixture));
    expect(out).toContain('newYama: [');
    expect(out).not.toContain('STALE');
  });
});

describe('serializeTuningRecord', () => {
  const anim = {
    swingRate: 2.6,
    legSwing: 0.45,
    armSwing: 0.5,
    headYaw: 0.7,
    headPitch: 0.7,
    bobRate: 3.2,
    bob: 0.18,
    squash: 0.28,
    rock: 0,
  };
  const gameplay = { speedMult: 1.05, visionMult: 1, hearingMult: 1, threatMult: 1, scaleMult: 1.1 };
  const tuning: EnemyTuning = { anim, height: 0.914, gameplay };

  it('emits the ENEMY_TUNING declaration with unquoted keys + trimmed numbers', () => {
    const out = serializeTuningRecord({ pou: tuning });
    expect(out).toContain('export const ENEMY_TUNING: Record<string, EnemyTuning> = {');
    expect(out).toContain('pou: { anim: { swingRate: 2.6, legSwing: 0.45');
    expect(out).toContain('height: 0.914');
    expect(out).toContain('gameplay: { speedMult: 1.05');
    expect(out).toContain('scaleMult: 1.1 } },');
  });

  it('round-trips deep-equal through the marked region', () => {
    const record: Record<string, EnemyTuning> = { pou: tuning, newYama: tuning };
    const file = ['// <apo:gen enemyTuning>', 'export const ENEMY_TUNING = { STALE: 1 };', '// </apo:gen>'].join('\n');
    const body = serializeTuningRecord(record);
    const out = replaceMarkedRegion(file, 'enemyTuning', body);
    expect(out).not.toContain('STALE');
    // Reconstruct the object literal and check structural equality.
    const literal = body.slice(body.indexOf('{'), body.lastIndexOf('}') + 1);
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return ${literal}`)() as Record<string, EnemyTuning>;
    expect(parsed.pou.anim).toEqual(anim);
    expect(parsed.pou.height).toBe(0.914);
    expect(parsed.pou.gameplay).toEqual(gameplay);
    expect(parsed.newYama.gameplay.scaleMult).toBe(1.1);
  });
});

describe('serializeEyeConfigRecord', () => {
  const eye: EyeConfig = { left: [0.4, 0.82, 0.92], right: [0.6, 0.82, 0.92], radius: 0.05 };

  it('emits the EYE_CONFIG declaration with unquoted keys + trimmed numbers', () => {
    const out = serializeEyeConfigRecord({ pou: eye });
    expect(out).toContain('export const EYE_CONFIG: Record<string, EyeConfig> = {');
    expect(out).toContain('pou: { left: [0.4, 0.82, 0.92], right: [0.6, 0.82, 0.92], radius: 0.05 },');
  });

  it('round-trips deep-equal through the marked region', () => {
    const record: Record<string, EyeConfig> = { pou: eye, newYama: { left: [0.45, 0.85, 0.95], right: [0.6, 0.85, 0.95] } };
    const file = ['// <apo:gen eyeConfig>', 'export const EYE_CONFIG = { STALE: 1 };', '// </apo:gen>'].join('\n');
    const body = serializeEyeConfigRecord(record);
    const out = replaceMarkedRegion(file, 'eyeConfig', body);
    expect(out).not.toContain('STALE');
    const literal = body.slice(body.indexOf('{'), body.lastIndexOf('}') + 1);
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return ${literal}`)() as Record<string, EyeConfig>;
    expect(parsed.pou).toEqual(eye);
    expect(parsed.newYama.radius).toBeUndefined();
    expect(parsed.newYama.left).toEqual([0.45, 0.85, 0.95]);
  });

  it('serializes hand-painted stamps', () => {
    const withStamps: EyeConfig = {
      left: [0.4, 0.8, 0.9],
      right: [0.6, 0.8, 0.9],
      stamps: [{ u: 0.5, v: 0.29, r: 0.08 }, { u: 0.81, v: 0.31, r: 0.06 }],
    };
    const body = serializeEyeConfigRecord({ pou: withStamps });
    const literal = body.slice(body.indexOf('{'), body.lastIndexOf('}') + 1);
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return ${literal}`)() as Record<string, EyeConfig>;
    expect(parsed.pou.stamps).toEqual(withStamps.stamps);
  });
});
