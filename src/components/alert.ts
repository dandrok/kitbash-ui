import { defineComponent } from '@ktbsh/sdk';

/**
 * Inline status message.
 * - `tone=danger|warning` → `role="alert"` (assertive)
 * - `tone=info|success` → `role="status"` (polite)
 * Optional dismiss control commits `open: false` when `dismissible`.
 */
export default defineComponent({
  tag: 'kitbash-alert',
  props: {
    tone: { type: String, default: 'info' },
    title: { type: String, default: '' },
    open: { type: Boolean, default: true },
    dismissible: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    :host([open]) {
      display: block;
    }
    :host(:not([open])) {
      display: none;
    }
    .root {
      display: flex;
      gap: var(--kb-space-md);
      align-items: flex-start;
      box-sizing: border-box;
      padding: var(--kb-space-md);
      border-radius: var(--kb-radius-md);
      border: 1px solid var(--kb-color-border-default);
      font-size: var(--kb-font-size-md);
      line-height: var(--kb-line-height-normal);
    }
    .info {
      background: var(--kb-color-accent-subtle);
      border-color: var(--kb-color-accent-default);
      color: var(--kb-color-fg-default);
    }
    .success {
      background: var(--kb-color-success-subtle);
      border-color: var(--kb-color-success-default);
      color: var(--kb-color-fg-default);
    }
    .warning {
      background: var(--kb-color-warning-subtle);
      border-color: var(--kb-color-warning-default);
      color: var(--kb-color-fg-default);
    }
    .danger {
      background: var(--kb-color-danger-subtle);
      border-color: var(--kb-color-danger-default);
      color: var(--kb-color-fg-default);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .title {
      margin: 0 0 var(--kb-space-2xs);
      font-weight: var(--kb-font-weight-semibold);
      font-size: var(--kb-font-size-md);
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
      <div part="alert-root" class=${`root ${tone}`} role=${role}>
        <div class="body" part="alert-body">
          ${
            title
              ? html`<div class="title" part="alert-title">${title}</div>`
              : null
          }
          <div part="alert-content"><slot></slot></div>
        </div>
        ${
          props.dismissible
            ? html`
                <button
                  type="button"
                  class="close"
                  part="alert-close"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              `
            : null
        }
      </div>
    `;
  },
});
