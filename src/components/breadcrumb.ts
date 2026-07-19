import { defineComponent } from '@ktbsh/sdk';

/**
 * Breadcrumb navigation. Light-DOM children are list items (links or current page).
 *
 * @example
 * ```html
 * <kitbash-breadcrumb>
 *   <a href="/">Home</a>
 *   <a href="/docs">Docs</a>
 *   <span aria-current="page">API</span>
 * </kitbash-breadcrumb>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-breadcrumb',
  props: {
    label: { type: String, default: 'Breadcrumb' },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-sm);
      color: var(--kb-color-fg-muted);
    }
    nav {
      display: block;
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--kb-space-xs);
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: var(--kb-space-xs);
      min-height: 1.5rem;
    }
    .sep {
      color: var(--kb-color-fg-subtle);
      user-select: none;
    }
    ::slotted(a) {
      color: var(--kb-color-accent-default);
      text-decoration: none;
    }
    ::slotted(a:hover) {
      text-decoration: underline;
    }
    slot {
      display: none;
    }
  `,
  events: {
    'slotchange slot'(e: Event) {
      const slot = e.target as HTMLSlotElement;
      const root = slot.getRootNode() as ShadowRoot;
      const list = root.querySelector('ol');
      const host = root.host as HTMLElement & {
        __kbBcObs?: MutationObserver;
        __kbBcSync?: () => void;
      };
      if (!list || !host) return;

      const sync = () => {
        while (list.firstChild) list.removeChild(list.firstChild);
        const nodes = slot.assignedNodes({ flatten: true }).filter((n) => {
          if (n.nodeType !== 1) return false;
          const el = n as Element;
          // skip pure whitespace elements
          return el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
        }) as Element[];

        nodes.forEach((node, i) => {
          const li = document.createElement('li');
          li.appendChild(node.cloneNode(true));
          list.appendChild(li);
          if (i < nodes.length - 1) {
            const sep = document.createElement('li');
            sep.className = 'sep';
            sep.setAttribute('aria-hidden', 'true');
            sep.textContent = '/';
            list.appendChild(sep);
          }
        });
      };

      host.__kbBcSync = sync;
      sync();

      if (!host.__kbBcObs) {
        const obs = new MutationObserver((mutations) => {
          const optionMutation = mutations.some(
            (m) => m.target !== host || m.type !== 'attributes',
          );
          if (optionMutation) host.__kbBcSync?.();
        });
        obs.observe(host, {
          childList: true,
          subtree: true,
          characterData: true,
        });
        host.__kbBcObs = obs;
      }
    },
  },
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Breadcrumb';
    return html`
      <nav part="breadcrumb-root" aria-label=${label}>
        <ol part="breadcrumb-list"></ol>
        <slot></slot>
      </nav>
    `;
  },
});
