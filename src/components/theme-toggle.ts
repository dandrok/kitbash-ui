import { defineComponent } from '@ktbsh/sdk';

/**
 * Blog-style color-scheme control.
 *
 * **API value:** `light` | `dark` (dataset / storage / kitbash-change).
 * **Visible label:** `theme=light` | `theme=night` (blog copy; night ≡ dark).
 *
 * Sets `document.documentElement.dataset.theme` and optional `localStorage`.
 * Pair with `@ktbsh/ui/themes/*.css`. Emits `kitbash-change` with next theme.
 *
 * A11y: native button, `aria-pressed` true when light (matches astro-blog-md).
 */
export default defineComponent({
  tag: 'kitbash-theme-toggle',
  delegatesFocus: true,
  props: {
    /** Controlled theme. When empty, reads `document.documentElement.dataset.theme`. */
    value: { type: String, default: '' },
    /** localStorage key; empty string disables persistence. Default `theme`. */
    storageKey: { type: String, default: 'theme' },
  },
  events: {
    'click button'(_e: Event, { props, commit }) {
      const cur =
        props.value === 'light' || props.value === 'dark'
          ? props.value
          : typeof document !== 'undefined' &&
              document.documentElement.dataset.theme === 'light'
            ? 'light'
            : 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = next;
      }
      const key =
        typeof props.storageKey === 'string' ? props.storageKey : 'theme';
      if (key && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(key, next);
        } catch {
          /* private mode */
        }
      }
      commit({ props: { value: next } });
    },
  },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--kb-font-family-sans);
    }
    button {
      box-sizing: border-box;
      margin: 0;
      min-height: 2.25rem;
      padding: 0.45rem 0.8rem;
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-subtle);
      color: var(--kb-color-accent-default);
      font: inherit;
      font-size: var(--kb-font-size-sm);
      font-weight: var(--kb-font-weight-medium);
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: lowercase;
      cursor: pointer;
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
      outline: 2px solid var(--kb-color-border-focus);
      outline-offset: 2px;
      color: var(--kb-color-fg-default);
      background: var(--kb-color-bg-surface);
    }
    /* Segmented group (set by kitbash-toggle-group) */
    :host([data-group-pos="start"]) button {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-width: 0;
    }
    :host([data-group-pos="end"]) button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    :host([data-group-pos="mid"]) button {
      border-radius: 0;
      border-right-width: 0;
    }
    :host([data-group-pos]:hover),
    :host([data-group-pos]:focus-within) {
      position: relative;
      z-index: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `,
  render({ props, html }) {
    let theme =
      props.value === 'light' || props.value === 'dark' ? props.value : '';
    if (!theme && typeof document !== 'undefined') {
      theme =
        document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    }
    if (!theme) theme = 'dark';
    const isLight = theme === 'light';
    const label = isLight ? 'theme=light' : 'theme=night';

    return html`
      <button
        part="toggle-root"
        type="button"
        aria-pressed=${isLight ? 'true' : 'false'}
        aria-label=${isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      >
        ${label}
      </button>
    `;
  },
});
