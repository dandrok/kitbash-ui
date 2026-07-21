import { defineComponent } from '@ktbsh/sdk';

/**
 * Progress indicator.
 * - Set `value` 0–100 for determinate bar (`aria-valuenow`).
 * - Omit / empty `value` for indeterminate (still `role="progressbar"`).
 *
 * Track/bar use `--kb-radius-*` (square under terminal preset). Fill uses
 * accent with a subtle glow for CRT / cyberpunk feel.
 */
export default defineComponent({
  tag: 'kitbash-progress',
  props: {
    value: { type: Number, default: -1 },
    max: { type: Number, default: 100 },
    label: { type: String, default: 'Progress' },
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--kb-font-family-sans);
    }
    .track {
      box-sizing: border-box;
      width: 100%;
      height: 0.65rem;
      overflow: hidden;
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-subtle);
      border: 1px solid var(--kb-color-border-default);
      box-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--kb-color-accent-default) 8%, transparent);
    }
    .bar {
      height: 100%;
      border-radius: var(--kb-radius-none);
      background: linear-gradient(
        90deg,
        var(--kb-color-accent-default),
        color-mix(
          in srgb,
          var(--kb-color-accent-default) 70%,
          var(--kb-color-fg-default)
        )
      );
      box-shadow:
        0 0 8px
          color-mix(in srgb, var(--kb-color-accent-default) 45%, transparent),
        inset 0 0 0 1px
          color-mix(in srgb, var(--kb-color-fg-on-accent) 15%, transparent);
      transition: width 0.2s ease;
    }
    .indeterminate .bar {
      width: 35%;
      animation: kitbash-progress-indeterminate 1.1s linear infinite;
    }
    @keyframes kitbash-progress-indeterminate {
      0% {
        transform: translateX(-120%);
      }
      100% {
        transform: translateX(320%);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bar {
        transition: none;
        box-shadow: none;
      }
      .indeterminate .bar {
        animation: none;
        width: 100%;
        opacity: 0.55;
      }
    }
  `,
  render({ props, html }) {
    const max =
      typeof props.max === 'number' && props.max > 0 ? props.max : 100;
    const raw = typeof props.value === 'number' ? props.value : -1;
    const determinate = raw >= 0;
    const clamped = determinate ? Math.min(max, Math.max(0, raw)) : 0;
    const pct = determinate ? Math.round((clamped / max) * 100) : 0;
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Progress';

    return html`
      <div
        part="progress-root"
        class=${determinate ? 'track' : 'track indeterminate'}
        role="progressbar"
        aria-label=${label}
        aria-valuemin=${0}
        aria-valuemax=${max}
        aria-valuenow=${determinate ? clamped : null}
      >
        <div
          part="progress-bar"
          class="bar"
          style=${determinate ? `width: ${pct}%` : null}
        ></div>
      </div>
    `;
  },
});
