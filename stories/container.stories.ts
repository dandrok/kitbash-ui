import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/container.js';
import '../dist/vanilla/heading.js';
import '../dist/vanilla/text.js';
import '../dist/vanilla/box.js';

const meta = {
  title: 'Layout/Container',
  component: 'kitbash-container',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-container width="md" padding="lg">
      <kitbash-box surface border padding="lg">
        <kitbash-heading level="3">Contained content</kitbash-heading>
        <kitbash-text tone="muted"
          >Max-width center with horizontal padding.</kitbash-text
        >
      </kitbash-box>
    </kitbash-container>
  `,
};
