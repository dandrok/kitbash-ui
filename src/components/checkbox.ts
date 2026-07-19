import { defineComponent } from '@ktbsh/sdk';

/**
 * Checkbox (form-associated). Label via slot text or external `<label>`.
 * `checked` is boolean; user toggles emit `kitbash-change` via `commit`.
 *
 * Known SDK limit: form value may still reflect the `value` prop when unchecked
 * until the compiler supports checked-aware `setFormValue`. Prefer reading
 * `checked` from `kitbash-change` in app state for authoritative form UX.
 */
export default defineComponent({
  tag: 'kitbash-checkbox',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: 'on' },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-sm);
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
      color: var(--kb-color-fg-default);
    }
    input {
      width: 1.125rem;
      height: 1.125rem;
      min-width: 1.125rem;
      min-height: 1.125rem;
      margin: 0;
      accent-color: var(--kb-color-accent-default);
      cursor: pointer;
    }
    input:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
      border-radius: var(--kb-radius-sm);
    }
    input:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
    input[aria-invalid="true"] {
      outline: 1px solid var(--kb-color-danger-default);
    }
    .label {
      line-height: var(--kb-line-height-normal);
    }
  `,
  events: {
    'change input'(e: Event, { commit }) {
      const target = e.target as HTMLInputElement;
      commit({
        props: { checked: target.checked },
      });
    },
  },
  render({ props, html }) {
    return html`
      <input
        part="checkbox-root"
        type="checkbox"
        name=${props.name}
        value=${props.value}
        .checked=${props.checked}
        ?disabled=${props.disabled}
        ?required=${props.required}
        aria-invalid=${props.invalid ? 'true' : 'false'}
      />
      <span class="label" part="checkbox-label">
        <slot></slot>
      </span>
    `;
  },
});
