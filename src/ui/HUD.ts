/**
 * In-run chrome: analog battery meter, key indicator, contextual interact
 * prompt, charging indicator, message toaster, and an enemy-proximity
 * vignette. All updates are event/state-driven; only the vignette writes
 * per frame.
 */
export class HUD {
  private root: HTMLDivElement;
  private batteryFill: HTMLDivElement;
  private keyBadge: HTMLDivElement;
  private prompt: HTMLDivElement;
  private chargingBadge: HTMLDivElement;
  private toast: HTMLDivElement;
  private vignette: HTMLDivElement;
  private toastTimer: number | null = null;

  constructor(ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = 'position:absolute;inset:0;display:none';

    const batteryWrap = document.createElement('div');
    batteryWrap.style.cssText =
      'position:absolute;bottom:22px;left:22px;width:170px;height:16px;' +
      'border:2px solid #6b6149;border-radius:3px;background:#161310cc;padding:2px';
    this.batteryFill = document.createElement('div');
    this.batteryFill.style.cssText =
      'height:100%;width:100%;background:#9aa45e;border-radius:1px;transition:background .4s';
    batteryWrap.appendChild(this.batteryFill);
    const batteryLabel = document.createElement('div');
    batteryLabel.textContent = '🔦';
    batteryLabel.style.cssText = 'position:absolute;bottom:18px;left:198px;font-size:18px';

    this.keyBadge = document.createElement('div');
    this.keyBadge.textContent = '🗝 the keys';
    this.keyBadge.style.cssText =
      'position:absolute;bottom:52px;left:22px;color:#d8c372;display:none;' +
      "font:600 15px 'Trebuchet MS';text-shadow:0 0 6px #000";

    this.prompt = document.createElement('div');
    this.prompt.style.cssText =
      'position:absolute;bottom:18%;width:100%;text-align:center;color:#e8dcc0;' +
      "font:600 17px 'Trebuchet MS';text-shadow:0 1px 4px #000;display:none";

    this.chargingBadge = document.createElement('div');
    this.chargingBadge.textContent = '⚡ charging… (any key to grab the light and run)';
    this.chargingBadge.style.cssText =
      'position:absolute;bottom:26%;width:100%;text-align:center;color:#9fdf8a;' +
      "font:600 15px 'Trebuchet MS';text-shadow:0 1px 4px #000;display:none";

    this.toast = document.createElement('div');
    this.toast.style.cssText =
      'position:absolute;top:14%;width:100%;text-align:center;color:#d9cfae;' +
      "font:italic 600 17px Georgia;text-shadow:0 1px 6px #000;opacity:0;transition:opacity .5s";

    this.vignette = document.createElement('div');
    this.vignette.style.cssText =
      'position:absolute;inset:0;pointer-events:none;opacity:0;' +
      'background:radial-gradient(ellipse at center, transparent 46%, rgba(60,0,0,0.55) 100%)';

    this.root.append(this.vignette, batteryWrap, batteryLabel, this.keyBadge, this.prompt, this.chargingBadge, this.toast);
    ui.appendChild(this.root);
  }

  show(visible: boolean): void {
    this.root.style.display = visible ? 'block' : 'none';
  }

  setBattery(level: number, low: boolean): void {
    this.batteryFill.style.width = `${(level * 100).toFixed(1)}%`;
    this.batteryFill.style.background = low ? '#b0402e' : '#9aa45e';
  }

  setHasKey(has: boolean): void {
    this.keyBadge.style.display = has ? 'block' : 'none';
  }

  setPrompt(label: string | null): void {
    if (label) {
      this.prompt.textContent = `[E] ${label}`;
      this.prompt.style.display = 'block';
    } else {
      this.prompt.style.display = 'none';
    }
  }

  setCharging(charging: boolean): void {
    this.chargingBadge.style.display = charging ? 'block' : 'none';
  }

  showMessage(text: string): void {
    this.toast.textContent = text;
    this.toast.style.opacity = '1';
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toast.style.opacity = '0'), 3600);
  }

  /** Per-frame: vignette tightens as the nearest enemy closes. */
  setThreat(nearestDistance: number): void {
    const t = Math.max(0, Math.min(1, 1 - nearestDistance / 10));
    this.vignette.style.opacity = (t * 0.9).toFixed(2);
  }
}
