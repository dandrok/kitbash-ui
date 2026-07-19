import { defineComponent } from '@ktbsh/sdk';

/**
 * Simple horizontal navigation landmark.
 * Light-DOM children (typically links) are listed in a flex row.
 *
 * @example
 * ```html
 * <kitbash-nav label="Main">
 *   <a href="/">Home</a>
 *   <a href="/docs" aria-current="page">Docs</a>
 * </kitbash-nav>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-nav',
  props: {
    label: { type: String, default: 'Main' },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
    }
    nav {
      display: block;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--kb-space-sm);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ::slotted(a) {
      display: inline-flex;
      align-items: center;
      min-height: 2.25rem;
      padding: var(--kb-space-xs) var(--kb-space-sm);
      border-radius: var(--kb-radius-sm);
      color: var(--kb-color-fg-default);
      text-decoration: none;
      font-weight: var(--kb-font-weight-medium);
    }
    ::slotted(a:hover) {
      background: var(--kb-color-bg-subtle);
    }
    ::slotted(a:focus-visible) {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    ::slotted(a[aria-current="page"]) {
      color: var(--kb-color-accent-default);
      background: var(--kb-color-accent-subtle);
    }
  `,
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Main';
    return html`
      <nav part="nav-root" aria-label=${label}>
        <div class="list" part="nav-list">
          <slot></slot>
        </div>
      </nav>
    `;
  },
});
