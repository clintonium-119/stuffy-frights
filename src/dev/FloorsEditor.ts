/**
 * Dev floors editor — edits per-floor visibility/atmosphere with a live lit-room
 * preview. Placeholder for now (the preview scene + sliders land in a later
 * phase); this just claims the canvas so the page + shared nav render.
 * Browser-only; never imported by the game.
 */
export class FloorsEditor {
  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.clientWidth || window.innerWidth;
    canvas.height = canvas.clientHeight || window.innerHeight;
    ctx.fillStyle = '#202428';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9bb';
    ctx.font = '16px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('floors editor — coming soon', canvas.width / 2, canvas.height / 2);
  }
}
