import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/modal.js';
import '../dist/vanilla/button.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Feedback/Modal',
  component: 'kitbash-modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled via `open`. Backdrop click and Escape commit `open: false`. Use `inline` inside a relative frame for Storybook so the dialog does not cover the whole canvas.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const frame = (inner: ReturnType<typeof html>) => html`
  <div
    style="
      position: relative;
      min-height: 18rem;
      box-sizing: border-box;
      border: 1px dashed var(--kb-color-border-default);
      border-radius: var(--kb-radius-md);
      background: var(--kb-color-bg-subtle);
      overflow: hidden;
    "
  >
    <p
      style="
        margin: 0;
        padding: 1rem;
        color: var(--kb-color-fg-muted);
        font-size: 0.875rem;
      "
    >
      Demo surface — modal is
      <code style="color: var(--kb-color-fg-default)">inline</code> (contained
      here). Apps omit
      <code style="color: var(--kb-color-fg-default)">inline</code> for a
      full-viewport overlay.
    </p>
    ${inner}
  </div>
`;

export const Open: Story = {
  render: () =>
    frame(html`
      <kitbash-modal open inline title="Confirm action">
        <kitbash-stack gap="md">
          <kitbash-text>Are you sure you want to continue?</kitbash-text>
          <kitbash-stack direction="row" gap="sm">
            <kitbash-button variant="secondary">Cancel</kitbash-button>
            <kitbash-button>Confirm</kitbash-button>
          </kitbash-stack>
        </kitbash-stack>
      </kitbash-modal>
    `),
};

export const Closed: Story = {
  render: () => html`
    <kitbash-text tone="muted"
      >Modal with open=false is not visible (inspect in Controls by
      forking).</kitbash-text
    >
    <kitbash-modal title="Hidden" ?open=${false}>
      <kitbash-text>Not shown</kitbash-text>
    </kitbash-modal>
  `,
};
