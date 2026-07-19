import { defineComponent } from '@ktbsh/sdk';

/**
 * Single tab control (`role="tab"`).
 * Place inside `kitbash-tabs`. Set `selected` on the active tab; click commits
 * `selected: true` and clears `selected` on sibling `kitbash-tab` elements
 * under the same parent.
 */
export default defineComponent({
  tag: 'kitbash-tab',
  delegatesFocus: true,
  props: {
    value: { type: String, default: '' },
    selected: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--kb-font-family-sans);
    }
    button {
      appearance: none;
      box-sizing: border-box;
      min-height: 2.25rem;
      min-width: 2.25rem;
      padding: var(--kb-space-sm) var(--kb-space-md);
      margin: 0;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--kb-color-fg-muted);
      font: inherit;
      font-weight: var(--kb-font-weight-medium);
      font-size: var(--kb-font-size-md);
      cursor: pointer;
      border-radius: var(--kb-radius-sm) var(--kb-radius-sm) 0 0;
    }
    button[aria-selected="true"] {
      color: var(--kb-color-fg-default);
      border-bottom-color: var(--kb-color-accent-default);
    }
    button:hover:not(:disabled) {
      color: var(--kb-color-fg-default);
      background: var(--kb-color-bg-subtle);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  `,
  events: {
    'click button'(e: Event, { commit, props }) {
      if (props.disabled) return;
      const host = (e.currentTarget as HTMLElement).getRootNode() as ShadowRoot;
      const ce = host.host as HTMLElement;
      const parent = ce.parentElement;
      if (parent) {
        parent.querySelectorAll('kitbash-tab').forEach((el) => {
          if (el === ce) return;
          const tab = el as HTMLElement & { selected?: boolean };
          if (tab.selected) tab.selected = false;
        });
      }
      commit({ props: { selected: true } });
    },
  },
  render({ props, html }) {
    const selected = Boolean(props.selected);
    return html`
      <button
        part="tab-root"
        type="button"
        role="tab"
        aria-selected=${selected ? 'true' : 'false'}
        tabindex=${selected ? 0 : -1}
        ?disabled=${props.disabled}
        data-value=${typeof props.value === 'string' ? props.value : ''}
      >
        <slot></slot>
      </button>
    `;
  },
});
