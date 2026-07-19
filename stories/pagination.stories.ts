import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/pagination.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Navigation/Pagination',
  component: 'kitbash-pagination',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-pagination page=${2} total=${5}></kitbash-pagination>
      <kitbash-text size="sm" tone="muted">
        Prev/Next commit page via kitbash-change for controlled apps.
      </kitbash-text>
    </kitbash-stack>
  `,
};
