import { defineComponent } from '@ktbsh/sdk';

/**
 * Layout primitive: padded surface wrapper (div).
 * Props map to spacing tokens — not free-form CSS injection.
 */
export default defineComponent({
  tag: 'kitbash-box',
  props: {
    padding: { type: String, default: 'md' },
    paddingX: { type: String, default: '' },
    paddingY: { type: String, default: '' },
    radius: { type: String, default: 'md' },
    border: { type: Boolean, default: false },
    surface: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--kb-font-family-sans);
      color: var(--kb-color-fg-default);
    }
    .root {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }
    .p-none { padding: 0; }
    .p-2xs { padding: var(--kb-space-2xs); }
    .p-xs { padding: var(--kb-space-xs); }
    .p-sm { padding: var(--kb-space-sm); }
    .p-md { padding: var(--kb-space-md); }
    .p-lg { padding: var(--kb-space-lg); }
    .p-xl { padding: var(--kb-space-xl); }
    .p-2xl { padding: var(--kb-space-2xl); }
    .px-none { padding-left: 0; padding-right: 0; }
    .px-2xs { padding-left: var(--kb-space-2xs); padding-right: var(--kb-space-2xs); }
    .px-xs { padding-left: var(--kb-space-xs); padding-right: var(--kb-space-xs); }
    .px-sm { padding-left: var(--kb-space-sm); padding-right: var(--kb-space-sm); }
    .px-md { padding-left: var(--kb-space-md); padding-right: var(--kb-space-md); }
    .px-lg { padding-left: var(--kb-space-lg); padding-right: var(--kb-space-lg); }
    .px-xl { padding-left: var(--kb-space-xl); padding-right: var(--kb-space-xl); }
    .px-2xl { padding-left: var(--kb-space-2xl); padding-right: var(--kb-space-2xl); }
    .py-none { padding-top: 0; padding-bottom: 0; }
    .py-2xs { padding-top: var(--kb-space-2xs); padding-bottom: var(--kb-space-2xs); }
    .py-xs { padding-top: var(--kb-space-xs); padding-bottom: var(--kb-space-xs); }
    .py-sm { padding-top: var(--kb-space-sm); padding-bottom: var(--kb-space-sm); }
    .py-md { padding-top: var(--kb-space-md); padding-bottom: var(--kb-space-md); }
    .py-lg { padding-top: var(--kb-space-lg); padding-bottom: var(--kb-space-lg); }
    .py-xl { padding-top: var(--kb-space-xl); padding-bottom: var(--kb-space-xl); }
    .py-2xl { padding-top: var(--kb-space-2xl); padding-bottom: var(--kb-space-2xl); }
    .r-sm { border-radius: var(--kb-radius-sm); }
    .r-md { border-radius: var(--kb-radius-md); }
    .r-lg { border-radius: var(--kb-radius-lg); }
    .r-full { border-radius: var(--kb-radius-full); }
    .r-none { border-radius: 0; }
    .border {
      border: 1px solid var(--kb-color-border-default);
    }
    .surface {
      background: var(--kb-color-bg-surface);
    }
  `,
  render({ props, html }) {
    const spaces = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const radii = ['none', 'sm', 'md', 'lg', 'full'];
    const pad =
      typeof props.padding === 'string' && spaces.includes(props.padding)
        ? props.padding
        : 'md';
    const px =
      typeof props.paddingX === 'string' && spaces.includes(props.paddingX)
        ? props.paddingX
        : '';
    const py =
      typeof props.paddingY === 'string' && spaces.includes(props.paddingY)
        ? props.paddingY
        : '';
    const radius =
      typeof props.radius === 'string' && radii.includes(props.radius)
        ? props.radius
        : 'md';

    const classes = [
      'root',
      `p-${pad}`,
      px ? `px-${px}` : '',
      py ? `py-${py}` : '',
      `r-${radius}`,
      props.border ? 'border' : '',
      props.surface ? 'surface' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div part="box-root" class=${classes}>
        <slot></slot>
      </div>
    `;
  },
});
