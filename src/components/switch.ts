import { defineComponent } from '@ktbsh/sdk';

/**
 * Toggle switch (form-associated checkbox under the hood + `role="switch"`).
 * `checked` commits on change. Slot = optional adjacent label text.
 */
export default defineComponent({
  tag: 'kitbash-switch',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: 'on' },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
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
    .track-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }
    input {
      position: absolute;
      opacity: 0;
      width: 2.75rem;
      height: 1.5rem;
      margin: 0;
      cursor: pointer;
      z-index: 1;
    }
    input:disabled {
      cursor: not-allowed;
    }
    .track {
      display: block;
      width: 2.75rem;
      height: 1.5rem;
      border-radius: var(--kb-radius-full);
      background: var(--kb-color-bg-subtle);
      border: 1px solid var(--kb-color-border-default);
      box-sizing: border-box;
      transition: background 0.15s ease, border-color 0.15s ease;
      pointer-events: none;
    }
    .thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(1.5rem - 6px);
      height: calc(1.5rem - 6px);
      border-radius: var(--kb-radius-full);
      background: var(--kb-color-bg-canvas);
      box-shadow: var(--kb-shadow-sm);
      transition: transform 0.15s ease;
      pointer-events: none;
    }
    input:checked + .track {
      background: var(--kb-color-accent-default);
      border-color: var(--kb-color-accent-default);
    }
    input:checked + .track .thumb {
      transform: translateX(1.25rem);
    }
    input:focus-visible + .track {
      box-shadow: var(--kb-focus-ring);
    }
    input:disabled + .track {
      opacity: 0.55;
    }
    input[aria-invalid="true"] + .track {
      border-color: var(--kb-color-danger-default);
    }
    .label {
      line-height: var(--kb-line-height-normal);
    }
    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }
  `,
  events: {
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
      <label part="switch-container" class="label-wrap">
        <span class="track-wrap" part="switch-wrap">
          <input
            part="switch-input"
            type="checkbox"
            role="switch"
            name=${props.name}
            value=${props.value}
            .checked=${props.checked}
            ?disabled=${props.disabled}
            aria-invalid=${props.invalid ? 'true' : 'false'}
          />
          <span class="track" part="switch-track" aria-hidden="true">
            <span class="thumb" part="switch-thumb"></span>
          </span>
        </span>
        <span class="label" part="switch-label"><slot></slot></span>
      </label>
    `;
  },
});
