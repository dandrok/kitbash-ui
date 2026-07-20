import { defineComponent } from '@ktbsh/sdk';

/**
 * Table of contents (blog `TableOfContents.astro`).
 *
 * **Light DOM:** pass ordered heading links:
 * ```html
 * <kitbash-toc label="// Contents" sticky>
 *   <a href="#overview" data-depth="2">Overview</a>
 *   <a href="#rules" data-depth="2">Rules</a>
 *   <a href="#gotcha" data-depth="3">The React 18+ Gotcha</a>
 * </kitbash-toc>
 * ```
 *
 * Links are cloned into the shadow tree (nested by `data-depth`), scroll-spy
 * highlights the active section, and active rows show a `>` marker + accent
 * border (token-driven for default + terminal).
 *
 * Section targets: any element with matching `id` (native `h2`–`h4` or
 * host elements such as `kitbash-heading`). Nested rows stay collapsed until
 * the active path opens them (blog “group open” behavior).
 *
 * A11y: `nav` + `aria-label`, `aria-current="location"` on active link,
 * `:focus-visible`, `prefers-reduced-motion` for scroll/transition.
 *
 * Scroll listeners attach on first slot sync (no CE `disconnected` hook —
 * see sdk-feedback P0 lifecycle).
 */
export default defineComponent({
  tag: 'kitbash-toc',
  props: {
    /** Visible title + accessible name (blog uses `// Contents`). */
    label: { type: String, default: '// Contents' },
    /** Sticky sidebar layout (desktop TOC). */
    sticky: { type: Boolean, default: false },
  },
  events: {
    'slotchange slot'(e: Event) {
      const slot = e.target as HTMLSlotElement;
      const root = slot.getRootNode() as ShadowRoot;
      const host = root.host as HTMLElement & {
        __kbTocScroll?: () => void;
        __kbTocBound?: boolean;
        __kbTocManual?: boolean;
        __kbTocManualT?: ReturnType<typeof setTimeout>;
        __kbTocRaf?: number;
        __kbTocWatch?: ReturnType<typeof setInterval>;
        __kbTocHeadings?: HTMLElement[];
        __kbTocCleanup?: () => void;
      };
      const list = root.querySelector('.toc-root') as HTMLUListElement | null;
      if (!list || !host) return;

      type Flat = { text: string; slug: string; depth: number };
      type Node = Flat & { children: Node[] };

      const flats: Flat[] = [];
      for (const node of slot.assignedNodes({ flatten: true })) {
        if (node.nodeType !== 1) continue;
        const el = node as HTMLElement;
        if (el.tagName !== 'A') continue;
        const href = el.getAttribute('href') || '';
        const slug = href.startsWith('#')
          ? href.slice(1)
          : el.getAttribute('data-slug') || '';
        if (!slug) continue;
        const depthRaw = el.getAttribute('data-depth');
        let depth = depthRaw ? Number(depthRaw) : 2;
        if (!Number.isFinite(depth) || depth < 2) depth = 2;
        if (depth > 4) depth = 4;
        const text = (el.textContent || '').trim() || slug;
        flats.push({ text, slug, depth });
      }

      const tree: Node[] = [];
      const stack: Node[] = [];
      for (const h of flats) {
        const item: Node = { ...h, children: [] };
        while (stack.length > 0 && h.depth <= stack[stack.length - 1].depth) {
          stack.pop();
        }
        if (stack.length > 0) stack[stack.length - 1].children.push(item);
        else tree.push(item);
        stack.push(item);
      }

      while (list.firstChild) list.removeChild(list.firstChild);

      const makeLink = (item: Node, isSub: boolean) => {
        const a = document.createElement('a');
        a.className = isSub ? 'toc-link toc-link--sub' : 'toc-link';
        a.href = `#${item.slug}`;
        a.dataset.slug = item.slug;
        a.textContent = item.text;
        a.part.add('toc-link');
        a.part.add(isSub ? 'toc-link-sub' : 'toc-link-main');
        return a;
      };

      const appendItems = (
        items: Node[],
        ul: HTMLUListElement,
        isSub: boolean,
      ) => {
        for (const item of items) {
          const li = document.createElement('li');
          li.className = 'toc-item';
          li.part.add('toc-item');
          li.appendChild(makeLink(item, isSub));
          if (item.children.length > 0) {
            const sub = document.createElement('ul');
            sub.className = 'toc-sublist';
            sub.part.add('toc-sublist');
            appendItems(item.children, sub, true);
            li.appendChild(sub);
          }
          ul.appendChild(li);
        }
      };
      appendItems(tree, list, false);

      const slugSet = new Set(flats.map((f) => f.slug));

      /** Highlight link, expand nested path (parent + own children). */
      const updateActive = (id: string | null | undefined) => {
        if (!id) return;
        const links = Array.from(
          list.querySelectorAll('a.toc-link'),
        ) as HTMLAnchorElement[];
        let found: HTMLAnchorElement | undefined;
        for (const a of links) {
          const on = a.dataset.slug === id;
          a.classList.toggle('active', on);
          if (on) {
            a.setAttribute('aria-current', 'location');
            found = a;
          } else {
            a.removeAttribute('aria-current');
          }
        }

        // Collapse all nested lists, then open path to active + its own kids
        list.querySelectorAll('.toc-sublist').forEach((sub) => {
          (sub as HTMLElement).classList.remove('is-open');
        });
        if (!found) return;

        // 1) Open every ancestor sublist (so nested h3 under h2 is visible)
        let el: HTMLElement | null = found.parentElement;
        while (el && el !== list) {
          if (el.classList.contains('toc-sublist')) {
            el.classList.add('is-open');
          }
          el = el.parentElement;
        }

        // 2) If active row has children, open that sublist too (blog group-open)
        const li = found.closest('li.toc-item');
        const ownSub = li?.querySelector(':scope > .toc-sublist');
        if (ownSub) ownSub.classList.add('is-open');
      };

      /**
       * Resolve section targets by id (document order). Supports native
       * headings and CE hosts that carry the id (e.g. kitbash-heading).
       * Cached on slot sync to avoid re-query + sort on every scroll tick.
       */
      const resolveHeadings = () => {
        const found: HTMLElement[] = [];
        for (const slug of slugSet) {
          const el = document.getElementById(slug);
          if (el) found.push(el);
        }
        found.sort((a, b) => {
          const pos = a.compareDocumentPosition(b);
          if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
          if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
          return 0;
        });
        return found;
      };
      const headings = resolveHeadings();
      host.__kbTocHeadings = headings;

      const stickyOffset = () => {
        const raw = getComputedStyle(host)
          .getPropertyValue('--kb-toc-offset')
          .trim();
        const n = Number.parseFloat(raw);
        return Number.isFinite(n) && n >= 0 ? n : 100;
      };

      const scanActive = () => {
        if (!host.isConnected) return;
        if (host.__kbTocManual) return;
        const listH = host.__kbTocHeadings || headings;
        if (listH.length === 0) return;

        let activeId = listH[0]?.id;
        const offset = stickyOffset();
        const scrollH = document.documentElement.scrollHeight;
        const viewH = window.innerHeight;
        // Only treat as “bottom” when the page can actually scroll
        const atBottom =
          scrollH > viewH + 10 && viewH + window.scrollY >= scrollH - 10;
        if (atBottom) {
          activeId = listH[listH.length - 1]?.id;
        } else {
          // Last section whose top is above sticky-header threshold
          for (const heading of listH) {
            if (heading.getBoundingClientRect().top < offset) {
              activeId = heading.id;
            } else break;
          }
        }
        if (activeId) updateActive(activeId);
      };

      host.__kbTocScroll = scanActive;

      const scrollToSlug = (id: string) => {
        const target = document.getElementById(id);
        if (!target) return;
        const reduce =
          typeof matchMedia === 'function' &&
          matchMedia('(prefers-reduced-motion: reduce)').matches;
        const offset = stickyOffset();
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: reduce ? 'auto' : 'smooth',
        });
        // Move focus for keyboard / AT (skip if already focusable control)
        if (
          !target.hasAttribute('tabindex') &&
          !target.matches(
            'a, button, input, select, textarea, [contenteditable="true"]',
          )
        ) {
          target.setAttribute('tabindex', '-1');
        }
        try {
          target.focus({ preventScroll: true });
        } catch {
          /* ignore non-focusable hosts in old engines */
        }
        try {
          history.replaceState(null, '', `#${id}`);
        } catch {
          /* ignore */
        }
      };

      // Click: scroll to heading id, highlight, open under-tags, pause spy
      const links = Array.from(
        list.querySelectorAll('a.toc-link'),
      ) as HTMLAnchorElement[];
      for (const a of links) {
        a.addEventListener('click', (ev: Event) => {
          const id = a.dataset.slug;
          if (!id) return;
          ev.preventDefault();
          host.__kbTocManual = true;
          if (host.__kbTocManualT) clearTimeout(host.__kbTocManualT);
          updateActive(id);
          scrollToSlug(id);
          host.__kbTocManualT = setTimeout(() => {
            if (!host.isConnected) return;
            host.__kbTocManual = false;
            scanActive();
          }, 1000);
        });
      }

      /**
       * Window scroll spy (blog-style offset math). No CE disconnected hook —
       * rAF-throttle + interval watchdog self-clean when host leaves the DOM
       * (SPA navigations that never scroll again). See sdk-feedback P0 lifecycle.
       */
      if (!host.__kbTocBound) {
        host.__kbTocBound = true;
        const onScroll = () => {
          if (!host.isConnected) {
            host.__kbTocCleanup?.();
            return;
          }
          if (host.__kbTocRaf) return;
          host.__kbTocRaf = requestAnimationFrame(() => {
            host.__kbTocRaf = undefined;
            if (!host.isConnected) {
              host.__kbTocCleanup?.();
              return;
            }
            host.__kbTocScroll?.();
          });
        };
        host.__kbTocCleanup = () => {
          if (!host.__kbTocBound) return;
          host.__kbTocBound = false;
          window.removeEventListener('scroll', onScroll);
          if (host.__kbTocRaf) {
            cancelAnimationFrame(host.__kbTocRaf);
            host.__kbTocRaf = undefined;
          }
          if (host.__kbTocWatch) {
            clearInterval(host.__kbTocWatch);
            host.__kbTocWatch = undefined;
          }
          if (host.__kbTocManualT) {
            clearTimeout(host.__kbTocManualT);
            host.__kbTocManualT = undefined;
          }
          host.__kbTocScroll = undefined;
          host.__kbTocHeadings = undefined;
          host.__kbTocCleanup = undefined;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        host.__kbTocWatch = setInterval(() => {
          if (!host.isConnected) host.__kbTocCleanup?.();
        }, 2000);
      }
      scanActive();
    },
  },
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      width: min(100%, 15.5rem);
      max-height: calc(100vh - 9.5rem);
      overflow-y: auto;
      /* Sticky-header offset for scroll-spy + click scroll — unitless px only */
      --kb-toc-offset: 100;
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-md);
      color: var(--kb-color-fg-default);
      scrollbar-width: thin;
      scrollbar-color: var(--kb-color-border-default) transparent;
    }
    :host([sticky]) {
      position: sticky;
      top: 6.25rem;
    }
    :host::-webkit-scrollbar {
      width: 4px;
    }
    :host::-webkit-scrollbar-track {
      background: var(--kb-color-accent-subtle);
    }
    :host::-webkit-scrollbar-thumb {
      background: var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
    }
    nav {
      display: block;
    }
    .heading {
      margin: 0 0 var(--kb-space-md);
      padding-bottom: var(--kb-space-sm);
      border-bottom: 1px solid var(--kb-color-border-default);
      color: var(--kb-color-accent-default);
      font-size: var(--kb-font-size-md);
      font-weight: var(--kb-font-weight-semibold);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      line-height: var(--kb-line-height-tight);
    }
    .toc-root,
    .toc-sublist {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .toc-root {
      /* Room for active \`>\` marker without clipping */
      padding-left: 0.75rem;
    }
    .toc-sublist {
      margin: var(--kb-space-2xs) 0 var(--kb-space-2xs) var(--kb-space-sm);
      /* Blog: collapse nested until active path */
      display: none;
    }
    .toc-sublist.is-open {
      display: block;
    }
    .toc-item {
      margin: 0;
    }
    .toc-link {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-height: 1.5rem;
      padding: var(--kb-space-xs) var(--kb-space-sm);
      margin: 0;
      border-left: 2px solid transparent;
      color: var(--kb-color-fg-muted);
      text-decoration: none;
      line-height: var(--kb-line-height-normal);
      transition:
        color 0.15s ease,
        border-color 0.15s ease;
    }
    .toc-link--sub {
      font-size: var(--kb-font-size-sm);
    }
    .toc-link:hover {
      color: var(--kb-color-accent-default);
    }
    .toc-link:focus-visible {
      outline: 2px solid var(--kb-color-border-focus);
      outline-offset: 2px;
      color: var(--kb-color-accent-default);
    }
    .toc-link.active {
      color: var(--kb-color-fg-default);
      border-left-color: var(--kb-color-accent-default);
      font-weight: var(--kb-font-weight-medium);
    }
    .toc-link.active::before {
      content: '>';
      position: absolute;
      left: -0.65rem;
      color: var(--kb-color-accent-default);
      font-weight: var(--kb-font-weight-semibold);
    }
    slot {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .toc-link {
        transition: none;
      }
    }
  `,
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : '// Contents';
    // aria-label avoids fixed-id collision when multiple TOCs exist;
    // visual title is decorative so the name is not announced twice.
    return html`
      <nav part="toc-root" aria-label=${label}>
        <div class="heading" part="toc-heading" aria-hidden="true">${label}</div>
        <ul class="toc-root" part="toc-list"></ul>
        <slot></slot>
      </nav>
    `;
  },
});
