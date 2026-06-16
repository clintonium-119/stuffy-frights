import { CELL_SIZE, FLOOR_NAMES, House } from '../world/layoutTypes';

/** A world XZ position projected to map-canvas pixels at the given scale. */
export function mapProject(worldX: number, worldZ: number, scale: number): { x: number; y: number } {
  return { x: (worldX / CELL_SIZE) * scale, y: (worldZ / CELL_SIZE) * scale };
}

/** An enemy position for the dev reveal overlay. */
export interface EnemyMarker {
  x: number;
  z: number;
  floor: number;
}

export interface MapDrawOp {
  kind: 'wall' | 'door' | 'stair' | 'hide' | 'station' | 'exit';
  x: number;
  z: number;
}

/**
 * What the map is allowed to show, as data: walls/doors/stairs, official
 * hiding spots, charging stations, and (main floor only) the three exits.
 * NEVER secret passages, enemies, or the key — the brief's information
 * rules, enforced by tests against this record.
 */
export function floorDrawRecord(house: House, floor: number): MapDrawOp[] {
  const ops: MapDrawOp[] = [];
  const grid = house.grids[floor];
  for (let z = 0; z < house.depth; z++) {
    for (let x = 0; x < house.width; x++) {
      const kind = grid[z][x];
      // Vent bores are drawn as ordinary wall — they stay secret.
      if (kind === 'wall' || kind === 'vent') ops.push({ kind: 'wall', x, z });
      else if (kind === 'door') ops.push({ kind: 'door', x, z });
      else if (kind === 'stair') ops.push({ kind: 'stair', x, z });
    }
  }
  for (const h of house.hidingSpots) {
    if (h.pos.floor === floor) ops.push({ kind: 'hide', x: h.pos.x, z: h.pos.z });
  }
  for (const c of house.chargingStations) {
    if (c.floor === floor) ops.push({ kind: 'station', x: c.x, z: c.z });
  }
  for (const e of house.exits) {
    if (e.pos.floor === floor) ops.push({ kind: 'exit', x: e.pos.x, z: e.pos.z });
  }
  return ops;
}

/**
 * Hand-drawn-style per-floor map. The world stays live behind the
 * translucent overlay; movement locks while it's open (GameState owns
 * that). Always shows the player's CURRENT floor.
 */
export class MapOverlay {
  private root: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private title: HTMLDivElement;
  private cache = new Map<number, HTMLCanvasElement>();
  private scale = 24; // px per cell
  visible = false;

  constructor(private house: House, ui: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;inset:0;display:none;align-items:center;justify-content:center;' +
      'background:rgba(8,6,4,0.55)';
    this.title = document.createElement('div');
    this.title.style.cssText =
      'position:absolute;top:7%;width:100%;text-align:center;color:#d8c9a0;' +
      "font:700 28px 'Trebuchet MS',serif;letter-spacing:3px;text-shadow:0 0 8px #000";
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText =
      'box-shadow:0 0 40px #000;border:10px solid #2a2118;border-radius:4px;' +
      'transform:rotate(-0.6deg)';
    this.root.appendChild(this.title);
    this.root.appendChild(this.canvas);
    ui.appendChild(this.root);
  }

  /** The live composited map canvas (floor + player marker) — mirrored by the VR map panel. */
  get mapCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  open(): void {
    this.visible = true;
    this.root.style.display = 'flex';
  }

  close(): void {
    this.visible = false;
    this.root.style.display = 'none';
  }

  /** Per-frame while open: redraw the player marker layer over the cached floor. */
  update(
    playerX: number,
    playerZ: number,
    playerYaw: number,
    floor: number,
    enemies?: EnemyMarker[]
  ): void {
    if (!this.visible) return;
    const base = this.floorCanvas(floor);
    const s = this.scale;
    this.canvas.width = base.width;
    this.canvas.height = base.height;
    const ctx = this.canvas.getContext('2d')!;
    ctx.drawImage(base, 0, 0);

    this.title.textContent = `— ${FLOOR_NAMES[floor]} —`;

    // Dev reveal: enemy markers on this floor (drawn under the player marker).
    if (enemies) {
      ctx.fillStyle = '#e8c33a';
      for (const e of enemies) {
        if (e.floor !== floor) continue;
        const p = mapProject(e.x, e.z, s);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Player marker: pulsing dot + facing wedge.
    const player = mapProject(playerX, playerZ, s);
    const px = player.x;
    const pz = player.y;
    const pulse = 1 + Math.sin(performance.now() / 220) * 0.18;
    ctx.fillStyle = '#b03a2e';
    ctx.beginPath();
    ctx.arc(px, pz, 5.5 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b03a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, pz);
    ctx.lineTo(px - Math.sin(playerYaw) * 14, pz - Math.cos(playerYaw) * 14);
    ctx.stroke();
  }

  private floorCanvas(floor: number): HTMLCanvasElement {
    const cached = this.cache.get(floor);
    if (cached) return cached;
    const s = this.scale;
    const canvas = document.createElement('canvas');
    canvas.width = this.house.width * s;
    canvas.height = this.house.depth * s;
    const ctx = canvas.getContext('2d')!;

    // Aged paper.
    ctx.fillStyle = '#cdbd97';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 320; i++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = '#8a7a55';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 9, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const op of floorDrawRecord(this.house, floor)) {
      const x = op.x * s;
      const z = op.z * s;
      switch (op.kind) {
        case 'wall':
          ctx.fillStyle = '#3a2f22';
          ctx.fillRect(x + 1, z + 1, s - 2, s - 2);
          break;
        case 'door':
          ctx.fillStyle = '#a89468';
          ctx.fillRect(x + 3, z + 3, s - 6, s - 6);
          break;
        case 'stair': {
          ctx.strokeStyle = '#5a4a33';
          ctx.lineWidth = 2;
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + 3, z + (i * s) / 4);
            ctx.lineTo(x + s - 3, z + (i * s) / 4);
            ctx.stroke();
          }
          break;
        }
        case 'hide': {
          // Little closet icon: box with a door slit.
          ctx.strokeStyle = '#27504f';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x + 4, z + 4, s - 8, s - 8);
          ctx.beginPath();
          ctx.moveTo(x + s / 2, z + 4);
          ctx.lineTo(x + s / 2, z + s - 4);
          ctx.stroke();
          break;
        }
        case 'station': {
          // Plug glyph: circle + two prongs.
          ctx.strokeStyle = '#2e6b34';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(x + s / 2, z + s / 2, s / 3.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + s / 2 - 3, z + s / 2 - 2);
          ctx.lineTo(x + s / 2 - 3, z + s / 2 + 4);
          ctx.moveTo(x + s / 2 + 3, z + s / 2 - 2);
          ctx.lineTo(x + s / 2 + 3, z + s / 2 + 4);
          ctx.stroke();
          break;
        }
        case 'exit': {
          ctx.fillStyle = '#7a2a20';
          ctx.font = `700 ${Math.round(s * 0.8)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⌂', x + s / 2, z + s / 2 + 1);
          break;
        }
      }
    }
    this.cache.set(floor, canvas);
    return canvas;
  }
}
