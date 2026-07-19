import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/label.js';
import '../dist/vanilla/input.js';

const meta = {
  title: 'Components/Label',
  component: 'kitbash-label',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const WithInput: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <kitbash-label for="lbl-demo" required>Username</kitbash-label>
      <kitbash-input id="lbl-demo" name="username" placeholder="name"></kitbash-input>
    </div>
  `,
};
