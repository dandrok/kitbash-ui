import { defineComponent } from '@ktbsh/sdk';

/**
 * Progress indicator.
 * - Set `value` 0–100 for determinate bar (`aria-valuenow`).
 * - Omit / empty `value` for indeterminate (still `role="progressbar"`).
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
      height: 0.5rem;
      overflow: hidden;
      border-radius: var(--kb-radius-full);
      background: var(--kb-color-bg-subtle);
      border: 1px solid var(--kb-color-border-muted);
    }
    .bar {
      height: 100%;
      border-radius: var(--kb-radius-full);
      background: var(--kb-color-accent-default);
      transition: width 0.2s ease;
    }
    .indeterminate .bar {
      width: 40%;
      animation: kitbash-progress-indeterminate 1.2s ease-in-out infinite;
    }
    @keyframes kitbash-progress-indeterminate {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(350%);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bar {
        transition: none;
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
