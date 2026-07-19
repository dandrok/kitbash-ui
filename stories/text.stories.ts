import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/text.js';
import '../dist/vanilla/stack.js';

const meta = {
  title: 'Layout/Text',
  component: 'kitbash-text',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Tones: Story = {
  render: () => html`
    <kitbash-stack gap="sm">
      <kitbash-text>Default body text</kitbash-text>
      <kitbash-text tone="muted">Muted supporting text</kitbash-text>
      <kitbash-text tone="subtle">Subtle caption-like text</kitbash-text>
      <kitbash-text tone="accent">Accent emphasis</kitbash-text>
      <kitbash-text tone="danger">Danger / error text</kitbash-text>
    </kitbash-stack>
  `,
};
