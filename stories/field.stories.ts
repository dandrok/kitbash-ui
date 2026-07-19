import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/field.js';
import '../dist/vanilla/input.js';
import '../dist/vanilla/stack.js';

const meta = {
  title: 'Forms/Field',
  component: 'kitbash-field',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kitbash-field
      label="Email"
      hint="We'll never share your email."
      required
      style="max-width: 20rem;"
    >
      <kitbash-input
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      ></kitbash-input>
    </kitbash-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <kitbash-field
      label="Username"
      error="Username is already taken."
      required
      style="max-width: 20rem;"
    >
      <kitbash-input
        name="username"
        value="admin"
        invalid
        required
      ></kitbash-input>
    </kitbash-field>
  `,
};
