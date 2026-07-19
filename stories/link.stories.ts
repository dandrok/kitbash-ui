import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/link.js';

type Args = {
  href: string;
  tone: 'default' | 'muted' | 'accent';
  disabled: boolean;
  label: string;
};

const meta = {
  title: 'Components/Link',
  component: 'kitbash-link',
  tags: ['autodocs'],
  args: {
    href: 'https://example.com',
    tone: 'default',
    disabled: false,
    label: 'Example link',
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => html`
    <kitbash-link href=${args.href} tone=${args.tone} ?disabled=${args.disabled}>
      ${args.label}
    </kitbash-link>
  `,
};

export const External: Story = {
  args: { href: 'https://example.com', label: 'Opens externally' },
  render: (args) => html`
    <kitbash-link href=${args.href} target="_blank">${args.label}</kitbash-link>
  `,
};
