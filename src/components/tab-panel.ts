import { defineComponent } from '@ktbsh/sdk';

/**
 * Tab panel (`role="tabpanel"`). Controlled by `open` (or show when parent app
 * sets open based on selected tab value).
 */
export default defineComponent({
  tag: 'kitbash-tab-panel',
  props: {
    value: { type: String, default: '' },
    open: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
      color: var(--kb-color-fg-default);
    }
    :host(:not([open])) {
      display: none;
    }
    .panel {
      padding: var(--kb-space-md) 0;
      font-size: var(--kb-font-size-md);
      line-height: var(--kb-line-height-normal);
    }
    .panel:focus {
      outline: none;
    }
    .panel:focus-visible {
      box-shadow: var(--kb-focus-ring);
      border-radius: var(--kb-radius-sm);
    }
  `,
  render({ props, html }) {
    return html`
      <div
        part="tab-panel-root"
        class="panel"
        role="tabpanel"
        tabindex="0"
        data-value=${typeof props.value === 'string' ? props.value : ''}
      >
        <slot></slot>
      </div>
    `;
  },
});
