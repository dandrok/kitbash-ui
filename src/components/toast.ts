import { defineComponent } from '@ktbsh/sdk';

/**
 * Transient notification (controlled `open`).
 * Uses `role="status"` by default; `tone=danger|warning` uses `role="alert"`.
 *
 * Placement: fixed bottom-end by default. Set `inline` for absolute positioning
 * inside a relative parent (Storybook demos / embedded panels).
 * Auto-dismiss is left to the consumer (set `open` false).
 */
export default defineComponent({
  tag: 'kitbash-toast',
  props: {
    open: { type: Boolean, default: false },
    tone: { type: String, default: 'info' },
    title: { type: String, default: '' },
    /** When true, position absolute (for demos); default fixed to viewport. */
    inline: { type: Boolean, default: false },
  },
  styles: `
    :host {
      font-family: var(--kb-font-family-sans);
      box-sizing: border-box;
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
      max-width: min(22rem, calc(100vw - 2 * var(--kb-space-lg)));
      box-sizing: border-box;
    }
    :host([open][inline]) {
      position: absolute;
      z-index: 2;
    }
    .root {
      display: flex;
      gap: var(--kb-space-sm);
      align-items: flex-start;
      box-sizing: border-box;
      padding: var(--kb-space-sm) var(--kb-space-md);
      border-radius: var(--kb-radius-md);
      border: 1px solid var(--kb-color-border-default);
      border-left-width: 3px;
      box-shadow: var(--kb-shadow-md);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font-size: var(--kb-font-size-sm);
      line-height: var(--kb-line-height-normal);
    }
    .info {
      border-left-color: var(--kb-color-accent-default);
      background: var(--kb-color-accent-subtle);
      border-color: color-mix(
        in srgb,
        var(--kb-color-accent-default) 35%,
        var(--kb-color-border-default)
      );
    }
    .success {
      border-left-color: var(--kb-color-success-default);
      background: var(--kb-color-success-subtle);
      border-color: color-mix(
        in srgb,
        var(--kb-color-success-default) 35%,
        var(--kb-color-border-default)
      );
    }
    .warning {
      border-left-color: var(--kb-color-warning-default);
      background: var(--kb-color-warning-subtle);
      border-color: color-mix(
        in srgb,
        var(--kb-color-warning-default) 35%,
        var(--kb-color-border-default)
      );
    }
    .danger {
      border-left-color: var(--kb-color-danger-default);
      background: var(--kb-color-danger-subtle);
      border-color: color-mix(
        in srgb,
        var(--kb-color-danger-default) 35%,
        var(--kb-color-border-default)
      );
    }
    .body {
      flex: 1;
      min-width: 0;
      padding-block: 0.1rem;
    }
    .title {
      margin: 0 0 var(--kb-space-2xs);
      font-weight: var(--kb-font-weight-semibold);
      font-size: var(--kb-font-size-md);
      line-height: var(--kb-line-height-tight);
      color: var(--kb-color-fg-default);
    }
    .message {
      margin: 0;
      color: var(--kb-color-fg-default);
    }
    .close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.75rem;
      min-height: 1.75rem;
      margin: calc(-1 * var(--kb-space-2xs)) calc(-1 * var(--kb-space-2xs)) 0 0;
      border: none;
      border-radius: var(--kb-radius-sm);
      background: transparent;
      color: var(--kb-color-fg-muted);
      cursor: pointer;
      font-size: var(--kb-font-size-lg);
      line-height: 1;
      font-family: inherit;
    }
    .close:hover {
      color: var(--kb-color-fg-default);
      background: color-mix(
        in srgb,
        var(--kb-color-fg-default) 8%,
        transparent
      );
    }
    .close:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
      color: var(--kb-color-fg-default);
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
          <div class="message" part="toast-content"><slot></slot></div>
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
