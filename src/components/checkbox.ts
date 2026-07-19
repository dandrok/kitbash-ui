import { defineComponent } from '@ktbsh/sdk';

/**
 * Checkbox (form-associated). Custom drawn control (not OS chrome).
 * Label via slot text or external `<label>`.
 *
 * Known SDK limit: form value may still reflect the `value` prop when unchecked
 * until the compiler supports checked-aware `setFormValue`.
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
      appearance: none;
      -webkit-appearance: none;
      box-sizing: border-box;
      width: 1.15em;
      height: 1.15em;
      min-width: 1.15em;
      min-height: 1.15em;
      margin: 0;
      flex-shrink: 0;
      display: grid;
      place-content: center;
      border: 2px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-on-accent);
      cursor: pointer;
      transition:
        background-color 0.12s ease,
        border-color 0.12s ease,
        box-shadow 0.12s ease;
    }
    input::before {
      content: '';
      width: 0.65em;
      height: 0.65em;
      transform: scale(0);
      transition: transform 0.12s ease;
      box-shadow: inset 1em 1em currentColor;
      clip-path: polygon(
        14% 44%,
        0 65%,
        50% 100%,
        100% 16%,
        80% 0%,
        43% 62%
      );
    }
    input:hover:not(:disabled) {
      border-color: var(--kb-color-border-focus);
    }
    input:checked {
      background: var(--kb-color-accent-default);
      border-color: var(--kb-color-accent-default);
    }
    input:checked::before {
      transform: scale(1);
    }
    input:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    input:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    input[aria-invalid='true'] {
      border-color: var(--kb-color-danger-default);
    }
    .label {
      line-height: var(--kb-line-height-normal);
    }
    @media (prefers-reduced-motion: reduce) {
      input,
      input::before {
        transition: none;
      }
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
