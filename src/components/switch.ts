import { defineComponent } from '@ktbsh/sdk';

/**
 * Toggle switch (checkbox + `role="switch"`).
 * Track/thumb decorative; full-size transparent input is the hit target.
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
      vertical-align: middle;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
      color: var(--kb-color-fg-default);
      --kitbash-switch-w: 2.75rem;
      --kitbash-switch-h: 1.5rem;
      --kitbash-switch-pad: 2px;
      --kitbash-switch-thumb: calc(
        var(--kitbash-switch-h) - 2 * var(--kitbash-switch-pad)
      );
      --kitbash-switch-track: var(--kb-color-bg-subtle);
      --kitbash-switch-track-on: var(--kb-color-accent-default);
      --kitbash-switch-knob: #ffffff;
    }
    .label-wrap {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-sm);
      cursor: pointer;
      user-select: none;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: var(--kitbash-switch-w);
      height: var(--kitbash-switch-h);
      flex-shrink: 0;
    }
    input {
      position: absolute;
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
    input:disabled {
      cursor: not-allowed;
    }
    .track {
      position: absolute;
      inset: 0;
      z-index: 0;
      box-sizing: border-box;
      border-radius: 999px;
      background: var(--kitbash-switch-track);
      border: 1px solid var(--kb-color-border-default);
      transition: background 0.15s ease, border-color 0.15s ease;
      pointer-events: none;
    }
    .thumb {
      position: absolute;
      z-index: 1;
      top: var(--kitbash-switch-pad);
      left: var(--kitbash-switch-pad);
      width: var(--kitbash-switch-thumb);
      height: var(--kitbash-switch-thumb);
      border-radius: 999px;
      background: var(--kitbash-switch-knob);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.15s ease;
      pointer-events: none;
    }
    input:checked + .track {
      background: var(--kitbash-switch-track-on);
      border-color: var(--kitbash-switch-track-on);
    }
    input:checked + .track .thumb {
      transform: translateX(
        calc(
          var(--kitbash-switch-w) - var(--kitbash-switch-thumb) - 2 *
            var(--kitbash-switch-pad)
        )
      );
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
      if (e.composedPath()[0] !== host) return;
      const input = host.shadowRoot?.querySelector('input');
      if (!input || input.disabled) return;
      input.click();
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
        <span class="switch" part="switch-wrap">
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
