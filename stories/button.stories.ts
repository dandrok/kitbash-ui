import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/button.js';

type ButtonArgs = {
  variant: 'primary' | 'secondary';
  disabled: boolean;
  label: string;
};

/**
 * Scaffold button (`my-button`). Production tag `kitbash-button` lands in primitives PR.
 * Use Theme toolbar to verify light/dark tokens and focus ring contrast.
 */
const meta = {
  title: 'Components/Button',
  component: 'my-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    label: 'Button',
  },
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  render: (args) => html`
    <my-button variant=${args.variant} ?disabled=${args.disabled}>
      ${args.label}
    </my-button>
  `,
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary',
  },
  render: (args) => html`
    <my-button variant=${args.variant} ?disabled=${args.disabled}>
      ${args.label}
    </my-button>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
  render: (args) => html`
    <my-button variant=${args.variant} ?disabled=${args.disabled}>
      ${args.label}
    </my-button>
  `,
};
