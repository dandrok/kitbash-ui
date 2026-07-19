import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/alert.js';
import '../dist/vanilla/stack.js';

type Args = {
  tone: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  dismissible: boolean;
  message: string;
};

const meta = {
  title: 'Feedback/Alert',
  component: 'kitbash-alert',
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
  },
  args: {
    tone: 'info',
    title: 'Heads up',
    dismissible: false,
    message: 'Something needs your attention.',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => html`
    <kitbash-alert
      tone=${args.tone}
      title=${args.title}
      ?dismissible=${args.dismissible}
      open
    >
      ${args.message}
    </kitbash-alert>
  `,
};

export const Dismissible: Story = {
  args: { dismissible: true, tone: 'warning', title: 'Warning' },
  render: Default.render,
};

export const Tones: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-alert tone="info" title="Info" open>Informational</kitbash-alert>
      <kitbash-alert tone="success" title="Success" open>Saved</kitbash-alert>
      <kitbash-alert tone="warning" title="Warning" open>Check this</kitbash-alert>
      <kitbash-alert tone="danger" title="Error" open>Failed</kitbash-alert>
    </kitbash-stack>
  `,
};
