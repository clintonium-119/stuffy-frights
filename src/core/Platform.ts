/**
 * Platform detection so the boot path can pick controls + renderer settings.
 * Mobile is decided synchronously (UA + coarse pointer); VR capability is
 * async (WebXR feature query). Every navigator/window access is wrapped in a
 * function — nothing is read at module load — so the detection is stubbable in
 * headless tests.
 */

const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile/i;

/**
 * True on a phone/tablet held in the hand. Combines the userAgent hint with a
 * coarse-pointer / touch check so a touch-capable laptop with a mouse reads as
 * desktop, while an iPadOS device that lies with a desktop UA still reads as
 * mobile via its touch points.
 */
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const uaMatch = MOBILE_UA.test(navigator.userAgent);
  const touch = navigator.maxTouchPoints > 0;
  const coarse =
    typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)').matches : touch;
  return uaMatch || (touch && coarse);
}

const XR_BROWSER_UA = /OculusBrowser|Quest|Pico|Wolvic|VR/i;

/**
 * True for a dedicated headset browser (Meta Quest, Pico, Wolvic, …). Used to
 * keep the Enter-VR button off ordinary phones — which may report immersive-vr
 * "supported" yet have no headset — while still showing it on real HMDs.
 */
export function isXRBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return XR_BROWSER_UA.test(navigator.userAgent);
}

/**
 * Resolves true when the device can present an immersive-vr WebXR session.
 * Resolves false (never rejects) when WebXR is absent or the query throws.
 */
export async function isVRCapable(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.xr) return false;
  try {
    return await navigator.xr.isSessionSupported('immersive-vr');
  } catch {
    return false;
  }
}

/**
 * Renderer pixel-ratio cap: 1.5 on mobile (perf), 2 on desktop (matches the
 * prior Engine default). Always clamped to the device's own ratio.
 */
export function recommendedPixelRatio(): number {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  return isMobile() ? Math.min(dpr, 1.5) : Math.min(dpr, 2);
}
