import { type AddSection, type DevOverlayCtx } from './DevOverlay';
import { AI_KNOB_GROUPS } from './aiKnobs';
import { sliderRow } from './devPanel';

/**
 * Build the overlay's AI section: one collapsible subsection per knob group,
 * each row a live slider bound to the matching `config.ai` value and tagged
 * GLOBAL (these apply to every enemy, unlike the per-enemy multipliers in the
 * enemies viewer).
 */
export function buildAiSection(add: AddSection, ctx: DevOverlayCtx): void {
  for (const group of AI_KNOB_GROUPS) {
    add(`AI · ${group.title}`, (body, register) => {
      for (const knob of group.knobs) {
        const row = register(
          sliderRow(
            knob.label,
            () => ctx.config.ai[knob.path],
            (v) => {
              ctx.config.ai[knob.path] = v;
            },
            { min: knob.min, max: knob.max, step: knob.step, scope: 'global' }
          )
        );
        body.appendChild(row.el);
      }
    });
  }
}
