import { defineComponent } from '@ktbsh/sdk';

/** Compact status / metadata chip. Decorative by default (no role); set label text as children. */
export default defineComponent({
  tag: 'kitbash-badge',
  props: {
    tone: { type: String, default: 'neutral' },
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--kb-font-family-sans);
    }
    span {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      padding: var(--kb-space-2xs) var(--kb-space-sm);
      border-radius: var(--kb-radius-full);
      font-size: var(--kb-font-size-sm);
      font-weight: var(--kb-font-weight-medium);
      line-height: var(--kb-line-height-tight);
      white-space: nowrap;
    }
    .neutral {
      background: var(--kb-color-bg-subtle);
      color: var(--kb-color-fg-default);
    }
    .accent {
      background: var(--kb-color-accent-subtle);
      color: var(--kb-color-accent-default);
    }
    .success {
      background: var(--kb-color-success-subtle);
      color: var(--kb-color-success-default);
    }
    .warning {
      background: var(--kb-color-warning-subtle);
      color: var(--kb-color-warning-default);
    }
    .danger {
      background: var(--kb-color-danger-subtle);
      color: var(--kb-color-danger-default);
    }
  `,
  render({ props, html }) {
    const tone =
      props.tone === 'accent' ||
      props.tone === 'success' ||
      props.tone === 'warning' ||
      props.tone === 'danger'
        ? props.tone
        : 'neutral';

    return html`
      <span part="badge-root" class=${tone}>
        <slot></slot>
      </span>
    `;
  },
});
