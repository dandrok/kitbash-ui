import { defineComponent } from '@ktbsh/sdk';

/**
 * Single-line text field (form-associated).
 *
 * A11y: pair with `kitbash-label` (or wrapping `<label>`), `aria-invalid`,
 * optional `aria-describedby` via host attribute when consumers set it.
 * Prefer property binding `.value` from React to avoid focus loss.
 */
export default defineComponent({
  tag: 'kitbash-input',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
  },
  state: {
    touched: false,
  },
  styles: `
    :host {
      display: inline-block;
      width: 100%;
      --kitbash-input-border: var(--kb-color-border-default);
      --kitbash-input-border-focus: var(--kb-color-border-focus);
      --kitbash-input-border-invalid: var(--kb-color-danger-default);
      --kitbash-input-padding-y: var(--kb-space-sm);
      --kitbash-input-padding-x: var(--kb-space-md);
      --kitbash-input-radius: var(--kb-radius-sm);
      --kitbash-input-bg: var(--kb-color-bg-canvas);
      --kitbash-input-fg: var(--kb-color-fg-default);
      --kitbash-input-focus-ring: var(--kb-focus-ring);
      --kitbash-input-font: var(--kb-font-size-md);
      font-family: var(--kb-font-family-sans);
    }
    :host([size="sm"]) {
      --kitbash-input-padding-y: var(--kb-space-xs);
      --kitbash-input-padding-x: var(--kb-space-sm);
      --kitbash-input-font: var(--kb-font-size-sm);
    }
    :host([size="lg"]) {
      --kitbash-input-padding-y: var(--kb-space-md);
      --kitbash-input-padding-x: var(--kb-space-md);
      --kitbash-input-font: var(--kb-font-size-lg);
    }
    input {
      box-sizing: border-box;
      width: 100%;
      min-height: 2.25rem;
      padding: var(--kitbash-input-padding-y) var(--kitbash-input-padding-x);
      border: 1px solid var(--kitbash-input-border);
      border-radius: var(--kitbash-input-radius);
      background-color: var(--kitbash-input-bg);
      color: var(--kitbash-input-fg);
      font-size: var(--kitbash-input-font);
      outline: none;
      font-family: inherit;
      line-height: var(--kb-line-height-normal);
    }
    :host([size="sm"]) input {
      min-height: 2rem;
    }
    :host([size="lg"]) input {
      min-height: 2.75rem;
    }
    input::placeholder {
      color: var(--kb-color-fg-subtle);
    }
    input:focus {
      border-color: var(--kitbash-input-border-focus);
      box-shadow: var(--kitbash-input-focus-ring);
    }
    input:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    input[aria-invalid="true"] {
      border-color: var(--kitbash-input-border-invalid);
    }
  `,
  events: {
    // eventName first, then shadow selector (SDK bindEvents)
    'input input'(e: Event, { commit }) {
      const target = e.target as HTMLInputElement;
      commit({
        props: { value: target.value },
        state: { touched: true },
      });
    },
  },
  render({ props, state, html }) {
    const isInvalid =
      props.invalid || (props.required && state.touched && !props.value);
    const type =
      typeof props.type === 'string' && props.type.length > 0
        ? props.type
        : 'text';

    return html`
      <input
        part="input-root"
        name=${props.name}
        type=${type}
        .value=${props.value}
        placeholder=${props.placeholder}
        ?required=${props.required}
        ?disabled=${props.disabled}
        ?readonly=${props.readonly}
        aria-invalid=${isInvalid ? 'true' : 'false'}
      />
    `;
  },
});
