import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/badge.js';

type Args = {
  tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  label: string;
};

const meta = {
  title: 'Components/Badge',
  component: 'kitbash-badge',
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
  args: {
    tone: 'neutral',
    label: 'Badge',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Neutral: Story = {
  render: (args) => html`
    <kitbash-badge tone=${args.tone}>${args.label}</kitbash-badge>
  `,
};

export const Success: Story = {
  args: { tone: 'success', label: 'Active' },
  render: Neutral.render,
};

export const Danger: Story = {
  args: { tone: 'danger', label: 'Error' },
  render: Neutral.render,
};
