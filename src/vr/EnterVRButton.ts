/**
 * Minimal "ENTER VR" button, shown on the title only when the device reports
 * immersive-vr support. Clicking requests the session and hands it to the
 * renderer; the renderer's own sessionstart/sessionend events drive the rest
 * (wired in main). Procedural styling to match the menu — no asset.
 */
import * as THREE from 'three';
import { isVRCapable, isMobile, isXRBrowser } from '../core/Platform';

/**
 * Show Enter-VR only where a headset actually exists: a dedicated XR browser
 * (Quest/Pico/…) or desktop with a tethered HMD. Ordinary phones can report
 * immersive-vr "supported" with no headset, so they're excluded.
 */
async function shouldOfferVR(): Promise<boolean> {
  if (isMobile() && !isXRBrowser()) return false;
  return isVRCapable();
}

export class EnterVRButton {
  private button: HTMLButtonElement;

  constructor(ui: HTMLElement, private readonly renderer: THREE.WebGLRenderer) {
    this.button = document.createElement('button');
    this.button.textContent = 'ENTER VR';
    this.button.className = 'clickable';
    this.button.style.cssText =
      "position:absolute;left:50%;bottom:64px;transform:translateX(-50%);display:none;" +
      "padding:12px 34px;font:700 18px 'Trebuchet MS';background:#26303a;color:#cfe3ff;" +
      'border:2px solid #4a6b86;border-radius:6px;cursor:pointer;z-index:20';
    ui.appendChild(this.button);

    this.button.addEventListener('click', () => this.enterVR());

    void shouldOfferVR().then((ok) => {
      if (ok) this.button.style.display = 'block';
    });
  }

  show(): void {
    void shouldOfferVR().then((ok) => {
      if (ok) this.button.style.display = 'block';
    });
  }

  hide(): void {
    this.button.style.display = 'none';
  }

  private async enterVR(): Promise<void> {
    if (!navigator.xr) return;
    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor'],
      });
      await this.renderer.xr.setSession(session);
      this.hide();
    } catch {
      // User declined or the device refused — stay on the flat title.
    }
  }
}
