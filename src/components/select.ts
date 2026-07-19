import { defineComponent } from '@ktbsh/sdk';

/**
 * Native select (form-associated). Options provided as light-DOM `<option>` children.
 *
 * @example
 * ```html
 * <kitbash-select name="country" value="pl">
 *   <option value="">Choose…</option>
 *   <option value="pl">Poland</option>
 * </kitbash-select>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-select',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
  },
  styles: `
    :host {
      display: inline-block;
      width: 100%;
      font-family: var(--kb-font-family-sans);
    }
    select {
      box-sizing: border-box;
      width: 100%;
      min-height: 2.25rem;
      padding: var(--kb-space-sm) var(--kb-space-md);
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font-size: var(--kb-font-size-md);
      font-family: inherit;
      line-height: var(--kb-line-height-normal);
      cursor: pointer;
      outline: none;
    }
    :host([size="sm"]) select {
      min-height: 2rem;
      font-size: var(--kb-font-size-sm);
      padding: var(--kb-space-xs) var(--kb-space-sm);
    }
    :host([size="lg"]) select {
      min-height: 2.75rem;
      font-size: var(--kb-font-size-lg);
    }
    select:focus {
      border-color: var(--kb-color-border-focus);
      box-shadow: var(--kb-focus-ring);
    }
    select:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    select[aria-invalid="true"] {
      border-color: var(--kb-color-danger-default);
    }
  `,
  events: {
    'change select'(e: Event, { commit }) {
      const target = e.target as HTMLSelectElement;
      commit({
        props: { value: target.value },
      });
    },
    // Options project after first paint; re-apply value when slot changes.
    'slotchange slot'(e: Event, { props }) {
      const slot = e.target as HTMLSlotElement;
      const select = slot.parentElement as HTMLSelectElement | null;
      if (!select) return;
      const next = typeof props.value === 'string' ? props.value : '';
      if (select.value !== next) {
        select.value = next;
      }
    },
  },
  render({ props, html }) {
    return html`
      <select
        part="select-root"
        name=${props.name}
        .value=${props.value}
        ?disabled=${props.disabled}
        ?required=${props.required}
        aria-invalid=${props.invalid ? 'true' : 'false'}
      >
        <slot></slot>
      </select>
    `;
  },
});
