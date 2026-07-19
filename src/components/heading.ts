import { defineComponent } from '@ktbsh/sdk';

/**
 * Page/section heading. `level` 1–6 selects native h1–h6 for correct outline a11y.
 * Visual size defaults track the level; optional `size` override uses type tokens.
 */
export default defineComponent({
  tag: 'kitbash-heading',
  props: {
    level: { type: String, default: '2' },
    size: { type: String, default: '' },
    tone: { type: String, default: 'default' },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      font-weight: var(--kb-font-weight-semibold);
      line-height: var(--kb-line-height-tight);
      color: var(--kb-color-fg-default);
    }
    .t-muted { color: var(--kb-color-fg-muted); }
    .t-subtle { color: var(--kb-color-fg-subtle); }
    .t-accent { color: var(--kb-color-accent-default); }
    .t-danger { color: var(--kb-color-danger-default); }
    .t-default { color: var(--kb-color-fg-default); }
    .s-sm { font-size: var(--kb-font-size-sm); }
    .s-md { font-size: var(--kb-font-size-md); }
    .s-lg { font-size: var(--kb-font-size-lg); }
    .s-xl { font-size: var(--kb-font-size-xl); }
    .lvl-1 { font-size: calc(var(--kb-font-size-xl) * 1.5); }
    .lvl-2 { font-size: calc(var(--kb-font-size-xl) * 1.25); }
    .lvl-3 { font-size: var(--kb-font-size-xl); }
    .lvl-4 { font-size: var(--kb-font-size-lg); }
    .lvl-5 { font-size: var(--kb-font-size-md); }
    .lvl-6 { font-size: var(--kb-font-size-sm); }
  `,
  render({ props, html }) {
    const level =
      props.level === '1' ||
      props.level === '2' ||
      props.level === '3' ||
      props.level === '4' ||
      props.level === '5' ||
      props.level === '6'
        ? props.level
        : '2';
    const tone =
      props.tone === 'muted' ||
      props.tone === 'subtle' ||
      props.tone === 'accent' ||
      props.tone === 'danger'
        ? props.tone
        : 'default';
    const sizeOverride =
      props.size === 'sm' ||
      props.size === 'md' ||
      props.size === 'lg' ||
      props.size === 'xl'
        ? props.size
        : '';

    const cls = [
      `t-${tone}`,
      sizeOverride ? `s-${sizeOverride}` : `lvl-${level}`,
    ].join(' ');

    if (level === '1') {
      return html`<h1 part="heading-root" class=${cls}><slot></slot></h1>`;
    }
    if (level === '3') {
      return html`<h3 part="heading-root" class=${cls}><slot></slot></h3>`;
    }
    if (level === '4') {
      return html`<h4 part="heading-root" class=${cls}><slot></slot></h4>`;
    }
    if (level === '5') {
      return html`<h5 part="heading-root" class=${cls}><slot></slot></h5>`;
    }
    if (level === '6') {
      return html`<h6 part="heading-root" class=${cls}><slot></slot></h6>`;
    }
    return html`<h2 part="heading-root" class=${cls}><slot></slot></h2>`;
  },
});
