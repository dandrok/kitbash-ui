import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/nav.js';

const meta = {
  title: 'Navigation/Nav',
  component: 'kitbash-nav',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-nav label="Primary">
      <a href="#/">Home</a>
      <a href="#/docs" aria-current="page">Docs</a>
      <a href="#/blog">Blog</a>
    </kitbash-nav>
  `,
};
