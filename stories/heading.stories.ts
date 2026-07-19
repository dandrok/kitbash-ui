import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/heading.js';
import '../dist/vanilla/stack.js';

const meta = {
  title: 'Layout/Heading',
  component: 'kitbash-heading',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Levels: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-heading level="1">Heading level 1</kitbash-heading>
      <kitbash-heading level="2">Heading level 2</kitbash-heading>
      <kitbash-heading level="3">Heading level 3</kitbash-heading>
      <kitbash-heading level="4">Heading level 4</kitbash-heading>
      <kitbash-heading level="5">Heading level 5</kitbash-heading>
      <kitbash-heading level="6">Heading level 6</kitbash-heading>
    </kitbash-stack>
  `,
};
