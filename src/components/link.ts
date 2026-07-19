import { defineComponent } from '@ktbsh/sdk';

/**
 * Navigation / inline link (native `<a>`).
 * - `target=_blank` (any case) gets `rel="noopener noreferrer"` unless `rel` is set.
 * - Dangerous URL schemes (`javascript:`, `data:`, `vbscript:`) are blocked.
 */
export default defineComponent({
  tag: 'kitbash-link',
  delegatesFocus: true,
  props: {
    href: { type: String, default: '#' },
    target: { type: String, default: '' },
    rel: { type: String, default: '' },
    tone: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline;
      font-family: var(--kb-font-family-sans);
      font-size: inherit;
    }
    a {
      color: var(--kb-color-accent-default);
      text-decoration: underline;
      text-underline-offset: 0.15em;
      border-radius: var(--kb-radius-sm);
      cursor: pointer;
    }
    a.muted {
      color: var(--kb-color-fg-muted);
    }
    a.accent {
      color: var(--kb-color-accent-default);
      font-weight: var(--kb-font-weight-medium);
    }
    a.default {
      color: var(--kb-color-accent-default);
    }
    a:hover {
      color: var(--kb-color-accent-hover);
    }
    a:focus-visible {
      outline: none;
      box-shadow: var(--kb-focus-ring);
    }
    a[aria-disabled="true"] {
      opacity: 0.55;
      cursor: not-allowed;
      pointer-events: none;
    }
  `,
  render({ props, html }) {
    const tone =
      props.tone === 'muted' || props.tone === 'accent'
        ? props.tone
        : 'default';
    const targetRaw =
      typeof props.target === 'string' && props.target.length > 0
        ? props.target
        : '';
    const target = targetRaw || null;
    const isBlank = targetRaw.toLowerCase() === '_blank';
    const relExplicit =
      typeof props.rel === 'string' && props.rel.length > 0 ? props.rel : null;
    const rel = relExplicit ?? (isBlank ? 'noopener noreferrer' : null);

    let href: string | null = '#';
    if (props.disabled) {
      href = null;
    } else if (typeof props.href === 'string') {
      const trimmed = props.href.trim();
      // Strip whitespace/control chars before scheme check (tabnabbing / xss bypass)
      let schemeProbe = '';
      for (let i = 0; i < trimmed.length; i++) {
        const code = trimmed.charCodeAt(i);
        if (code > 0x20) schemeProbe += trimmed[i];
      }
      const lower = schemeProbe.toLowerCase();
      const blocked =
        lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('vbscript:');
      href = blocked ? '#' : trimmed;
    }

    return html`
      <a
        part="link-root"
        class=${tone}
        href=${href}
        target=${target}
        rel=${rel}
        aria-disabled=${props.disabled ? 'true' : 'false'}
        tabindex=${props.disabled ? -1 : null}
      >
        <slot></slot>
      </a>
    `;
  },
});
