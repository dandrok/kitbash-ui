import { defineComponent } from '@ktbsh/sdk';

/**
 * Transient notification (controlled `open`).
 * Uses `role="status"` by default; `tone=danger|warning` uses `role="alert"`.
 * Position is fixed bottom-end; apps can override via CSS parts / host styles.
 * Auto-dismiss duration is left to the consumer (set `open` false).
 */
export default defineComponent({
  tag: 'kitbash-toast',
  props: {
    open: { type: Boolean, default: false },
    tone: { type: String, default: 'info' },
    title: { type: String, default: '' },
  },
  styles: `
    :host {
      font-family: var(--kb-font-family-sans);
    }
    :host(:not([open])) {
      display: none;
    }
    :host([open]) {
      display: block;
      position: fixed;
      z-index: 1100;
      right: var(--kb-space-lg);
      bottom: var(--kb-space-lg);
      max-width: min(24rem, calc(100vw - 2 * var(--kb-space-lg)));
      box-sizing: border-box;
    }
    .root {
      display: flex;
      gap: var(--kb-space-md);
      align-items: flex-start;
      box-sizing: border-box;
      padding: var(--kb-space-md);
      border-radius: var(--kb-radius-md);
      border: 1px solid var(--kb-color-border-default);
      box-shadow: var(--kb-shadow-md);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font-size: var(--kb-font-size-md);
      line-height: var(--kb-line-height-normal);
    }
    .info { border-color: var(--kb-color-accent-default); }
    .success { border-color: var(--kb-color-success-default); }
    .warning { border-color: var(--kb-color-warning-default); }
    .danger { border-color: var(--kb-color-danger-default); }
    .body { flex: 1; min-width: 0; }
    .title {
      margin: 0 0 var(--kb-space-2xs);
      font-weight: var(--kb-font-weight-semibold);
    }
    .close {
      flex-shrink: 0;
      min-width: 2rem;
      min-height: 2rem;
      border: none;
      border-radius: var(--kb-radius-sm);
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: var(--kb-font-size-lg);
      line-height: 1;
      font-family: inherit;
    }
    .close:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
  `,
  events: {
    'click .close'(_e: Event, { commit }) {
      commit({ props: { open: false } });
    },
  },
  render({ props, html }) {
    const tone =
      props.tone === 'success' ||
      props.tone === 'warning' ||
      props.tone === 'danger'
        ? props.tone
        : 'info';
    const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
    const title =
      typeof props.title === 'string' && props.title.length > 0
        ? props.title
        : '';

    return html`
      <div part="toast-root" class=${`root ${tone}`} role=${role}>
        <div class="body" part="toast-body">
          ${
            title
              ? html`<div class="title" part="toast-title">${title}</div>`
              : null
          }
          <div part="toast-content"><slot></slot></div>
        </div>
        <button
          type="button"
          class="close"
          part="toast-close"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    `;
  },
});
