import { defineComponent } from '@ktbsh/sdk';

/**
 * Body / supporting text. Renders a native `<p>` for readable semantics.
 * Size and tone map to design tokens (contrast-aware themes).
 * Note: `tone="subtle"` may be below WCAG AA body contrast — use for non-essential UI only.
 */
export default defineComponent({
  tag: 'kitbash-text',
  props: {
    size: { type: String, default: 'md' },
    tone: { type: String, default: 'default' },
    weight: { type: String, default: 'regular' },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    p {
      margin: 0;
      line-height: var(--kb-line-height-normal);
    }
    .s-sm { font-size: var(--kb-font-size-sm); }
    .s-md { font-size: var(--kb-font-size-md); }
    .s-lg { font-size: var(--kb-font-size-lg); }
    .s-xl { font-size: var(--kb-font-size-xl); }
    .t-default { color: var(--kb-color-fg-default); }
    .t-muted { color: var(--kb-color-fg-muted); }
    .t-subtle { color: var(--kb-color-fg-subtle); }
    .t-accent { color: var(--kb-color-accent-default); }
    .t-danger { color: var(--kb-color-danger-default); }
    .w-regular { font-weight: var(--kb-font-weight-regular); }
    .w-medium { font-weight: var(--kb-font-weight-medium); }
    .w-semibold { font-weight: var(--kb-font-weight-semibold); }
  `,
  render({ props, html }) {
    const size =
      props.size === 'sm' || props.size === 'lg' || props.size === 'xl'
        ? props.size
        : 'md';
    const tone =
      props.tone === 'muted' ||
      props.tone === 'subtle' ||
      props.tone === 'accent' ||
      props.tone === 'danger'
        ? props.tone
        : 'default';
    const weight =
      props.weight === 'medium' || props.weight === 'semibold'
        ? props.weight
        : 'regular';

    return html`
      <p part="text-root" class=${`s-${size} t-${tone} w-${weight}`}>
        <slot></slot>
      </p>
    `;
  },
});
