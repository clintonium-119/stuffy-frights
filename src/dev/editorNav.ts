/**
 * Shared dev-editor nav strip. Each editor page (enemies, floors) mounts a small
 * fixed page-switcher so you can jump between them. Plain DOM (no framework),
 * matching the other dev panels; relative hrefs resolve under the Vite base.
 */
export interface EditorNavLink {
  label: string;
  /** Page key, also the dev-page filename (`<href>.html`). */
  href: string;
}

/** The editor pages, in nav order. */
export function editorNavLinks(): EditorNavLink[] {
  return [
    { label: 'Enemies', href: 'enemies.html' },
    { label: 'Floors', href: 'floors.html' },
  ];
}

/** Inject the top-center nav strip, highlighting the active page. */
export function mountEditorNav(active: 'enemies' | 'floors'): void {
  const bar = document.createElement('div');
  bar.style.cssText =
    'position:fixed;top:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:30;' +
    'background:#0b0e12ee;padding:5px 8px;border-radius:8px;font:12px ui-monospace,monospace';
  for (const link of editorNavLinks()) {
    const a = document.createElement('a');
    const isActive = link.href.startsWith(active);
    a.textContent = link.label;
    a.href = link.href;
    a.style.cssText =
      `padding:3px 12px;border-radius:5px;text-decoration:none;` +
      `color:${isActive ? '#fff' : '#9bb'};background:${isActive ? '#2a6' : 'transparent'}`;
    bar.appendChild(a);
  }
  document.body.appendChild(bar);
}
