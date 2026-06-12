import * as THREE from 'three';

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

  /** Per-frame: tension systems. nearestEnemy in meters; chasing flag. */
  update(dt: number, nearestEnemy: number, anyChasing: boolean): void {
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
    this.thump(this.sfxBus, 3500, 0.5, 1.2, 'highpass');
    this.tone(this.sfxBus, 880, 0.7, 0.9, 'sawtooth', 110);
    this.tone(this.sfxBus, 660, 0.7, 0.7, 'square', 90);
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
}
