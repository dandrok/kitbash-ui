import { defineComponent } from '@ktbsh/sdk';

/**
 * Indeterminate loading indicator — terminal “activity glyph” spinner.
 *
 * Cycles classic braille loader frames (the familiar CLI look) with a soft
 * accent glow. Circular/glyph-based on purpose (not a forced square box).
 *
 * A11y: `role="status"` + sr-only label. Static glyph under reduced motion.
 */
export default defineComponent({
  tag: 'kitbash-spinner',
  props: {
    size: { type: String, default: 'md' },
    label: { type: String, default: 'Loading' },
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--kb-color-accent-default);
      vertical-align: middle;
      position: relative;
      font-family: var(--kb-font-family-sans);
    }
    .root {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      /* Soft CRT halo around the glyph */
      filter: drop-shadow(
        0 0 0.35em
          color-mix(in srgb, var(--kb-color-accent-default) 55%, transparent)
      );
    }
    .sm {
      width: 1rem;
      height: 1rem;
      font-size: 0.95rem;
    }
    .md {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1.35rem;
    }
    .lg {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 2rem;
    }
    /*
     * Braille spinner frames (stacked; one visible at a time).
     * Pattern used by many CLIs / Ink / ora-style loaders.
     */
    .frame {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      animation: kitbash-braille 0.8s steps(1, end) infinite;
      font-weight: var(--kb-font-weight-regular);
      color: currentColor;
      user-select: none;
      pointer-events: none;
    }
    .frame:nth-child(1) {
      animation-delay: 0s;
    }
    .frame:nth-child(2) {
      animation-delay: -0.72s;
    }
    .frame:nth-child(3) {
      animation-delay: -0.64s;
    }
    .frame:nth-child(4) {
      animation-delay: -0.56s;
    }
    .frame:nth-child(5) {
      animation-delay: -0.48s;
    }
    .frame:nth-child(6) {
      animation-delay: -0.4s;
    }
    .frame:nth-child(7) {
      animation-delay: -0.32s;
    }
    .frame:nth-child(8) {
      animation-delay: -0.24s;
    }
    .frame:nth-child(9) {
      animation-delay: -0.16s;
    }
    .frame:nth-child(10) {
      animation-delay: -0.08s;
    }
    /*
     * Each frame is fully opaque for 1/10 of the cycle.
     * Negative delay staggers so they take turns.
     */
    @keyframes kitbash-braille {
      0%,
      9.99% {
        opacity: 1;
      }
      10%,
      100% {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .frame {
        animation: none;
        opacity: 0;
      }
      /* Prefer a steady “busy” glyph when motion is off */
      .frame:nth-child(1) {
        opacity: 1;
      }
      .root {
        filter: none;
        opacity: 0.85;
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
  render({ props, html }) {
    const size = props.size === 'sm' || props.size === 'lg' ? props.size : 'md';
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Loading';

    // Braille sequence (U+280B … cycle used by common terminal spinners)
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

    return html`
      <span part="spinner-root" class=${`root ${size}`} role="status">
        <span class="sr-only">${label}</span>
        ${frames.map(
          (ch) =>
            html`<span class="frame" part="spinner-frame" aria-hidden="true"
              >${ch}</span
            >`,
        )}
      </span>
    `;
  },
});
