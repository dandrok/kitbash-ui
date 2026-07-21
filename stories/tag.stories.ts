import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';

import '../dist/vanilla/tag.js';
import '../dist/vanilla/tag-list.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Components/Tag',
  component: 'kitbash-tag-list',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tag chips: outline, `#` prefix, accent@30% border + 5% wash, text-xs, px-2 py-1, flex-wrap gap-2. Terminal preset → Matrix green; default → blue. Compose with `kitbash-tag` children (wrap in `<a>` for links).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sample = ['react', 'hooks', 'typescript', 'astro', 'css'];

/** Flex-wrap list of tags (generic metadata chips). */
export const TagList: Story = {
  name: 'Tag list',
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-text tone="muted"
        >Compare terminal vs default preset in the toolbar.</kitbash-text
      >
      <kitbash-tag-list>
        ${sample.map((t) => html`<kitbash-tag>${t}</kitbash-tag>`)}
      </kitbash-tag-list>
    </kitbash-stack>
  `,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('kitbash-tag-list');
    const tags = canvasElement.querySelectorAll('kitbash-tag');
    expect(list).toBeTruthy();
    expect(tags.length).toBe(5);
    await waitFor(() => {
      const hash = tags[0]?.shadowRoot?.querySelector('.hash');
      expect(hash?.textContent).toBe('#');
      expect(tags[0]?.textContent?.trim()).toBe('react');
    });
  },
};

/** Linked tags (list must not destroy anchors). */
export const LinkedTags: Story = {
  render: () => html`
    <kitbash-tag-list>
      <a href="#react"><kitbash-tag>react</kitbash-tag></a>
      <a href="#hooks"><kitbash-tag>hooks</kitbash-tag></a>
      <a href="#astro"><kitbash-tag>astro</kitbash-tag></a>
    </kitbash-tag-list>
  `,
  play: async ({ canvasElement }) => {
    const anchors = canvasElement.querySelectorAll('kitbash-tag-list a');
    expect(anchors.length).toBe(3);
    expect(anchors[0]?.getAttribute('href')).toBe('#react');
  },
};

export const SingleTag: Story = {
  render: () => html` <kitbash-tag>markdown</kitbash-tag> `,
};

export const ManyTags: Story = {
  render: () => html`
    <div style="max-width: 16rem;">
      <kitbash-tag-list>
        <kitbash-tag>tui</kitbash-tag>
        <kitbash-tag>ai</kitbash-tag>
        <kitbash-tag>cli</kitbash-tag>
        <kitbash-tag>javascript</kitbash-tag>
        <kitbash-tag>async</kitbash-tag>
        <kitbash-tag>promises</kitbash-tag>
        <kitbash-tag>etl</kitbash-tag>
        <kitbash-tag>svelte</kitbash-tag>
        <kitbash-tag>sqlite</kitbash-tag>
        <kitbash-tag>web development</kitbash-tag>
      </kitbash-tag-list>
    </div>
  `,
};
