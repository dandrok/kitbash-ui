import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';

import '../dist/vanilla/badge.js';
import '../dist/vanilla/stack.js';

type Args = {
  tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  variant: 'soft' | 'tag';
  hash: boolean;
  label: string;
};

const meta = {
  title: 'Components/Badge',
  component: 'kitbash-badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Status pill (`variant=soft`) or blog-style tag chip (`variant=tag` + optional `hash` for `#label`). Tag chips use accent tokens so terminal preset looks like the Matrix green TagList.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['soft', 'tag'],
    },
    hash: { control: 'boolean' },
  },
  args: {
    tone: 'neutral',
    variant: 'soft',
    hash: false,
    label: 'Badge',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Soft: Story = {
  name: 'Soft (status)',
  render: (args) => html`
    <kitbash-badge tone=${args.tone} variant=${args.variant} ?hash=${args.hash}
      >${args.label}</kitbash-badge
    >
  `,
};

export const Success: Story = {
  args: { tone: 'success', label: 'Active' },
  render: Soft.render,
};

export const Danger: Story = {
  args: { tone: 'danger', label: 'Error' },
  render: Soft.render,
};

/** Blog TagList.astro parity — flex wrap of accent outline chips with #. */
export const BlogTags: Story = {
  name: 'Blog tags (TagList)',
  args: {
    tone: 'accent',
    variant: 'tag',
    hash: true,
  },
  render: () => {
    const tags = ['react', 'hooks', 'typescript', 'astro', 'css'];
    return html`
      <kitbash-stack direction="row" gap="sm" wrap>
        ${tags.map(
          (t) => html`
            <kitbash-badge variant="tag" tone="accent" hash>${t}</kitbash-badge>
          `,
        )}
      </kitbash-stack>
    `;
  },
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll('kitbash-badge');
    expect(badges.length).toBe(5);
    const first = badges[0];
    await expect(first).toBeTruthy();
    // hash prefix is decorative aria-hidden
    const hash = first?.shadowRoot?.querySelector('.hash');
    expect(hash?.textContent).toBe('#');
    expect(first?.getAttribute('variant')).toBe('tag');
  },
};

export const TagTones: Story = {
  name: 'Tag tones',
  render: () => html`
    <kitbash-stack direction="row" gap="sm" wrap>
      <kitbash-badge variant="tag" tone="neutral" hash>draft</kitbash-badge>
      <kitbash-badge variant="tag" tone="accent" hash>featured</kitbash-badge>
      <kitbash-badge variant="tag" tone="success" hash>shipped</kitbash-badge>
      <kitbash-badge variant="tag" tone="warning" hash>wip</kitbash-badge>
      <kitbash-badge variant="tag" tone="danger" hash>breaking</kitbash-badge>
    </kitbash-stack>
  `,
};
