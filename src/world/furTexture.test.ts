import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { furParams, furTexture, FurStyle } from './furTexture';

const SMOOTH: FurStyle = { base: '#d9b286', tip: '#ecc89e', fiberLen: 4, density: 0.6 };
const SHAG: FurStyle = { base: '#2f9e86', tip: '#4fc4ac', fiberLen: 22, density: 1.6, curl: 0.4 };
const FLEECE: FurStyle = { base: '#c69a55', tip: '#e0b97a', fiberLen: 30, density: 1.4, curl: 0.9 };

describe('furParams', () => {
  it('derives distinct params for distinct plush styles', () => {
    const a = furParams(SMOOTH);
    const b = furParams(SHAG);
    const c = furParams(FLEECE);
    expect(a.fiberLen).not.toBe(b.fiberLen);
    expect(b.curl).not.toBe(c.curl);
    // The three styles map to three distinct stroke densities.
    expect(new Set([a.strokeCount, b.strokeCount, c.strokeCount]).size).toBe(3);
  });

  it('defaults shade to a darkened base and keeps tip', () => {
    const p = furParams(SMOOTH);
    expect(p.shade).toMatch(/^#[0-9a-f]{6}$/i);
    expect(p.shade).not.toBe(p.base);
    expect(p.tip).toBe('#ecc89e');
  });

  it('clamps curl, density, thickness, and fibre length to sane ranges', () => {
    const p = furParams({ base: '#fff', tip: '#fff', fiberLen: 9999, density: 9, curl: 9, thickness: 99 });
    expect(p.curl).toBeLessThanOrEqual(1);
    expect(p.thickness).toBeLessThanOrEqual(6);
    expect(p.fiberLen).toBeLessThanOrEqual(p.size * 0.5);
    expect(p.strokeCount).toBeLessThanOrEqual(60000);
  });
});

describe('furTexture', () => {
  it('returns an albedo + matching normal (headless-safe)', () => {
    const { map, normal } = furTexture(SHAG);
    expect(map).toBeInstanceOf(THREE.Texture);
    expect(normal).toBeInstanceOf(THREE.Texture);
    expect(map.colorSpace).toBe(THREE.SRGBColorSpace);
  });
});
