import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/checkbox.js';

type Args = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  label: string;
};

const meta = {
  title: 'Components/Checkbox',
  component: 'kitbash-checkbox',
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    invalid: false,
    label: 'Accept terms',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => html`
    <kitbash-checkbox
      name="terms"
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?invalid=${args.invalid}
    >
      ${args.label}
    </kitbash-checkbox>
  `,
};

export const Checked: Story = {
  args: { checked: true },
  render: Default.render,
};
