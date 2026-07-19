import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/radio.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/field.js';

const meta = {
  title: 'Forms/Radio',
  component: 'kitbash-radio',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Group: Story = {
  render: () => html`
    <kitbash-field label="Plan">
      <kitbash-stack gap="sm">
        <kitbash-radio name="plan" value="free" checked>Free</kitbash-radio>
        <kitbash-radio name="plan" value="pro">Pro</kitbash-radio>
        <kitbash-radio name="plan" value="team">Team</kitbash-radio>
      </kitbash-stack>
    </kitbash-field>
  `,
};
