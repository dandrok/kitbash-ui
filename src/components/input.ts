import { defineComponent } from '@ktbsh/sdk';

/**
 * Form-associated input scaffold — consumes semantic `--kb-*` tokens.
 * Label composition and full a11y polish land with primitives.
 */
export default defineComponent({
  tag: 'kitbash-input',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
  state: {
    touched: false,
  },
  styles: `
    :host {
      display: inline-block;
      --kitbash-input-border: var(--kb-color-border-default);
      --kitbash-input-border-focus: var(--kb-color-border-focus);
      --kitbash-input-border-invalid: var(--kb-color-danger-default);
      --kitbash-input-padding: var(--kb-space-sm) var(--kb-space-md);
      --kitbash-input-radius: var(--kb-radius-sm);
      --kitbash-input-bg: var(--kb-color-bg-canvas);
      --kitbash-input-fg: var(--kb-color-fg-default);
      --kitbash-input-focus-ring: var(--kb-focus-ring);
      width: 100%;
      font-family: var(--kb-font-family-sans);
    }
    input {
      padding: var(--kitbash-input-padding);
      border: 1px solid var(--kitbash-input-border);
      border-radius: var(--kitbash-input-radius);
      background-color: var(--kitbash-input-bg);
      color: var(--kitbash-input-fg);
      font-size: var(--kb-font-size-md);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
      line-height: var(--kb-line-height-normal);
    }
    input::placeholder {
      color: var(--kb-color-fg-subtle);
    }
    input:focus {
      border-color: var(--kitbash-input-border-focus);
      box-shadow: var(--kitbash-input-focus-ring);
    }
    input[aria-invalid="true"] {
      border-color: var(--kitbash-input-border-invalid);
    }
  `,
  events: {
    // One commit → one re-render → one kitbash-change with fresh props.value
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

    return html`
      <input
        part="input-root"
        name=${props.name}
        .value=${props.value}
        placeholder=${props.placeholder}
        ?required=${props.required}
        aria-invalid=${isInvalid ? 'true' : 'false'}
      />
    `;
  },
});
