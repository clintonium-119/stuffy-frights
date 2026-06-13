import * as THREE from 'three';
import { config } from '../core/config';

/**
 * Rain bed gain from the player's distance to the nearest window: loudest at the
 * glass, fading to a faint floor far inside / in windowless rooms. Monotonic.
 */
export function rainGainForWindow(nearestWindow: number): number {
  const a = config.audio;
  const t = Math.max(0, Math.min(1, nearestWindow / a.rainWindowFalloff)); // 0 at glass → 1 past falloff
  return a.rainMaxGain + (a.rainMinGain - a.rainMaxGain) * t;
}

/**
 * Extra music-bed gain that swells in as the nearest enemy closes (0 beyond the
 * swell range, up to musicSwellMax right on top of the player).
 */
export function musicSwell(nearestEnemy: number): number {
  const a = config.audio;
  if (!Number.isFinite(nearestEnemy) || nearestEnemy >= a.musicSwellRange) return 0;
  const t = 1 - Math.max(0, nearestEnemy) / a.musicSwellRange; // 0 far → 1 at the player
  return a.musicSwellMax * t;
}

/**
 * Fully synthesized WebAudio horror soundscape — zero audio files.
 * Buses: ambient bed (wind + creaks), positional enemy cues, heartbeat /
 * chase tension layers, one-shots (creaks, doors, keys, the sting).
 * A master compressor caps everything — the sting startles, never hurts.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: DynamicsCompressorNode;
  private sfxBus!: GainNode;
  private ambientBus!: GainNode;
  private musicBus!: GainNode;
  private heartbeatTimer = 0;
  private heartbeatInterval = 1.2;
  private chaseGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private creakTimer = 4;
  private listenerPos = new THREE.Vector3();
  private listenerYaw = 0;

  /** Call from the first user gesture. */
  unlock(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createDynamicsCompressor();
    this.master.threshold.value = -18;
    this.master.ratio.value = 14;
    this.master.connect(this.ctx.destination);

    this.ambientBus = this.ctx.createGain();
    this.ambientBus.gain.value = 0.5;
    this.ambientBus.connect(this.master);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(this.master);
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0.55;
    this.musicBus.connect(this.master);

    this.startAmbientBed();
    this.startChaseLayer();
    this.startMusicBed();
    this.startRain();
  }

  // ---- Rain bed: bright filtered-noise hiss + patter. Its gain is set per
  // frame from window proximity (loud at the glass, faint deep inside).
  private startRain(): void {
    const ctx = this.ctx!;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.value = config.audio.rainMinGain;
    this.rainGain.connect(this.ambientBus);
    // Hiss: high-passed noise (the steady sheet of rain).
    const hiss = ctx.createBufferSource();
    hiss.buffer = this.noiseBuffer(5);
    hiss.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1600;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.7;
    hiss.connect(hp).connect(hissGain).connect(this.rainGain);
    hiss.start();
    // Patter: band-passed noise with a fluttering LFO (drops on the glass).
    const patter = ctx.createBufferSource();
    patter.buffer = this.noiseBuffer(5);
    patter.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 0.7;
    const patterGain = ctx.createGain();
    patterGain.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 11;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain).connect(patterGain.gain);
    patter.connect(bp).connect(patterGain).connect(this.rainGain);
    patter.start();
    lfo.start();
  }

  get ready(): boolean {
    return this.ctx !== null;
  }

  setListener(pos: THREE.Vector3, yaw: number): void {
    this.listenerPos.copy(pos);
    this.listenerYaw = yaw;
  }

  /** Stereo pan + distance gain for world-positioned one-shots. */
  private spatial(pos: THREE.Vector3, maxDist = 18): { pan: StereoPannerNode; gain: GainNode } | null {
    if (!this.ctx) return null;
    const d = this.listenerPos.distanceTo(pos);
    if (d > maxDist) return null;
    const dx = pos.x - this.listenerPos.x;
    const dz = pos.z - this.listenerPos.z;
    // Rotate into listener space: right = +x'.
    const rx = dx * Math.cos(this.listenerYaw) - dz * Math.sin(this.listenerYaw);
    const pan = this.ctx.createStereoPanner();
    pan.pan.value = Math.max(-1, Math.min(1, rx / 8));
    const gain = this.ctx.createGain();
    gain.gain.value = Math.pow(1 - d / maxDist, 1.6);
    gain.connect(pan);
    pan.connect(this.sfxBus);
    return { pan, gain };
  }

  private noiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Filtered noise burst — the workhorse for thumps and steps. */
  private thump(
    dest: AudioNode,
    freq: number,
    seconds: number,
    volume: number,
    type: BiquadFilterType = 'lowpass'
  ): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(seconds);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + seconds);
    src.connect(filter).connect(gain).connect(dest);
    src.start();
  }

  private tone(
    dest: AudioNode,
    freq: number,
    seconds: number,
    volume: number,
    type: OscillatorType = 'sine',
    endFreq?: number
  ): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + seconds);
    osc.connect(gain).connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + seconds + 0.05);
  }

  // ---- Ambient bed: low rumble + wind gusts + random house creaks.
  private startAmbientBed(): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(4);
    src.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 110;
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.5;
    src.connect(low).connect(lowGain).connect(this.ambientBus);
    src.start();

    // Wind: band-passed noise with a slow LFO on its gain.
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer(6);
    wind.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 480;
    band.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.045;
    lfo.connect(lfoGain).connect(windGain.gain);
    wind.connect(band).connect(windGain).connect(this.ambientBus);
    wind.start();
    lfo.start();
  }

  // ---- Chase layer: pulsing minor dyad, faded in/out by threat.
  private startChaseLayer(): void {
    const ctx = this.ctx!;
    this.chaseGain = ctx.createGain();
    this.chaseGain.gain.value = 0;
    this.chaseGain.connect(this.musicBus);
    for (const f of [98, 116.5]) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      const trem = ctx.createOscillator();
      trem.frequency.value = 5.2;
      const tremGain = ctx.createGain();
      tremGain.gain.value = 0.03;
      trem.connect(tremGain).connect(g.gain);
      osc.connect(g).connect(this.chaseGain);
      osc.start();
      trem.start();
    }
  }

  // ---- Eerie music bed: a slow, detuned minor drone with a wandering high
  // partial — continuous dread under the ambient + chase layers.
  private startMusicBed(): void {
    const ctx = this.ctx!;
    const bed = ctx.createGain();
    bed.gain.value = 0.16; // sits well under footsteps and the sting
    bed.connect(this.musicBus);

    // Low detuned drone (a minor-ish cluster: root + slightly flat fifth).
    for (const f of [55, 58.27, 82.4]) {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.09;
      // Slow amplitude swell so the bed breathes.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.045 + Math.random() * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(g.gain);
      osc.connect(g).connect(bed);
      osc.start();
      lfo.start();
    }

    // Wandering high partial — a thin, uneasy whine that drifts in pitch.
    const high = ctx.createOscillator();
    high.type = 'sine';
    high.frequency.value = 660;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.015;
    const drift = ctx.createOscillator();
    drift.frequency.value = 0.07;
    const driftGain = ctx.createGain();
    driftGain.gain.value = 40; // ± Hz wander
    drift.connect(driftGain).connect(high.frequency);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    high.connect(hp).connect(highGain).connect(bed);
    high.start();
    drift.start();
  }

  /**
   * Per-frame tension + ambience. nearestEnemy / nearestWindow in metres
   * (Infinity when none); chasing flag drives the chase layer.
   */
  update(dt: number, nearestEnemy: number, anyChasing: boolean, nearestWindow = Infinity): void {
    if (!this.ctx) return;

    // Heartbeat quickens as the nearest stuffy closes (within 12 m).
    if (nearestEnemy < 12) {
      this.heartbeatInterval = 0.45 + (nearestEnemy / 12) * 0.9;
      this.heartbeatTimer -= dt;
      if (this.heartbeatTimer <= 0) {
        this.heartbeatTimer = this.heartbeatInterval;
        this.thump(this.musicBus, 70, 0.13, 0.5);
        setTimeout(() => this.ctx && this.thump(this.musicBus, 60, 0.11, 0.32), 140);
      }
    }

    // Chase layer fade.
    const target = anyChasing ? 0.85 : 0;
    const g = this.chaseGain!.gain;
    g.value += (target - g.value) * Math.min(1, dt * 2.5);

    // The whole music bed swells as the enemy closes (drone + chase + heartbeat
    // all ride this bus), keeping distinct layers but rising in dread.
    const musicTarget = config.audio.musicBaseGain + musicSwell(nearestEnemy);
    this.musicBus.gain.value += (musicTarget - this.musicBus.gain.value) * Math.min(1, dt * 2);

    // Rain gets louder the closer the player is to a window.
    if (this.rainGain) {
      const rainTarget = rainGainForWindow(nearestWindow);
      this.rainGain.gain.value += (rainTarget - this.rainGain.gain.value) * Math.min(1, dt * 3);
    }

    // Random house creaks, far away on purpose.
    this.creakTimer -= dt;
    if (this.creakTimer <= 0) {
      this.creakTimer = 6 + Math.random() * 14;
      this.tone(this.ambientBus, 180 + Math.random() * 160, 0.9, 0.04, 'sawtooth', 120);
    }
  }

  // ---- Player sounds.
  footstep(noiseLevel: number): void {
    if (!this.ctx || noiseLevel === 0) return;
    const vol = noiseLevel === 3 ? 0.34 : noiseLevel === 2 ? 0.2 : 0.08;
    this.thump(this.sfxBus, 320, 0.09, vol);
  }

  // ---- Enemy signature cues (positional).
  gaitBeat(kind: string, pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (!sp) return;
    switch (kind) {
      case 'knuckle': // Charles: heavy double knuckle thump
        this.thump(sp.gain, 140, 0.16, 0.8);
        setTimeout(() => {
          const sp2 = this.spatial(pos);
          if (sp2) this.thump(sp2.gain, 120, 0.12, 0.5);
        }, 110);
        break;
      case 'fwump': // Poo: rubbery soft landing
        this.thump(sp.gain, 240, 0.18, 0.65);
        this.tone(sp.gain, 130, 0.14, 0.18, 'sine', 70);
        break;
      case 'hoof': // New Yama: quick hard clip
        this.thump(sp.gain, 900, 0.05, 0.5, 'bandpass');
        break;
      case 'shuffle': // Fuggie: dry rasp + occasional giggle
        this.thump(sp.gain, 1600, 0.12, 0.3, 'highpass');
        if (Math.random() < 0.12) this.giggle(pos);
        break;
    }
  }

  giggle(pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (!sp || !this.ctx) return;
    // Descending warble — wrong-sounding on purpose.
    let f = 620;
    for (let i = 0; i < 4; i++) {
      const delay = i * 95;
      setTimeout(() => {
        const s = this.spatial(pos);
        if (s) this.tone(s.gain, f, 0.09, 0.3, 'square', f * 0.82);
      }, delay);
      f *= 0.86;
    }
  }

  // ---- One-shots.
  sting(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    // Sharp metallic transient (the strike).
    this.thump(this.sfxBus, 4200, 0.45, 1.2, 'highpass');
    // Dissonant detuned cluster screeching downward — the chilling core.
    for (const f of [990, 1046, 1318]) {
      this.tone(this.sfxBus, f, 0.9, 0.5, 'sawtooth', f * 0.18);
    }
    // A low sub thud for body/impact.
    this.tone(this.sfxBus, 120, 0.7, 0.8, 'sine', 42);
    this.thump(this.sfxBus, 90, 0.6, 0.7);
    // A brief shiver tail: tremolo'd high whine fading out.
    const whine = ctx.createOscillator();
    whine.type = 'sawtooth';
    whine.frequency.setValueAtTime(2300, ctx.currentTime);
    whine.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 1.1);
    const wg = ctx.createGain();
    wg.gain.setValueAtTime(0.0001, ctx.currentTime);
    wg.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.04);
    wg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    const trem = ctx.createOscillator();
    trem.frequency.value = 18;
    const tremGain = ctx.createGain();
    tremGain.gain.value = 0.15;
    trem.connect(tremGain).connect(wg.gain);
    whine.connect(wg).connect(this.sfxBus);
    whine.start();
    whine.stop(ctx.currentTime + 1.25);
    trem.start();
    trem.stop(ctx.currentTime + 1.25);
  }

  grateCreak(pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (sp) this.tone(sp.gain, 320, 0.8, 0.5, 'sawtooth', 140);
  }

  doorRattle(pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (!sp) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const s = this.spatial(pos);
        if (s) this.thump(s.gain, 700, 0.06, 0.5, 'bandpass');
      }, i * 90);
    }
  }

  wrongKeyClunk(pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (sp) {
      this.thump(sp.gain, 420, 0.1, 0.55, 'bandpass');
      this.tone(sp.gain, 180, 0.25, 0.3, 'triangle', 120);
    }
  }

  keyJingle(pos: THREE.Vector3): void {
    const sp = this.spatial(pos);
    if (!sp) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const s = this.spatial(pos);
        if (s) this.tone(s.gain, 2400 + Math.random() * 1800, 0.12, 0.22, 'triangle');
      }, i * 70);
    }
  }

  chargeHum(pos: THREE.Vector3): void {
    const sp = this.spatial(pos, 10);
    if (sp) {
      this.tone(sp.gain, 96, 1.1, 0.12, 'sine');
      this.tone(sp.gain, 192, 1.1, 0.05, 'sine');
    }
  }

  doorOpenWin(): void {
    if (!this.ctx) return;
    this.tone(this.musicBus, 392, 1.6, 0.4, 'triangle');
    setTimeout(() => this.ctx && this.tone(this.musicBus, 494, 1.4, 0.4, 'triangle'), 220);
    setTimeout(() => this.ctx && this.tone(this.musicBus, 587, 1.8, 0.45, 'triangle'), 440);
  }

  hideRustle(): void {
    if (this.ctx) this.thump(this.sfxBus, 1100, 0.25, 0.3, 'highpass');
  }

  /** A lightning rumble — deep crack, body, and a long low decay. Fired (after a
   *  realistic delay) when the weather system flashes. */
  thunder(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const a = config.audio;
    // The CRACK: a bright, sharp noise burst + a mid slap — the thunderclap that
    // sells the strike, layered over the low rumble below.
    this.thump(this.ambientBus, 3600, 0.22, a.thunderGain * 1.5, 'highpass');
    this.thump(this.ambientBus, 1500, 0.5, a.thunderGain * 1.0, 'bandpass');
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(3.6);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(240, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(a.thunderGain, ctx.currentTime + 0.12); // crack
    g.gain.exponentialRampToValueAtTime(a.thunderGain * 0.4, ctx.currentTime + 0.7); // body
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.4); // rumble tail
    src.connect(lp).connect(g).connect(this.ambientBus);
    src.start();
    src.stop(ctx.currentTime + 3.5);
    // Sub-bass sweep for the chest-thump.
    this.tone(this.ambientBus, 48, 2.6, a.thunderGain * 0.5, 'sine', 26);
  }

  /** A distant, muffled stair-creak + heavy footfall — a stuffy moving floors. */
  migrationCue(pos?: THREE.Vector3): void {
    if (!this.ctx) return;
    const dest = pos ? this.spatial(pos, 30)?.gain ?? this.ambientBus : this.ambientBus;
    // Low groaning creak that bends down, plus a soft distant thud.
    this.tone(dest, 220, 1.3, 0.16, 'sawtooth', 90);
    this.tone(dest, 150, 1.1, 0.1, 'triangle', 70);
    setTimeout(() => {
      if (this.ctx) this.thump(this.ambientBus, 90, 0.22, 0.18);
    }, 420);
  }
}
