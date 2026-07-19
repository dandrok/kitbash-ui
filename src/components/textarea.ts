import { defineComponent } from '@ktbsh/sdk';

/** Multi-line text field (form-associated). Pair with `kitbash-label`. */
export default defineComponent({
  tag: 'kitbash-textarea',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
  },
  state: {
    touched: false,
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--kb-font-family-sans);
    }
    textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 5rem;
      padding: var(--kb-space-sm) var(--kb-space-md);
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font-size: var(--kb-font-size-md);
      font-family: inherit;
      line-height: var(--kb-line-height-normal);
      resize: vertical;
      outline: none;
    }
    textarea::placeholder {
      color: var(--kb-color-fg-subtle);
    }
    textarea:focus {
      border-color: var(--kb-color-border-focus);
      box-shadow: var(--kb-focus-ring);
    }
    textarea:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      resize: none;
    }
    textarea[aria-invalid="true"] {
      border-color: var(--kb-color-danger-default);
    }
  `,
  events: {
    'input textarea'(e: Event, { commit }) {
      const target = e.target as HTMLTextAreaElement;
      commit({
        props: { value: target.value },
        state: { touched: true },
      });
    },
  },
  render({ props, state, html }) {
    const isInvalid =
      props.invalid || (props.required && state.touched && !props.value);
    const rows =
      typeof props.rows === 'number' && props.rows > 0 ? props.rows : 3;

    return html`
      <textarea
        part="textarea-root"
        name=${props.name}
        rows=${rows}
        .value=${props.value}
        placeholder=${props.placeholder}
        ?required=${props.required}
        ?disabled=${props.disabled}
        ?readonly=${props.readonly}
        aria-invalid=${isInvalid ? 'true' : 'false'}
      ></textarea>
    `;
  },
});
