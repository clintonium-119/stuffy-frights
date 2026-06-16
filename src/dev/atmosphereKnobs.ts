import { type GameConfig } from '../core/config';

/**
 * Registry of the atmosphere knobs the dev overlay exposes — `config.visibility`
 * (lighting/fog), `config.flashlight`, and `config.weather` (the storm). Pure
 * data + pure accessors; no DOM. Most are GLOBAL; the `*ByFloor` arrays are
 * FLOOR-scoped (a single edit changes the player's current floor's entry).
 */
export type AtmoGroup = 'visibility' | 'flashlight' | 'weather' | 'audio';
export type AtmoScope = 'global' | 'floor';
export type AtmoKind = 'number' | 'color';

export interface AtmoKnob {
  label: string;
  group: AtmoGroup;
  key: string;
  min: number;
  max: number;
  step: number;
  scope: AtmoScope;
  kind: AtmoKind;
}

export interface AtmoKnobGroup {
  title: string;
  knobs: AtmoKnob[];
}

const COLOR = { min: 0, max: 0xffffff, step: 1, kind: 'color' as const };

export const ATMO_KNOB_GROUPS: AtmoKnobGroup[] = [
  {
    title: 'light + fog',
    knobs: [
      { label: 'ambient color', group: 'visibility', key: 'ambientColor', scope: 'global', ...COLOR },
      { label: 'ambient intensity', group: 'visibility', key: 'ambientIntensity', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'hemisphere intensity', group: 'visibility', key: 'hemisphereIntensity', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'fog color', group: 'visibility', key: 'fogColor', scope: 'global', ...COLOR },
      { label: 'tone exposure', group: 'visibility', key: 'toneExposure', min: 0, max: 3, step: 0.05, scope: 'global', kind: 'number' },
      { label: 'environment intensity', group: 'visibility', key: 'environmentIntensity', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'ambient (this floor)', group: 'visibility', key: 'ambientIntensityByFloor', min: 0, max: 0.3, step: 0.005, scope: 'floor', kind: 'number' },
      { label: 'hemisphere (this floor)', group: 'visibility', key: 'hemisphereIntensityByFloor', min: 0, max: 0.2, step: 0.005, scope: 'floor', kind: 'number' },
      { label: 'fog density (this floor)', group: 'visibility', key: 'fogDensityByFloor', min: 0, max: 0.4, step: 0.005, scope: 'floor', kind: 'number' },
    ],
  },
  {
    title: 'flashlight',
    knobs: [
      { label: 'color', group: 'flashlight', key: 'color', scope: 'global', ...COLOR },
      { label: 'intensity', group: 'flashlight', key: 'intensity', min: 0, max: 200, step: 1, scope: 'global', kind: 'number' },
      { label: 'range', group: 'flashlight', key: 'range', min: 0, max: 60, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'angle', group: 'flashlight', key: 'angle', min: 0, max: 1.4, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'penumbra', group: 'flashlight', key: 'penumbra', min: 0, max: 1, step: 0.05, scope: 'global', kind: 'number' },
      { label: 'sway lag', group: 'flashlight', key: 'swayLag', min: 0, max: 30, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'low threshold', group: 'flashlight', key: 'lowThreshold', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
    ],
  },
  {
    // The storm visuals (rain look + lightning flash) — config.weather.
    title: 'weather',
    knobs: [
      { label: 'rain intensity', group: 'weather', key: 'rainIntensity', min: 0, max: 1, step: 0.05, scope: 'global', kind: 'number' },
      { label: 'strike interval (s)', group: 'weather', key: 'strikeIntervalMean', min: 0, max: 60, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'strike jitter (s)', group: 'weather', key: 'strikeIntervalJitter', min: 0, max: 30, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'flash intensity', group: 'weather', key: 'flashIntensity', min: 0, max: 30, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'flash decay (s)', group: 'weather', key: 'flashDecaySeconds', min: 0, max: 2, step: 0.05, scope: 'global', kind: 'number' },
    ],
  },
  {
    // The full audio mix — rain bed, music swell, thunder — config.audio.
    title: 'audio',
    knobs: [
      { label: 'rain max gain', group: 'audio', key: 'rainMaxGain', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'rain min gain', group: 'audio', key: 'rainMinGain', min: 0, max: 1, step: 0.01, scope: 'global', kind: 'number' },
      { label: 'rain window falloff', group: 'audio', key: 'rainWindowFalloff', min: 0, max: 30, step: 0.5, scope: 'global', kind: 'number' },
      { label: 'music base gain', group: 'audio', key: 'musicBaseGain', min: 0, max: 1, step: 0.05, scope: 'global', kind: 'number' },
      { label: 'music swell max', group: 'audio', key: 'musicSwellMax', min: 0, max: 1, step: 0.05, scope: 'global', kind: 'number' },
      { label: 'music swell range', group: 'audio', key: 'musicSwellRange', min: 0, max: 40, step: 1, scope: 'global', kind: 'number' },
      { label: 'thunder delay min (s)', group: 'audio', key: 'thunderDelayMin', min: 0, max: 5, step: 0.1, scope: 'global', kind: 'number' },
      { label: 'thunder delay max (s)', group: 'audio', key: 'thunderDelayMax', min: 0, max: 8, step: 0.1, scope: 'global', kind: 'number' },
      { label: 'thunder gain', group: 'audio', key: 'thunderGain', min: 0, max: 1, step: 0.05, scope: 'global', kind: 'number' },
    ],
  },
];

export function allAtmoKnobs(): AtmoKnob[] {
  return ATMO_KNOB_GROUPS.flatMap((g) => g.knobs);
}

/** The raw config sub-object for a group, as an indexable bag. */
function bag(config: GameConfig, group: AtmoGroup): Record<string, number | number[]> {
  return config[group] as unknown as Record<string, number | number[]>;
}

/** Read a knob's value — the floor entry for FLOOR-scoped knobs, else the scalar. */
export function atmoGet(config: GameConfig, knob: AtmoKnob, floor: number): number {
  const raw = bag(config, knob.group)[knob.key];
  if (knob.scope === 'floor') return (raw as number[])[floor];
  return raw as number;
}

/** Write a knob's value — the floor entry for FLOOR-scoped knobs, else the scalar. */
export function atmoSet(config: GameConfig, knob: AtmoKnob, floor: number, value: number): void {
  const b = bag(config, knob.group);
  if (knob.scope === 'floor') (b[knob.key] as number[])[floor] = value;
  else b[knob.key] = value;
}
