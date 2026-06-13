import { describe, it, expect, afterEach, vi } from 'vitest';
import { isMobile, isVRCapable, recommendedPixelRatio } from './Platform';

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubNavigator(nav: Record<string, unknown>): void {
  vi.stubGlobal('navigator', nav);
}

describe('Platform.isMobile', () => {
  it('is true for a phone userAgent', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', maxTouchPoints: 5 });
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    expect(isMobile()).toBe(true);
  });

  it('is false for a desktop userAgent with no touch', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', maxTouchPoints: 0 });
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    expect(isMobile()).toBe(false);
  });

  it('is false for a touch-capable laptop with a fine pointer', () => {
    // Touch points present, but the pointer is fine (a real mouse) and the UA is desktop.
    stubNavigator({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)', maxTouchPoints: 10 });
    vi.stubGlobal('matchMedia', () => ({ matches: false })); // (pointer: coarse) does not match
    expect(isMobile()).toBe(false);
  });
});

describe('Platform.recommendedPixelRatio', () => {
  it('caps at 1.5 on mobile', () => {
    stubNavigator({ userAgent: 'Android', maxTouchPoints: 5 });
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    vi.stubGlobal('window', { devicePixelRatio: 3 });
    expect(recommendedPixelRatio()).toBe(1.5);
  });

  it('caps at 2 on desktop', () => {
    stubNavigator({ userAgent: 'X11; Linux', maxTouchPoints: 0 });
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('window', { devicePixelRatio: 3 });
    expect(recommendedPixelRatio()).toBe(2);
  });
});

describe('Platform.isVRCapable', () => {
  it('resolves false when WebXR is absent', async () => {
    stubNavigator({ userAgent: 'X11; Linux', maxTouchPoints: 0 });
    expect(await isVRCapable()).toBe(false);
  });

  it('resolves true when an immersive-vr session is supported', async () => {
    stubNavigator({
      userAgent: 'OculusBrowser',
      maxTouchPoints: 0,
      xr: { isSessionSupported: () => Promise.resolve(true) },
    });
    expect(await isVRCapable()).toBe(true);
  });

  it('resolves false (not throws) when the query rejects', async () => {
    stubNavigator({
      userAgent: 'OculusBrowser',
      maxTouchPoints: 0,
      xr: { isSessionSupported: () => Promise.reject(new Error('nope')) },
    });
    expect(await isVRCapable()).toBe(false);
  });
});
