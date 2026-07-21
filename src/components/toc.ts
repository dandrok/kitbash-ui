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
 * highlights the active section. Active cue matches blog: full-height accent
 * border (`|`) + terminal `>` marker (opacity).
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
        __kbTocSig?: string;
        __kbTocActiveId?: string;
        __kbTocScrollEnd?: (ev?: Event) => void;
        __kbTocScroller?: HTMLElement;
        __kbTocMarginEl?: HTMLElement;
        __kbTocMarginPrev?: string;
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

      // Skip full rebuild when light-DOM links did not change (avoids thrash
      // when frameworks re-render the same anchors and re-fire slotchange).
      const sig = flats
        .map((f) => `${f.slug}\0${f.depth}\0${f.text}`)
        .join('\n');
      const structureChanged =
        host.__kbTocSig !== sig || list.childNodes.length === 0;
      host.__kbTocSig = sig;

      const slugSet = new Set(flats.map((f) => f.slug));

      /**
       * Resolve section targets by id (document order). Supports native
       * headings and CE hosts that carry the id (e.g. kitbash-heading).
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

      const stickyOffset = () => {
        const raw = getComputedStyle(host)
          .getPropertyValue('--kb-toc-offset')
          .trim();
        const n = Number.parseFloat(raw);
        return Number.isFinite(n) && n >= 0 ? n : 100;
      };

      /** Nearest scrollport for a target (Storybook iframe / nested overflow). */
      const scrollParentOf = (el: HTMLElement): HTMLElement => {
        let p: HTMLElement | null = el.parentElement;
        while (p && p !== document.documentElement) {
          const st = getComputedStyle(p);
          const oy = st.overflowY;
          const canScroll =
            (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
            p.scrollHeight > p.clientHeight + 1;
          if (canScroll) return p;
          p = p.parentElement;
        }
        return (
          (document.scrollingElement as HTMLElement | null) ||
          document.documentElement
        );
      };

      const scrollRoot = () =>
        (document.scrollingElement as HTMLElement | null) ||
        document.documentElement;

      const isDocumentScroller = (scroller: HTMLElement) =>
        scroller === document.documentElement || scroller === document.body;

      /** Viewport Y of the scroller's content top (0 for the document). */
      const scrollportTopOf = (scroller: HTMLElement) =>
        isDocumentScroller(scroller)
          ? 0
          : scroller.getBoundingClientRect().top + scroller.clientTop;

      /** Highlight only when active id changes — stops open/close flicker. */
      const updateActive = (id: string | null | undefined) => {
        if (!id || id === host.__kbTocActiveId) return;
        host.__kbTocActiveId = id;
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

        list.querySelectorAll('.toc-sublist').forEach((sub) => {
          (sub as HTMLElement).classList.remove('is-open');
        });
        if (!found) return;

        let el: HTMLElement | null = found.parentElement;
        while (el && el !== list) {
          if (el.classList.contains('toc-sublist')) {
            el.classList.add('is-open');
          }
          el = el.parentElement;
        }

        const li = found.closest('li.toc-item');
        const ownSub = li?.querySelector(':scope > .toc-sublist');
        if (ownSub) ownSub.classList.add('is-open');
      };

      const scanActive = () => {
        if (!host.isConnected) return;
        if (host.__kbTocManual) return;
        const listH = host.__kbTocHeadings;
        if (!listH || listH.length === 0) return;

        let activeId = listH[0]?.id;
        const offset = stickyOffset();
        // Hysteresis band: avoid flip-flop when a heading sits on the line
        const band = 8;
        const scroller = listH[0] ? scrollParentOf(listH[0]) : scrollRoot();
        const scrollH = scroller.scrollHeight;
        const viewH = isDocumentScroller(scroller)
          ? window.innerHeight
          : scroller.clientHeight;
        const scrollTop = scroller.scrollTop;
        const portTop = scrollportTopOf(scroller);
        const atBottom =
          scrollH > viewH + 10 && viewH + scrollTop >= scrollH - 10;
        if (atBottom) {
          activeId = listH[listH.length - 1]?.id;
        } else {
          // Last section past the scrollport sticky line (viewport coords)
          const line = portTop + offset + band;
          for (const heading of listH) {
            if (heading.getBoundingClientRect().top < line) {
              activeId = heading.id;
            } else break;
          }
        }
        if (activeId) updateActive(activeId);
      };

      host.__kbTocScroll = scanActive;
      host.__kbTocHeadings = resolveHeadings();

      if (structureChanged) {
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
        host.__kbTocActiveId = undefined;

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

        const restoreScrollMargin = () => {
          if (host.__kbTocMarginEl) {
            host.__kbTocMarginEl.style.scrollMarginTop =
              host.__kbTocMarginPrev ?? '';
            host.__kbTocMarginEl = undefined;
            host.__kbTocMarginPrev = undefined;
          }
        };

        const clearScrollEnd = () => {
          if (host.__kbTocScrollEnd) {
            host.__kbTocScroller?.removeEventListener(
              'scrollend',
              host.__kbTocScrollEnd,
            );
            window.removeEventListener('scrollend', host.__kbTocScrollEnd);
            host.__kbTocScrollEnd = undefined;
            host.__kbTocScroller = undefined;
          }
        };

        const endManual = () => {
          if (host.__kbTocManualT) {
            clearTimeout(host.__kbTocManualT);
            host.__kbTocManualT = undefined;
          }
          clearScrollEnd();
          restoreScrollMargin();
          host.__kbTocManual = false;
          scanActive();
        };

        const scrollToSlug = (id: string) => {
          const target = document.getElementById(id);
          if (!target) return;
          const reduce =
            typeof matchMedia === 'function' &&
            matchMedia('(prefers-reduced-motion: reduce)').matches;
          const offset = stickyOffset();
          const scroller = scrollParentOf(target);
          const portTop = scrollportTopOf(scroller);
          const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';

          // Abort any prior scroll-margin mutation before applying a new one
          restoreScrollMargin();
          host.__kbTocMarginPrev = target.style.scrollMarginTop;
          host.__kbTocMarginEl = target;
          // scroll-margin: browser lands under sticky chrome (Storybook + site)
          target.style.scrollMarginTop = `${offset}px`;

          const desiredTop =
            scroller.scrollTop +
            target.getBoundingClientRect().top -
            portTop -
            offset;
          const top = Math.max(0, desiredTop);

          let settled = false;
          const settle = () => {
            if (settled) return;
            settled = true;
            restoreScrollMargin();
            if (!host.isConnected || !target.isConnected) {
              endManual();
              return;
            }
            // Quiet correction if still off (no second smooth animation)
            const err = target.getBoundingClientRect().top - portTop - offset;
            if (Math.abs(err) > 4) {
              scroller.scrollTop = Math.max(0, scroller.scrollTop + err);
            }
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
              /* ignore */
            }
            endManual();
          };

          const dist = Math.abs(
            target.getBoundingClientRect().top - portTop - offset,
          );
          // Already in place — no scroll, no scrollend; unlock immediately
          if (dist < 4) {
            try {
              history.replaceState(null, '', `#${id}`);
            } catch {
              /* ignore */
            }
            settle();
            return;
          }

          try {
            target.scrollIntoView({ behavior, block: 'start' });
          } catch {
            scroller.scrollTo({ top, behavior });
          }

          clearScrollEnd();
          if (!reduce && 'onscrollend' in window) {
            const onEnd = () => settle();
            host.__kbTocScrollEnd = onEnd;
            host.__kbTocScroller = scroller;
            // Either nested scroller or window may be what actually moved
            scroller.addEventListener('scrollend', onEnd, { once: true });
            window.addEventListener('scrollend', onEnd, { once: true });
            host.__kbTocManualT = setTimeout(settle, 900);
          } else {
            const travel = Math.abs(scroller.scrollTop - top);
            const wait = reduce
              ? 0
              : Math.min(900, Math.max(120, travel * 0.4));
            host.__kbTocManualT = setTimeout(settle, wait);
          }

          try {
            history.replaceState(null, '', `#${id}`);
          } catch {
            /* ignore */
          }
        };

        // Click: pin active row, scroll, hold spy until settle
        const links = Array.from(
          list.querySelectorAll('a.toc-link'),
        ) as HTMLAnchorElement[];
        for (const a of links) {
          a.addEventListener('click', (ev: Event) => {
            const id = a.dataset.slug;
            if (!id) return;
            ev.preventDefault();
            host.__kbTocManual = true;
            if (host.__kbTocManualT) {
              clearTimeout(host.__kbTocManualT);
              host.__kbTocManualT = undefined;
            }
            clearScrollEnd();
            restoreScrollMargin();
            updateActive(id);
            scrollToSlug(id);
          });
        }
      }

      /**
       * Scroll spy (capture so nested overflow scrollports are seen — Storybook).
       * No CE disconnected hook — rAF-throttle + watchdog (sdk-feedback P0).
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
          window.removeEventListener('scroll', onScroll, true);
          if (host.__kbTocScrollEnd) {
            host.__kbTocScroller?.removeEventListener(
              'scrollend',
              host.__kbTocScrollEnd,
            );
            window.removeEventListener('scrollend', host.__kbTocScrollEnd);
            host.__kbTocScrollEnd = undefined;
            host.__kbTocScroller = undefined;
          }
          if (host.__kbTocMarginEl) {
            host.__kbTocMarginEl.style.scrollMarginTop =
              host.__kbTocMarginPrev ?? '';
            host.__kbTocMarginEl = undefined;
            host.__kbTocMarginPrev = undefined;
          }
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
          host.__kbTocActiveId = undefined;
          host.__kbTocSig = undefined;
        };
        // capture: true — nested scroll containers do not bubble scroll events
        window.addEventListener('scroll', onScroll, {
          passive: true,
          capture: true,
        });
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
      /* Marker sits outside the border-l rail; keep pad + ::before left in sync */
      --kb-toc-marker-offset: 0.75rem;
      padding-left: calc(var(--kb-toc-marker-offset) + 0.1rem);
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
    /* Blog: border-l-2 border-transparent py-1 pl-3 */
    .toc-link {
      position: relative;
      display: block;
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
    /* Blog active: text bright + border-green-500 (full-height |) */
    .toc-link.active {
      color: var(--kb-color-accent-default);
      border-left-color: var(--kb-color-accent-default);
      font-weight: var(--kb-font-weight-medium);
    }
    /* Blog: .toc-link::before { content: '>'; opacity: 0 } .active { opacity: 1 } */
    .toc-link::before {
      /* Slash alt-text: decorative marker (empty alternative for AT) */
      content: '>' / '';
      position: absolute;
      left: calc(-1 * var(--kb-toc-marker-offset));
      top: var(--kb-space-xs);
      line-height: var(--kb-line-height-normal);
      color: var(--kb-color-accent-default);
      font-weight: var(--kb-font-weight-semibold);
      opacity: 0;
      transition: opacity 0.15s ease;
      pointer-events: none;
    }
    .toc-link.active::before {
      opacity: 1;
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
