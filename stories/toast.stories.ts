import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/toast.js';

const meta = {
  title: 'Feedback/Toast',
  component: 'kitbash-toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled via `open`. Default: fixed to the viewport bottom-end. Use `inline` inside a `position: relative` frame for Storybook / embedded demos so the toast does not cover the whole canvas.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Demo frame keeps fixed toast from covering Storybook chrome. */
const frame = (inner: ReturnType<typeof html>) => html`
  <div
    style="
      position: relative;
      min-height: 14rem;
      box-sizing: border-box;
      padding: 1rem;
      border: 1px dashed var(--kb-color-border-default);
      border-radius: var(--kb-radius-md);
      background: var(--kb-color-bg-subtle);
      color: var(--kb-color-fg-muted);
      font: inherit;
    "
  >
    <p style="margin: 0; max-width: 18rem; font-size: 0.875rem;">
      Preview surface — toast is
      <code style="color: var(--kb-color-fg-default)">inline</code> here
      (bottom-end of this box). Apps omit
      <code style="color: var(--kb-color-fg-default)">inline</code> for
      viewport-fixed toasts.
    </p>
    ${inner}
  </div>
`;

export const Open: Story = {
  name: 'Success',
  render: () =>
    frame(html`
      <kitbash-toast open inline tone="success" title="Saved">
        Your changes were stored.
      </kitbash-toast>
    `),
};

export const Danger: Story = {
  render: () =>
    frame(html`
      <kitbash-toast open inline tone="danger" title="Error">
        Something went wrong.
      </kitbash-toast>
    `),
};

export const Info: Story = {
  render: () =>
    frame(html`
      <kitbash-toast open inline tone="info" title="Tip">
        Load theme CSS on the document for light/dark.
      </kitbash-toast>
    `),
};

export const Warning: Story = {
  render: () =>
    frame(html`
      <kitbash-toast open inline tone="warning" title="Check input">
        Some fields need attention before saving.
      </kitbash-toast>
    `),
};
