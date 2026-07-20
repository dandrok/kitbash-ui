import { defineComponent } from '@ktbsh/sdk';

/**
 * Blog `TagList.astro` layout shell — flex-wrap row of `kitbash-tag` children.
 *
 * Blog:
 * ```html
 * <ul class="m-0 flex list-none flex-wrap gap-2 p-0">…</ul>
 * ```
 *
 * Compose (preserves links — no text scraping, no ARIA list across shadow):
 * ```html
 * <kitbash-tag-list>
 *   <kitbash-tag>react</kitbash-tag>
 *   <a href="/tags/hooks"><kitbash-tag>hooks</kitbash-tag></a>
 * </kitbash-tag-list>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-tag-list',
  props: {},
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    /* Blog: m-0 flex list-none flex-wrap gap-2 p-0 */
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0;
      padding: 0;
      gap: var(--kb-space-sm);
    }
    ::slotted(a) {
      display: inline-flex;
      color: inherit;
      text-decoration: none;
    }
    ::slotted(a:focus-visible) {
      outline: 2px solid var(--kb-color-border-focus);
      outline-offset: 2px;
      border-radius: var(--kb-radius-sm);
    }
  `,
  render({ html }) {
    return html`
      <div class="tag-list" part="tag-list-root">
        <slot></slot>
      </div>
    `;
  },
});
