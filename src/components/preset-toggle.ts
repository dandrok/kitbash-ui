import { defineComponent } from '@ktbsh/sdk';

/**
 * Blog-style UI/preset control (`ui=regular` / `ui=terminal`).
 *
 * Sets `document.documentElement.dataset.kbPreset` (`terminal` or removed for
 * default) and mirrors `data-ui-mode` (`regular` | `terminal`) for blog FOUC
 * scripts. Optional localStorage. Emits `kitbash-change` with next preset.
 *
 * A11y: native button, `aria-pressed` true when regular/default.
 */
export default defineComponent({
  tag: 'kitbash-preset-toggle',
  delegatesFocus: true,
  props: {
    /** Controlled preset: `default` | `terminal`. Empty → read from document. */
    value: { type: String, default: '' },
    /**
     * localStorage key. Default `ui-mode` (blog-compatible: regular|terminal).
     * Empty string disables persistence.
     */
    storageKey: { type: String, default: 'ui-mode' },
  },
  events: {
    'click button'(_e: Event, { props, commit }) {
      let cur =
        props.value === 'default' || props.value === 'terminal'
          ? props.value
          : '';
      if (!cur && typeof document !== 'undefined') {
        const root = document.documentElement;
        if (root.dataset.kbPreset === 'terminal') cur = 'terminal';
        else if (root.dataset.uiMode === 'terminal') cur = 'terminal';
        else cur = 'default';
      }
      if (!cur) cur = 'default';
      const next = cur === 'terminal' ? 'default' : 'terminal';

      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (next === 'terminal') {
          root.dataset.kbPreset = 'terminal';
          root.dataset.uiMode = 'terminal';
        } else {
          delete root.dataset.kbPreset;
          root.dataset.uiMode = 'regular';
        }
      }

      const key =
        typeof props.storageKey === 'string' ? props.storageKey : 'ui-mode';
      if (key && typeof localStorage !== 'undefined') {
        try {
          // Persist blog-compatible values when using default key
          const stored =
            key === 'ui-mode'
              ? next === 'terminal'
                ? 'terminal'
                : 'regular'
              : next;
          localStorage.setItem(key, stored);
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
    let preset =
      props.value === 'default' || props.value === 'terminal'
        ? props.value
        : '';
    if (!preset && typeof document !== 'undefined') {
      const root = document.documentElement;
      if (root.dataset.kbPreset === 'terminal') preset = 'terminal';
      else if (root.dataset.uiMode === 'terminal') preset = 'terminal';
      else preset = 'default';
    }
    if (!preset) preset = 'default';
    const isRegular = preset === 'default';
    const label = isRegular ? 'ui=regular' : 'ui=terminal';

    return html`
      <button
        part="toggle-root"
        type="button"
        aria-pressed=${isRegular ? 'true' : 'false'}
        aria-label=${
          isRegular
            ? 'Switch to terminal UI preset'
            : 'Switch to regular UI preset'
        }
        title="Toggle UI mode"
      >
        ${label}
      </button>
    `;
  },
});
