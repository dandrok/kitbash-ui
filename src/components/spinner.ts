import { defineComponent } from '@ktbsh/sdk';

/**
 * Indeterminate loading indicator.
 * A11y: `role="status"` with visually hidden text (more reliable than
 * empty + aria-label alone). Animation reduced under prefers-reduced-motion.
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
      display: inline-block;
      box-sizing: border-box;
      border-radius: var(--kb-radius-full);
      border-style: solid;
      border-color: currentColor transparent currentColor transparent;
      animation: kitbash-spin 0.7s linear infinite;
    }
    .sm {
      width: 1rem;
      height: 1rem;
      border-width: 2px;
    }
    .md {
      width: 1.5rem;
      height: 1.5rem;
      border-width: 2px;
    }
    .lg {
      width: 2.25rem;
      height: 2.25rem;
      border-width: 3px;
    }
    @keyframes kitbash-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .root {
        animation: none;
        border-color: currentColor;
        opacity: 0.7;
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
