import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/select.js';
import '../dist/vanilla/label.js';

const meta = {
  title: 'Components/Select',
  component: 'kitbash-select',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <kitbash-label for="country">Country</kitbash-label>
      <kitbash-select id="country" name="country" value="">
        <option value="">Choose…</option>
        <option value="pl">Poland</option>
        <option value="de">Germany</option>
        <option value="us">United States</option>
      </kitbash-select>
    </div>
  `,
};
