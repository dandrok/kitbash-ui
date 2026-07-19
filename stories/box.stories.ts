import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/box.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Layout/Box',
  component: 'kitbash-box',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Surface: Story = {
  render: () => html`
    <kitbash-box padding="lg" radius="md" border surface>
      <kitbash-text>Padded surface box</kitbash-text>
    </kitbash-box>
  `,
};
