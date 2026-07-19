import { defineComponent } from '@ktbsh/sdk';

/**
 * Radio option (form-associated).
 * Same `name` groups options across shadow roots (manual uncheck).
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
      vertical-align: middle;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
      color: var(--kb-color-fg-default);
    }
    .label-wrap {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-sm);
      cursor: pointer;
      user-select: none;
    }
    input {
      appearance: auto;
      width: 1.5rem;
      height: 1.5rem;
      min-width: 1.5rem;
      min-height: 1.5rem;
      margin: 0;
      flex-shrink: 0;
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
    // Outer <label for> retargets onto the host only — not shadow UI
    click(e: Event) {
      const host = e.currentTarget as HTMLElement;
      if (e.composedPath()[0] !== host) return;
      const input = host.shadowRoot?.querySelector('input');
      if (!input || input.disabled) return;
      input.click();
    },
    'change input'(e: Event, { commit, props }) {
      const target = e.target as HTMLInputElement;
      const host = (target.getRootNode() as ShadowRoot).host as HTMLElement;
      const name = typeof props.name === 'string' ? props.name : '';

      if (target.checked && name && typeof document !== 'undefined') {
        // Group only within the same form (or both formless), not document-wide
        const formOwner = host.closest('form');
        const radios: HTMLElement[] = [];
        const walk = (root: ParentNode) => {
          root.querySelectorAll('kitbash-radio').forEach((el) => {
            radios.push(el as HTMLElement);
          });
          root.querySelectorAll('*').forEach((el) => {
            const sr = (el as HTMLElement).shadowRoot;
            if (sr) walk(sr);
          });
        };
        walk(document);

        radios.forEach((el) => {
          if (el === host) return;
          const otherForm = el.closest('form');
          if (otherForm !== formOwner) return;
          const other = el as HTMLElement & {
            name?: string;
            checked?: boolean;
          };
          if (other.name === name && other.checked) {
            other.checked = false;
          }
        });
      }

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
