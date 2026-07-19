import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/toast.js';

const meta = {
  title: 'Feedback/Toast',
  component: 'kitbash-toast',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => html`
    <p style="margin: 0 0 1rem; color: var(--kb-color-fg-muted);">
      Toast is fixed to the viewport bottom-end when open. Use Theme toolbar for dark.
    </p>
    <kitbash-toast open tone="success" title="Saved">
      Your changes were stored.
    </kitbash-toast>
  `,
};

export const Danger: Story = {
  render: () => html`
    <kitbash-toast open tone="danger" title="Error">
      Something went wrong.
    </kitbash-toast>
  `,
};
