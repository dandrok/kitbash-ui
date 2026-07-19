import { defineComponent } from '@ktbsh/sdk';

/**
 * Placeholder shimmer for loading content.
 * Decorative: `aria-hidden="true"` — wrap content regions with `aria-busy` on the parent.
 */
export default defineComponent({
  tag: 'kitbash-skeleton',
  props: {
    variant: { type: String, default: 'text' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '' },
  },
  styles: `
    :host {
      display: block;
    }
    .root {
      display: block;
      box-sizing: border-box;
      background: linear-gradient(
        90deg,
        var(--kb-color-bg-subtle) 0%,
        var(--kb-color-bg-surface) 50%,
        var(--kb-color-bg-subtle) 100%
      );
      background-size: 200% 100%;
      animation: kitbash-skeleton 1.2s ease-in-out infinite;
    }
    .text {
      height: 0.875em;
      border-radius: var(--kb-radius-sm);
    }
    .rect {
      height: 6rem;
      border-radius: var(--kb-radius-md);
    }
    .circle {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--kb-radius-full);
    }
    @keyframes kitbash-skeleton {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .root {
        animation: none;
        background: var(--kb-color-bg-subtle);
      }
    }
  `,
  render({ props, html }) {
    const variant =
      props.variant === 'rect' || props.variant === 'circle'
        ? props.variant
        : 'text';
    const width =
      typeof props.width === 'string' && props.width.length > 0
        ? props.width
        : variant === 'circle'
          ? ''
          : '100%';
    const height =
      typeof props.height === 'string' && props.height.length > 0
        ? props.height
        : '';

    const styleParts: string[] = [];
    if (width) styleParts.push(`width: ${width}`);
    if (height) styleParts.push(`height: ${height}`);
    const style = styleParts.length > 0 ? styleParts.join('; ') : null;

    return html`
      <span
        part="skeleton-root"
        class=${`root ${variant}`}
        style=${style}
        aria-hidden="true"
      ></span>
    `;
  },
});
