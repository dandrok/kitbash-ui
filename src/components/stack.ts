import { defineComponent } from '@ktbsh/sdk';

/**
 * Flex stack for vertical/horizontal layout with tokenized gap.
 * Children are light-DOM / slotted content.
 */
export default defineComponent({
  tag: 'kitbash-stack',
  props: {
    direction: { type: String, default: 'column' },
    gap: { type: String, default: 'md' },
    align: { type: String, default: 'stretch' },
    justify: { type: String, default: 'start' },
    wrap: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    .root {
      display: flex;
      box-sizing: border-box;
      width: 100%;
    }
    .dir-column { flex-direction: column; }
    .dir-row { flex-direction: row; }
    .gap-none { gap: 0; }
    .gap-2xs { gap: var(--kb-space-2xs); }
    .gap-xs { gap: var(--kb-space-xs); }
    .gap-sm { gap: var(--kb-space-sm); }
    .gap-md { gap: var(--kb-space-md); }
    .gap-lg { gap: var(--kb-space-lg); }
    .gap-xl { gap: var(--kb-space-xl); }
    .gap-2xl { gap: var(--kb-space-2xl); }
    .align-start { align-items: flex-start; }
    .align-center { align-items: center; }
    .align-end { align-items: flex-end; }
    .align-stretch { align-items: stretch; }
    .justify-start { justify-content: flex-start; }
    .justify-center { justify-content: center; }
    .justify-end { justify-content: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-around { justify-content: space-around; }
    .wrap { flex-wrap: wrap; }
  `,
  render({ props, html }) {
    const spaces = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const direction = props.direction === 'row' ? 'row' : 'column';
    const gap =
      typeof props.gap === 'string' && spaces.includes(props.gap)
        ? props.gap
        : 'md';
    const align =
      props.align === 'start' ||
      props.align === 'center' ||
      props.align === 'end'
        ? props.align
        : 'stretch';
    const justify =
      props.justify === 'center' ||
      props.justify === 'end' ||
      props.justify === 'between' ||
      props.justify === 'around'
        ? props.justify
        : 'start';

    const classes = [
      'root',
      `dir-${direction}`,
      `gap-${gap}`,
      `align-${align}`,
      `justify-${justify}`,
      props.wrap ? 'wrap' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div part="stack-root" class=${classes}>
        <slot></slot>
      </div>
    `;
  },
});
