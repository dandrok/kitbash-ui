import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';

import '../dist/vanilla/pagination.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Navigation/Pagination',
  component: 'kitbash-pagination',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-pagination page=${2} total=${5}></kitbash-pagination>
      <kitbash-text size="sm" tone="muted">
        Prev/Next commit page via kitbash-change for controlled apps.
      </kitbash-text>
    </kitbash-stack>
  `,
  play: async ({ canvasElement }) => {
    const pager = canvasElement.querySelector('kitbash-pagination');
    expect(pager).toBeTruthy();

    await waitFor(() => {
      expect(pager?.shadowRoot?.querySelector('.prev')).toBeTruthy();
    });

    const root = pager?.shadowRoot;
    expect(root).toBeTruthy();
    if (!root || !pager) return;

    const prev = root.querySelector('.prev') as HTMLButtonElement | null;
    const next = root.querySelector('.next') as HTMLButtonElement | null;
    const status = root.querySelector('.status') as HTMLElement | null;

    expect(prev).toBeTruthy();
    expect(next).toBeTruthy();
    expect(status).toBeTruthy();
    if (!prev || !next || !status) return;

    expect(prev.getAttribute('aria-label')).toBe('Previous page');
    expect(next.getAttribute('aria-label')).toBe('Next page');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent?.replace(/\s+/g, ' ').trim()).toContain('2 / 5');

    // Middle page: both enabled
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(false);

    // First page boundary
    (pager as HTMLElement & { page: number }).page = 1;
    await waitFor(() => {
      const p = root.querySelector('.prev') as HTMLButtonElement | null;
      const n = root.querySelector('.next') as HTMLButtonElement | null;
      expect(p?.disabled).toBe(true);
      expect(n?.disabled).toBe(false);
    });

    // Last page boundary
    (pager as HTMLElement & { page: number }).page = 5;
    await waitFor(() => {
      const p = root.querySelector('.prev') as HTMLButtonElement | null;
      const n = root.querySelector('.next') as HTMLButtonElement | null;
      expect(p?.disabled).toBe(false);
      expect(n?.disabled).toBe(true);
    });

    // Ensure buttons remain labeled after re-render
    expect(
      (root.querySelector('.prev') as HTMLButtonElement | null)?.getAttribute(
        'aria-label',
      ),
    ).toBe('Previous page');
  },
};

export const FirstPage: Story = {
  render: () => html`
    <kitbash-pagination page=${1} total=${3}></kitbash-pagination>
  `,
  play: async ({ canvasElement }) => {
    const pager = canvasElement.querySelector('kitbash-pagination');
    await waitFor(() => {
      const prev = pager?.shadowRoot?.querySelector(
        '.prev',
      ) as HTMLButtonElement;
      expect(prev?.disabled).toBe(true);
    });
  },
};
