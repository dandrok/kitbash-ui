import { defineComponent } from '@ktbsh/sdk';

/**
 * Indeterminate loading indicator.
 *
 * Square “radar” frame (uses `--kb-radius-sm` → 0 under terminal) with a
 * rotating accent edge — more technical/CRT than a soft pill ring.
 *
 * A11y: `role="status"` + sr-only label. Motion reduced under
 * prefers-reduced-motion.
 */
export default defineComponent({
  tag: 'kitbash-spinner',
  props: {
    size: { type: String, default: 'md' },
    label: { type: String, default: 'Loading' },
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--kb-color-accent-default);
      vertical-align: middle;
      position: relative;
    }
    .root {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      border-radius: var(--kb-radius-sm);
      border: 2px solid
        color-mix(in srgb, var(--kb-color-accent-default) 22%, transparent);
      background: color-mix(
        in srgb,
        var(--kb-color-accent-default) 6%,
        transparent
      );
      animation: kitbash-spin 0.85s linear infinite;
    }
    /* Leading edge — bright corner sweep */
    .root::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-right-color: currentColor;
      box-shadow: 0 0 6px
        color-mix(in srgb, var(--kb-color-accent-default) 50%, transparent);
      pointer-events: none;
    }
    /* Inner crosshair tick */
    .root::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 28%;
      height: 28%;
      transform: translate(-50%, -50%);
      border: 1px solid
        color-mix(in srgb, var(--kb-color-accent-default) 55%, transparent);
      border-radius: var(--kb-radius-none);
      background: color-mix(
        in srgb,
        var(--kb-color-accent-default) 12%,
        transparent
      );
      pointer-events: none;
    }
    .sm {
      width: 1rem;
      height: 1rem;
    }
    .md {
      width: 1.5rem;
      height: 1.5rem;
    }
    .lg {
      width: 2.25rem;
      height: 2.25rem;
    }
    @keyframes kitbash-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .root {
        animation: none;
        opacity: 0.85;
      }
      .root::before {
        border-color: currentColor;
        box-shadow: none;
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
  render({ props, html }) {
    const size = props.size === 'sm' || props.size === 'lg' ? props.size : 'md';
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Loading';

    return html`
      <span part="spinner-root" class=${`root ${size}`} role="status">
        <span class="sr-only">${label}</span>
      </span>
    `;
  },
});
