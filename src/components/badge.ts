import { defineComponent } from '@ktbsh/sdk';

/**
 * Compact status chip or blog-style tag.
 *
 * - `variant="soft"` (default): filled pill (status metadata).
 * - `variant="tag"`: outline chip matching blog `TagList` (`#label` when `hash`).
 *
 * Colors follow the active preset (terminal green / default accent).
 */
export default defineComponent({
  tag: 'kitbash-badge',
  props: {
    tone: { type: String, default: 'neutral' },
    /** `soft` = filled pill; `tag` = outline chip (blog tags). */
    variant: { type: String, default: 'soft' },
    /** When true, show a leading `#` (blog tag convention). */
    hash: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline-flex;
      max-width: 100%;
      font-family: var(--kb-font-family-sans);
      vertical-align: middle;
    }
    span {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      max-width: 100%;
      gap: 0;
      font-weight: var(--kb-font-weight-medium);
      line-height: var(--kb-line-height-tight);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Soft status pill */
    .v-soft {
      padding: var(--kb-space-2xs) var(--kb-space-sm);
      border-radius: var(--kb-radius-full);
      border: 1px solid transparent;
      font-size: var(--kb-font-size-sm);
    }
    .v-soft.neutral {
      background: var(--kb-color-bg-subtle);
      color: var(--kb-color-fg-default);
    }
    .v-soft.accent {
      background: var(--kb-color-accent-subtle);
      color: var(--kb-color-accent-default);
    }
    .v-soft.success {
      background: var(--kb-color-success-subtle);
      color: var(--kb-color-success-default);
    }
    .v-soft.warning {
      background: var(--kb-color-warning-subtle);
      color: var(--kb-color-warning-default);
    }
    .v-soft.danger {
      background: var(--kb-color-danger-subtle);
      color: var(--kb-color-danger-default);
    }
    /*
     * Tag outline (blog TagList): border + wash, tighter radius, smaller type.
     * Terminal preset → Matrix green via --kb-color-accent-*.
     */
    .v-tag {
      padding: var(--kb-space-2xs) var(--kb-space-sm);
      border-radius: var(--kb-radius-sm);
      border: 1px solid var(--kb-color-border-default);
      font-size: var(--kb-font-size-sm);
      letter-spacing: 0.02em;
    }
    .v-tag.neutral {
      background: var(--kb-color-bg-subtle);
      border-color: var(--kb-color-border-default);
      color: var(--kb-color-fg-muted);
    }
    .v-tag.accent {
      background: var(--kb-color-accent-subtle);
      border-color: var(--kb-color-accent-default);
      color: var(--kb-color-accent-default);
      /* Soften border like blog green-500/30 (fallback solid above) */
      border-color: color-mix(
        in srgb,
        var(--kb-color-accent-default) 35%,
        transparent
      );
    }
    .v-tag.success {
      background: var(--kb-color-success-subtle);
      border-color: var(--kb-color-success-default);
      color: var(--kb-color-success-default);
      border-color: color-mix(
        in srgb,
        var(--kb-color-success-default) 35%,
        transparent
      );
    }
    .v-tag.warning {
      background: var(--kb-color-warning-subtle);
      border-color: var(--kb-color-warning-default);
      color: var(--kb-color-warning-default);
      border-color: color-mix(
        in srgb,
        var(--kb-color-warning-default) 35%,
        transparent
      );
    }
    .v-tag.danger {
      background: var(--kb-color-danger-subtle);
      border-color: var(--kb-color-danger-default);
      color: var(--kb-color-danger-default);
      border-color: color-mix(
        in srgb,
        var(--kb-color-danger-default) 35%,
        transparent
      );
    }
    .hash {
      flex-shrink: 0;
      opacity: 0.85;
      margin-inline-end: 0.05em;
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
    const variant = props.variant === 'tag' ? 'tag' : 'soft';
    const showHash = Boolean(props.hash);
    const cls = `v-${variant} ${tone}`;

    return html`
      <span part="badge-root" class=${cls}>
        ${showHash ? html`<span class="hash" aria-hidden="true">#</span>` : null}
        <slot></slot>
      </span>
    `;
  },
});
