import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/progress.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Feedback/Progress',
  component: 'kitbash-progress',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Determinate: Story = {
  render: () => html`
    <kitbash-stack gap="md" style="max-width: 20rem;">
      <kitbash-text size="sm" tone="muted">40%</kitbash-text>
      <kitbash-progress value=${40} label="Upload progress"></kitbash-progress>
      <kitbash-text size="sm" tone="muted">80%</kitbash-text>
      <kitbash-progress value=${80} label="Almost done"></kitbash-progress>
    </kitbash-stack>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="max-width: 20rem;">
      <kitbash-progress label="Loading"></kitbash-progress>
    </div>
  `,
};
