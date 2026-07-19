import { defineComponent } from '@ktbsh/sdk';

/**
 * Primary action control.
 *
 * A11y: native `<button>`, `delegatesFocus`, visible focus ring, disabled semantics.
 * Variants: primary | secondary | ghost | danger. Size: sm | md | lg.
 * Host overrides: `--kitbash-btn-bg`, `--kitbash-btn-color`, `--kitbash-btn-border-color`
 * (use `var(--kitbash-btn-*, fallback)` so host styles are not shadowed).
 */
export default defineComponent({
  tag: 'kitbash-button',
  delegatesFocus: true,
  props: {
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
  },
  events: {
    // Shadow-contained submit/reset do not natively drive a light-DOM form.
    'click button'(e: Event, { props }) {
      if (props.disabled) return;
      const type =
        props.type === 'submit' || props.type === 'reset'
          ? props.type
          : 'button';
      if (type === 'button') return;
      const root = (e.currentTarget as HTMLElement).getRootNode() as ShadowRoot;
      const host = root.host as HTMLElement | undefined;
      const form = host?.closest?.('form');
      if (!form) return;
      if (type === 'submit') form.requestSubmit();
      else form.reset();
    },
  },
  styles: `
    :host {
      display: inline-block;
      --kitbash-btn-padding-y: var(--kb-space-sm);
      --kitbash-btn-padding-x: var(--kb-space-md);
      --kitbash-btn-radius: var(--kb-radius-sm);
      --kitbash-btn-font: var(--kb-font-size-md);
      --kitbash-btn-focus-ring: var(--kb-focus-ring);
      font-family: var(--kb-font-family-sans);
    }
    :host([size="sm"]) {
      --kitbash-btn-padding-y: var(--kb-space-xs);
      --kitbash-btn-padding-x: var(--kb-space-sm);
      --kitbash-btn-font: var(--kb-font-size-sm);
    }
    :host([size="lg"]) {
      --kitbash-btn-padding-y: var(--kb-space-md);
      --kitbash-btn-padding-x: var(--kb-space-lg);
      --kitbash-btn-font: var(--kb-font-size-lg);
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--kb-space-xs);
      box-sizing: border-box;
      min-height: 2.25rem;
      min-width: 2.25rem;
      padding: var(--kitbash-btn-padding-y) var(--kitbash-btn-padding-x);
      border-width: 1px;
      border-style: solid;
      border-radius: var(--kitbash-btn-radius);
      cursor: pointer;
      font-size: var(--kitbash-btn-font);
      font-family: inherit;
      font-weight: var(--kb-font-weight-medium);
      line-height: var(--kb-line-height-tight);
    }
    :host([size="sm"]) button {
      min-height: 2rem;
      min-width: 2rem;
    }
    :host([size="lg"]) button {
      min-height: 2.75rem;
      min-width: 2.75rem;
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
    .ghost {
      background-color: var(--kitbash-btn-bg, transparent);
      color: var(--kitbash-btn-color, var(--kb-color-fg-default));
      border-color: var(--kitbash-btn-border-color, transparent);
    }
    .danger {
      background-color: var(--kitbash-btn-bg, var(--kb-color-danger-default));
      color: var(--kitbash-btn-color, var(--kb-color-fg-on-accent));
      border-color: var(--kitbash-btn-border-color, transparent);
    }
  `,
  render({ props, html }) {
    const variant =
      props.variant === 'secondary' ||
      props.variant === 'ghost' ||
      props.variant === 'danger'
        ? props.variant
        : 'primary';
    const type =
      props.type === 'submit' || props.type === 'reset' ? props.type : 'button';

    return html`
      <button
        part="button-root"
        class=${variant}
        type=${type}
        ?disabled=${props.disabled}
      >
        <slot></slot>
      </button>
    `;
  },
});
