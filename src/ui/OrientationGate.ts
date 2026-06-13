/**
 * Portrait-blocking overlay for mobile. The game is landscape-only; while the
 * phone is held upright this covers the screen with a "rotate your device"
 * prompt. Mounted only on mobile (see Platform.isMobile).
 */
export class OrientationGate {
  private root: HTMLDivElement;

  constructor(ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'clickable';
    this.root.style.cssText =
      'position:absolute;inset:0;display:none;align-items:center;justify-content:center;' +
      'text-align:center;background:#05060a;color:#cdb98a;z-index:50;' +
      "font-family:'Trebuchet MS',Verdana,sans-serif;font-size:20px;letter-spacing:1px";
    this.root.innerHTML =
      '<div><div style="font-size:46px;margin-bottom:14px">🔄</div>' +
      'Rotate your device<br><span style="color:#8a7d65;font-size:15px">Stuffy Frights plays in landscape</span></div>';
    ui.appendChild(this.root);

    const update = () => this.update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    this.update();
  }

  private isPortrait(): boolean {
    if (typeof matchMedia === 'function') return matchMedia('(orientation: portrait)').matches;
    return window.innerHeight > window.innerWidth;
  }

  update(): void {
    this.root.style.display = this.isPortrait() ? 'flex' : 'none';
  }
}
