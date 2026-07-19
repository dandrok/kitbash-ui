import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/skeleton.js';
import '../dist/vanilla/stack.js';

const meta = {
  title: 'Feedback/Skeleton',
  component: 'kitbash-skeleton',
  tags: ['autodocs'],
  parameters: {
    a11y: {
      // Decorative placeholders (aria-hidden)
      disable: true,
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CardPlaceholder: Story = {
  render: () => html`
    <kitbash-stack gap="md" style="max-width: 20rem;">
      <kitbash-skeleton variant="rect" height="8rem"></kitbash-skeleton>
      <kitbash-skeleton variant="text" width="80%"></kitbash-skeleton>
      <kitbash-skeleton variant="text" width="60%"></kitbash-skeleton>
      <kitbash-stack direction="row" gap="sm" align="center">
        <kitbash-skeleton variant="circle"></kitbash-skeleton>
        <kitbash-skeleton variant="text" width="40%"></kitbash-skeleton>
      </kitbash-stack>
    </kitbash-stack>
  `,
};
