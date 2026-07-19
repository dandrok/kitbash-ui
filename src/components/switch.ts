import { defineComponent } from '@ktbsh/sdk';

/**
 * Toggle switch (checkbox + `role="switch"`).
 *
 * Visual: squared “slab” track (terminal-friendly) with a solid thumb and
 * fixed 1/0 gutter glyphs — not a generic iOS pill. All colors from `--kb-*`.
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
      --kitbash-switch-w: 2.85rem;
      --kitbash-switch-h: 1.45rem;
      --kitbash-switch-pad: 3px;
      --kitbash-switch-thumb: calc(
        var(--kitbash-switch-h) - 2 * var(--kitbash-switch-pad)
      );
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
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      border: 2px solid var(--kb-color-border-default);
      transition:
        background 0.15s ease,
        border-color 0.15s ease;
      pointer-events: none;
      overflow: hidden;
    }
    /* Terminal-ish status glyphs in the gutter */
    .track::before,
    .track::after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.55rem;
      font-weight: var(--kb-font-weight-semibold);
      letter-spacing: 0.04em;
      line-height: 1;
      pointer-events: none;
      opacity: 0.55;
    }
    .track::before {
      content: '1';
      left: 0.35rem;
      color: var(--kb-color-fg-on-accent);
      opacity: 0;
    }
    .track::after {
      content: '0';
      right: 0.35rem;
      color: var(--kb-color-fg-muted);
      opacity: 0.7;
    }
    .thumb {
      position: absolute;
      z-index: 1;
      top: var(--kitbash-switch-pad);
      left: var(--kitbash-switch-pad);
      width: var(--kitbash-switch-thumb);
      height: var(--kitbash-switch-thumb);
      border-radius: calc(var(--kb-radius-sm) - 1px);
      background: var(--kb-color-fg-muted);
      border: 1px solid var(--kb-color-border-default);
      box-shadow: var(--kb-shadow-sm);
      transition:
        transform 0.15s ease,
        background 0.15s ease,
        border-color 0.15s ease;
      pointer-events: none;
    }
    input:checked + .track {
      background: var(--kb-color-accent-default);
      border-color: var(--kb-color-accent-default);
    }
    input:checked + .track::before {
      opacity: 0.9;
    }
    input:checked + .track::after {
      opacity: 0;
    }
    input:checked + .track .thumb {
      transform: translateX(
        calc(
          var(--kitbash-switch-w) - var(--kitbash-switch-thumb) - 2 *
            var(--kitbash-switch-pad) - 4px
        )
      );
      background: var(--kb-color-fg-on-accent);
      border-color: transparent;
      box-shadow: none;
    }
    input:focus-visible + .track {
      box-shadow: var(--kb-focus-ring);
    }
    input:disabled + .track {
      opacity: 0.5;
    }
    input[aria-invalid='true'] + .track {
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
