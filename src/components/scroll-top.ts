import { defineComponent } from '@ktbsh/sdk';

/**
 * Fixed “scroll to top” control (blog `$ top`).
 *
 * - Click: `window.scrollTo({ top: 0, behavior })`
 * - Visibility: set boolean prop `visible` from the host app (no CE lifecycle
 *   for window scroll listeners — see sdk-feedback). Story demos auto-bind.
 *
 * A11y: `aria-label`, visible label, focus ring, `prefers-reduced-motion`.
 */
export default defineComponent({
  tag: 'kitbash-scroll-top',
  delegatesFocus: true,
  props: {
    /** When true, control is shown (app sets from scroll position). */
    visible: { type: Boolean, default: false },
    /** Accessible name. */
    label: { type: String, default: 'Scroll to top' },
    /** Visible caption (blog uses `$ top`). */
    caption: { type: String, default: '$ top' },
    /** `smooth` | `auto` for scroll behavior. */
    behavior: { type: String, default: 'smooth' },
  },
  events: {
    'click button'(_e: Event, { props }) {
      if (typeof window === 'undefined') return;
      const behavior =
        props.behavior === 'auto' || props.behavior === 'instant'
          ? 'auto'
          : 'smooth';
      const reduce =
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: reduce ? 'auto' : behavior,
      });
    },
  },
  styles: `
    :host {
      position: fixed;
      bottom: var(--kb-space-lg);
      right: var(--kb-space-md);
      z-index: 40;
      font-family: var(--kb-font-family-sans);
      /* Hidden unless visible — keeps focusable only when shown */
      display: none;
    }
    :host([visible]) {
      display: block;
    }
    button {
      box-sizing: border-box;
      min-height: 2.25rem;
      min-width: 2.25rem;
      padding: var(--kb-space-sm) var(--kb-space-md);
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-accent-default);
      font: inherit;
      font-size: var(--kb-font-size-sm);
      font-weight: var(--kb-font-weight-medium);
      letter-spacing: 0.25em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: var(--kb-shadow-sm);
      transition:
        color 0.2s ease,
        background-color 0.2s ease,
        border-color 0.2s ease;
    }
    button:hover {
      color: var(--kb-color-fg-default);
      background: var(--kb-color-bg-surface);
      border-color: var(--kb-color-border-focus);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    .caption {
      display: inline-block;
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
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `,
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Scroll to top';
    const caption =
      typeof props.caption === 'string' && props.caption.length > 0
        ? props.caption
        : '$ top';

    return html`
      <button part="scroll-top-root" type="button" aria-label=${label}>
        <span class="sr-only">${label}</span>
        <span class="caption" aria-hidden="true">${caption}</span>
      </button>
    `;
  },
});
