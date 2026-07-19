import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/switch.js';
import '../dist/vanilla/stack.js';

type Args = {
  checked: boolean;
  disabled: boolean;
  label: string;
};

const meta = {
  title: 'Forms/Switch',
  component: 'kitbash-switch',
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    label: 'Enable notifications',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => html`
    <kitbash-switch
      name="notify"
      ?checked=${args.checked}
      ?disabled=${args.disabled}
    >
      ${args.label}
    </kitbash-switch>
  `,
};

export const On: Story = {
  args: { checked: true, label: 'Dark mode' },
  render: Default.render,
};
