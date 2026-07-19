import { defineComponent } from '@ktbsh/sdk';

/**
 * Page/content width constraint with horizontal centering and tokenized padding.
 */
export default defineComponent({
  tag: 'kitbash-container',
  props: {
    width: { type: String, default: 'lg' },
    padding: { type: String, default: 'md' },
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--kb-font-family-sans);
      color: var(--kb-color-fg-default);
    }
    .root {
      box-sizing: border-box;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    .w-sm { max-width: 40rem; }
    .w-md { max-width: 48rem; }
    .w-lg { max-width: 64rem; }
    .w-xl { max-width: 80rem; }
    .w-full { max-width: none; }
    .px-none { padding-left: 0; padding-right: 0; }
    .px-2xs { padding-left: var(--kb-space-2xs); padding-right: var(--kb-space-2xs); }
    .px-xs { padding-left: var(--kb-space-xs); padding-right: var(--kb-space-xs); }
    .px-sm { padding-left: var(--kb-space-sm); padding-right: var(--kb-space-sm); }
    .px-md { padding-left: var(--kb-space-md); padding-right: var(--kb-space-md); }
    .px-lg { padding-left: var(--kb-space-lg); padding-right: var(--kb-space-lg); }
    .px-xl { padding-left: var(--kb-space-xl); padding-right: var(--kb-space-xl); }
    .px-2xl { padding-left: var(--kb-space-2xl); padding-right: var(--kb-space-2xl); }
  `,
  render({ props, html }) {
    const widths = ['sm', 'md', 'lg', 'xl', 'full'];
    const spaces = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const width =
      typeof props.width === 'string' && widths.includes(props.width)
        ? props.width
        : 'lg';
    const padding =
      typeof props.padding === 'string' && spaces.includes(props.padding)
        ? props.padding
        : 'md';

    return html`
      <div part="container-root" class=${`root w-${width} px-${padding}`}>
        <slot></slot>
      </div>
    `;
  },
});
