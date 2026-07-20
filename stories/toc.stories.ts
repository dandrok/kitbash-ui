import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';

import '../dist/vanilla/toc.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';
import '../dist/vanilla/heading.js';

const meta = {
  title: 'Navigation/Table of contents',
  component: 'kitbash-toc',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'In-page TOC from light-DOM heading links (`href` + `data-depth`). Clones links into a nested list, scroll-spies section ids, and marks the active row with a short first-line accent bar. Nested rows open along the active path. Set `--kb-toc-offset` (px, unitless) for sticky headers.',
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sections = [
  { id: 'overview', depth: 2, title: 'Overview' },
  { id: 'rules', depth: 2, title: 'The Rules of Hooks: Why the Order Matters' },
  { id: 'usestate', depth: 2, title: 'useState – the state of your cup' },
  { id: 'useeffect', depth: 2, title: 'useEffect – reacting to changes' },
  { id: 'coffee', depth: 3, title: 'The coffee shop analogy' },
  { id: 'cleanups', depth: 3, title: 'Cleanups – wiping the table' },
  { id: 'gotcha', depth: 3, title: 'The React 18+ Development Gotcha' },
  { id: 'uselayout', depth: 2, title: 'useLayoutEffect – measuring the cup' },
  { id: 'useref', depth: 2, title: 'useRef – the persistent, quiet storage' },
  { id: 'usememo', depth: 2, title: 'useMemo – the cashier who remembers' },
  {
    id: 'usecallback',
    depth: 2,
    title: 'useCallback – caching the receipt template',
  },
  { id: 'lazy', depth: 2, title: 'lazy + Suspense – ordering ahead' },
  { id: 'menu', depth: 2, title: 'The Full Hook Menu' },
];

export const BlogStyle: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: 16rem 1fr; gap: 2rem; max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem 8rem;"
    >
      <!--
        Storybook has no site header: use a small offset so click-scroll lands
        on the heading (site should set --kb-toc-offset to header height).
      -->
      <kitbash-toc
        label="// Contents"
        sticky
        style="--kb-toc-offset: 16; top: 1rem;"
      >
        ${sections.map(
          (s) => html`
            <a href=${`#${s.id}`} data-depth=${String(s.depth)}>${s.title}</a>
          `,
        )}
      </kitbash-toc>
      <article>
        <kitbash-stack gap="lg">
          ${sections.map(
            (s) => html`
              <section>
                ${
                  s.depth === 2
                    ? html`<kitbash-heading level="2" id=${s.id}
                      >${s.title}</kitbash-heading
                    >`
                    : html`<kitbash-heading level="3" id=${s.id}
                      >${s.title}</kitbash-heading
                    >`
                }
                <kitbash-text>
                  Placeholder copy for scroll-spy demo. Scroll the page and
                  watch the TOC highlight the current section (terminal preset
                  looks closest to the blog).
                </kitbash-text>
                <div style="height: 12rem;"></div>
              </section>
            `,
          )}
        </kitbash-stack>
      </article>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const toc = canvasElement.querySelector('kitbash-toc');
    expect(toc).toBeTruthy();
    await waitFor(() => {
      const links = toc?.shadowRoot?.querySelectorAll('a.toc-link');
      expect(links?.length).toBeGreaterThan(5);
    });

    // Nested under-tag exists for useEffect children
    const sub = toc?.shadowRoot?.querySelector(
      'a.toc-link[data-slug="gotcha"]',
    ) as HTMLAnchorElement | null;
    expect(sub).toBeTruthy();
    if (!sub) return;

    sub.click();
    await waitFor(() => {
      expect(sub.classList.contains('active')).toBe(true);
      // Nested list under useEffect (parent of gotcha's li)
      const sublist = sub.closest('li')?.parentElement;
      expect(sublist?.classList.contains('toc-sublist')).toBe(true);
      expect(sublist?.classList.contains('is-open')).toBe(true);
      // Page should have moved toward the heading
      const target = document.getElementById('gotcha');
      expect(target).toBeTruthy();
      if (target) {
        expect(target.getBoundingClientRect().top).toBeLessThan(
          window.innerHeight,
        );
      }
    });
  },
};
