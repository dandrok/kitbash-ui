import { defineComponent } from '@ktbsh/sdk';

/**
 * Controlled modal dialog (`open` boolean).
 *
 * A11y: `role="dialog"`, `aria-modal="true"`, optional `aria-labelledby` when
 * `title` is set. Escape and backdrop click commit `open: false`.
 * Focus trap is limited without host lifecycle — prefer focusing the panel
 * when opening from the consumer; Escape works when focus is within the host.
 */
export default defineComponent({
  tag: 'kitbash-modal',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    /** Absolute in a relative parent (Storybook); default fixed full viewport. */
    inline: { type: Boolean, default: false },
  },
  styles: `
    :host {
      font-family: var(--kb-font-family-sans);
      color: var(--kb-color-fg-default);
      box-sizing: border-box;
    }
    :host(:not([open])) {
      display: none;
    }
    :host([open]) {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      inset: 0;
      z-index: 1000;
      padding: var(--kb-space-md);
      box-sizing: border-box;
    }
    :host([open][inline]) {
      position: absolute;
      z-index: 2;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: color-mix(
        in srgb,
        var(--kb-color-fg-default) 45%,
        transparent
      );
    }
    .panel {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: min(28rem, calc(100% - 2 * var(--kb-space-md)));
      max-height: min(80vh, calc(100% - 2 * var(--kb-space-md)));
      overflow: auto;
      padding: var(--kb-space-lg);
      border-radius: var(--kb-radius-lg);
      background: var(--kb-color-bg-canvas);
      box-shadow: var(--kb-shadow-md);
      border: 1px solid var(--kb-color-border-default);
    }
    .title {
      margin: 0 0 var(--kb-space-md);
      font-size: var(--kb-font-size-lg);
      font-weight: var(--kb-font-weight-semibold);
      line-height: var(--kb-line-height-tight);
    }
    .body {
      font-size: var(--kb-font-size-md);
      line-height: var(--kb-line-height-normal);
    }
    .panel:focus {
      outline: none;
    }
    .panel:focus-visible {
      box-shadow: var(--kb-focus-ring), var(--kb-shadow-md);
    }
  `,
  events: {
    'click .backdrop'(_e: Event, { commit }) {
      commit({ props: { open: false } });
    },
    'click .panel'(e: Event) {
      e.stopPropagation();
    },
    // Listen on host so Escape works when the dialog hosts focus
    keydown(e: Event, { props, commit }) {
      if (!props.open) return;
      const ke = e as KeyboardEvent;
      if (ke.key === 'Escape' || ke.key === 'Esc') {
        commit({ props: { open: false } });
      }
    },
  },
  render({ props, html }) {
    const title =
      typeof props.title === 'string' && props.title.length > 0
        ? props.title
        : '';
    const labelledBy = title ? 'kitbash-modal-title' : null;

    return html`
      <div part="modal-backdrop" class="backdrop"></div>
      <div
        part="modal-panel"
        class="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${labelledBy}
        tabindex="0"
      >
        ${
          title
            ? html`
                <h2
                  id="kitbash-modal-title"
                  class="title"
                  part="modal-title"
                >
                  ${title}
                </h2>
              `
            : null
        }
        <div class="body" part="modal-body">
          <slot></slot>
        </div>
      </div>
    `;
  },
});
