import { defineComponent } from '@ktbsh/sdk';

/**
 * Radio option (form-associated).
 * Use the same `name` across options in a group. Slot = visible label text.
 *
 * Note: cross-CE radio grouping depends on browser form association;
 * prefer placing radios in one form and reading `kitbash-change` for UI state.
 */
export default defineComponent({
  tag: 'kitbash-radio',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
      color: var(--kb-color-fg-default);
    }
    .label-wrap {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-sm);
      cursor: pointer;
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
      border-radius: var(--kb-radius-full);
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
    // Outer <label> click activates host CE — forward to shadow input once
    click(e: Event) {
      const host = e.currentTarget as HTMLElement;
      const input = host.shadowRoot?.querySelector('input');
      if (!input || input.disabled) return;
      if (!e.composedPath().includes(input)) {
        input.click();
      }
    },
    'change input'(e: Event, { commit }) {
      const target = e.target as HTMLInputElement;
      commit({
        props: { checked: target.checked },
      });
    },
  },
  render({ props, html }) {
    return html`
      <label part="radio-container" class="label-wrap">
        <input
          part="radio-root"
          type="radio"
          name=${props.name}
          value=${props.value}
          .checked=${props.checked}
          ?disabled=${props.disabled}
          ?required=${props.required}
          aria-invalid=${props.invalid ? 'true' : 'false'}
        />
        <span class="label" part="radio-label"><slot></slot></span>
      </label>
    `;
  },
});
