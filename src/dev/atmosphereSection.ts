import { type AddSection, type DevOverlayCtx } from './DevOverlay';
import { ATMO_KNOB_GROUPS, atmoGet, atmoSet } from './atmosphereKnobs';
import { colorRow, sliderRow } from './devPanel';

/**
 * Build the overlay's atmosphere section: collapsible subsections for light+fog,
 * flashlight, and storm, with rows bound live to `config.visibility` /
 * `config.flashlight` / `config.weather`. Color knobs use a color row; the
 * `*ByFloor` knobs are FLOOR-tagged and read/write the player's current floor
 * entry, so a change affects whatever floor you're standing on.
 */
export function buildAtmosphereSection(add: AddSection, ctx: DevOverlayCtx): void {
  for (const group of ATMO_KNOB_GROUPS) {
    add(`Atmosphere · ${group.title}`, (body, register) => {
      for (const knob of group.knobs) {
        const floor = () => (knob.scope === 'floor' ? ctx.player.floorIndex : 0);
        const get = () => atmoGet(ctx.config, knob, floor());
        const set = (v: number) => atmoSet(ctx.config, knob, floor(), v);
        const row =
          knob.kind === 'color'
            ? colorRow(knob.label, get, set, knob.scope)
            : sliderRow(knob.label, get, set, {
                min: knob.min,
                max: knob.max,
                step: knob.step,
                scope: knob.scope,
              });
        register(row);
        body.appendChild(row.el);
      }
    });
  }
}
