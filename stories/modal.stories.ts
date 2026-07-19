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
          'Controlled via `open`. Backdrop click and Escape commit `open: false` (listen for `kitbash-change`). Focus the panel after open for keyboard Escape.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => html`
    <kitbash-modal open title="Confirm action">
      <kitbash-stack gap="md">
        <kitbash-text>Are you sure you want to continue?</kitbash-text>
        <kitbash-stack direction="row" gap="sm">
          <kitbash-button variant="secondary">Cancel</kitbash-button>
          <kitbash-button>Confirm</kitbash-button>
        </kitbash-stack>
      </kitbash-stack>
    </kitbash-modal>
  `,
};

export const Closed: Story = {
  render: () => html`
    <kitbash-text tone="muted"
      >Modal with open=false is not visible (inspect in Controls by forking).</kitbash-text
    >
    <kitbash-modal title="Hidden" ?open=${false}>
      <kitbash-text>Not shown</kitbash-text>
    </kitbash-modal>
  `,
};
