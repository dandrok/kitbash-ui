import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/button.js';

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  label: string;
};

const meta = {
  title: 'Components/Button',
  component: 'kitbash-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    label: 'Button',
  },
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  render: (args) => html`
    <kitbash-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
    >
      ${args.label}
    </kitbash-button>
  `,
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Secondary' },
  render: Primary.render,
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Ghost' },
  render: Primary.render,
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Delete' },
  render: Primary.render,
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled' },
  render: Primary.render,
};
