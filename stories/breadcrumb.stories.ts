import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/breadcrumb.js';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: 'kitbash-breadcrumb',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-breadcrumb>
      <a href="#/">Home</a>
      <a href="#/docs">Docs</a>
      <span aria-current="page">Components</span>
    </kitbash-breadcrumb>
  `,
};
