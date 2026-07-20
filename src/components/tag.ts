import { defineComponent } from '@ktbsh/sdk';

/**
 * Single blog tag chip — 1:1 with `TagList.astro` item styles.
 *
 * Blog (terminal):
 * ```html
 * <li class="border border-green-500/30 bg-green-500/5 px-2 py-1 text-xs text-green-500">
 *   #react
 * </li>
 * ```
 *
 * Regular mode remaps green utilities → primary / border / focus wash.
 * We map that to semantic accent tokens (terminal preset = Matrix green).
 *
 * Always shows a decorative `#` prefix (blog convention).
 *
 * @example
 * ```html
 * <kitbash-tag>react</kitbash-tag>
 * <a href="/tags/react"><kitbash-tag>react</kitbash-tag></a>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-tag',
  props: {},
  styles: `
    /*
     * Visuals on :host so the chip is one box (no nested flex).
     * Blog: border-green-500/30, bg-green-500/5, px-2 py-1, text-xs, text-green-500
     */
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      margin: 0;
      padding: var(--kb-space-xs) var(--kb-space-sm);
      border: 1px solid
        color-mix(in srgb, var(--kb-color-accent-default) 30%, transparent);
      border-radius: var(--kb-radius-sm);
      background: color-mix(
        in srgb,
        var(--kb-color-accent-default) 5%,
        transparent
      );
      color: var(--kb-color-accent-default);
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-xs);
      font-weight: var(--kb-font-weight-regular);
      line-height: var(--kb-line-height-tight);
      white-space: nowrap;
      vertical-align: middle;
    }
    .hash {
      flex-shrink: 0;
    }
  `,
  render({ html }) {
    return html`
      <span class="hash" part="tag-hash" aria-hidden="true">#</span><slot></slot>
    `;
  },
});
