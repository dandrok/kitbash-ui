import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/stack.js';
import '../dist/vanilla/button.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Layout/Stack',
  component: 'kitbash-stack',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Column: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-text>Item one</kitbash-text>
      <kitbash-text tone="muted">Item two</kitbash-text>
      <kitbash-button>Action</kitbash-button>
    </kitbash-stack>
  `,
};

export const Row: Story = {
  render: () => html`
    <kitbash-stack direction="row" gap="sm" align="center">
      <kitbash-button variant="secondary">Cancel</kitbash-button>
      <kitbash-button>Save</kitbash-button>
    </kitbash-stack>
  `,
};
