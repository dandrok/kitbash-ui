import { defineComponent } from '@ktbsh/sdk';

/**
 * Scaffold button — production API (tag rename, variants) lands in primitives PR.
 * Styles consume semantic `--kb-*` tokens. Host overrides use `--kitbash-btn-*`
 * via `var(--kitbash-btn-bg, fallback)` so variants do not shadow host props.
 */
export default defineComponent({
  tag: 'my-button',
  delegatesFocus: true,
  props: {
    variant: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
  },
  state: {
    clickCount: 0,
  },
  styles: `
    :host {
      display: inline-block;
      --kitbash-btn-padding: var(--kb-space-sm) var(--kb-space-md);
      --kitbash-btn-radius: var(--kb-radius-sm);
      --kitbash-btn-font: var(--kb-font-size-md);
      --kitbash-btn-focus-ring: var(--kb-focus-ring);
      font-family: var(--kb-font-family-sans);
    }
    button {
      padding: var(--kitbash-btn-padding);
      border-width: 1px;
      border-style: solid;
      border-radius: var(--kitbash-btn-radius);
      cursor: pointer;
      font-size: var(--kitbash-btn-font);
      font-family: inherit;
      font-weight: var(--kb-font-weight-medium);
      line-height: var(--kb-line-height-tight);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--kitbash-btn-focus-ring);
    }
    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .primary {
      background-color: var(--kitbash-btn-bg, var(--kb-color-accent-default));
      color: var(--kitbash-btn-color, var(--kb-color-fg-on-accent));
      border-color: var(--kitbash-btn-border-color, transparent);
    }
    .secondary {
      background-color: var(--kitbash-btn-bg, var(--kb-color-bg-subtle));
      color: var(--kitbash-btn-color, var(--kb-color-fg-default));
      border-color: var(
        --kitbash-btn-border-color,
        var(--kb-color-border-default)
      );
    }
  `,
  render({ props, state, setState, html }) {
    return html`
      <button
        part="button-root"
        class=${props.variant}
        ?disabled=${props.disabled}
        onclick=${() => setState({ clickCount: Number(state.clickCount) + 1 })}
      >
        <slot></slot>
        (Clicked: ${state.clickCount})
      </button>
    `;
  },
});
