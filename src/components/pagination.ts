import { defineComponent } from '@ktbsh/sdk';

/**
 * Simple previous / next pagination.
 * Controlled `page` (1-based) and `total` page count. Commits new `page` on click.
 */
export default defineComponent({
  tag: 'kitbash-pagination',
  props: {
    page: { type: Number, default: 1 },
    total: { type: Number, default: 1 },
    label: { type: String, default: 'Pagination' },
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-sm);
      color: var(--kb-color-fg-default);
    }
    .root {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-sm);
    }
    button {
      box-sizing: border-box;
      min-width: 2.25rem;
      min-height: 2.25rem;
      padding: var(--kb-space-xs) var(--kb-space-sm);
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font: inherit;
      font-weight: var(--kb-font-weight-medium);
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      background: var(--kb-color-bg-subtle);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .status {
      min-width: 4rem;
      text-align: center;
      color: var(--kb-color-fg-muted);
    }
  `,
  events: {
    'click .prev'(_e: Event, { props, commit }) {
      const total =
        typeof props.total === 'number' && Number.isFinite(props.total)
          ? Math.max(1, Math.floor(props.total))
          : 1;
      const page =
        typeof props.page === 'number' && Number.isFinite(props.page)
          ? Math.min(total, Math.max(1, Math.floor(props.page)))
          : 1;
      if (page <= 1) return;
      commit({ props: { page: page - 1 } });
    },
    'click .next'(_e: Event, { props, commit }) {
      const total =
        typeof props.total === 'number' && Number.isFinite(props.total)
          ? Math.max(1, Math.floor(props.total))
          : 1;
      const page =
        typeof props.page === 'number' && Number.isFinite(props.page)
          ? Math.min(total, Math.max(1, Math.floor(props.page)))
          : 1;
      if (page >= total) return;
      commit({ props: { page: page + 1 } });
    },
  },
  render({ props, html }) {
    const total =
      typeof props.total === 'number' && Number.isFinite(props.total)
        ? Math.max(1, Math.floor(props.total))
        : 1;
    const page =
      typeof props.page === 'number' && Number.isFinite(props.page)
        ? Math.min(total, Math.max(1, Math.floor(props.page)))
        : 1;
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Pagination';

    return html`
      <nav part="pagination-root" class="root" aria-label=${label}>
        <button
          type="button"
          class="prev"
          part="pagination-prev"
          ?disabled=${page <= 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span class="status" part="pagination-status" aria-live="polite">
          ${page} / ${total}
        </span>
        <button
          type="button"
          class="next"
          part="pagination-next"
          ?disabled=${page >= total}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    `;
  },
});
