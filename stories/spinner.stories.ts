import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/spinner.js';
import '../dist/vanilla/stack.js';

const meta = {
  title: 'Feedback/Spinner',
  component: 'kitbash-spinner',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => html`
    <kitbash-stack direction="row" gap="lg" align="center">
      <kitbash-spinner size="sm" label="Loading small"></kitbash-spinner>
      <kitbash-spinner size="md" label="Loading"></kitbash-spinner>
      <kitbash-spinner size="lg" label="Loading large"></kitbash-spinner>
    </kitbash-stack>
  `,
};
