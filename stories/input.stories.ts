import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/input.js';
import '../dist/vanilla/label.js';

type InputArgs = {
  name: string;
  value: string;
  placeholder: string;
  required: boolean;
  invalid: boolean;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
};

const meta = {
  title: 'Components/Input',
  component: 'kitbash-input',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    name: 'email',
    value: '',
    placeholder: 'you@example.com',
    required: false,
    invalid: false,
    disabled: false,
    size: 'md',
  },
} satisfies Meta<InputArgs>;

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <kitbash-label for="story-input" ?required=${args.required}>
        Email
      </kitbash-label>
      <kitbash-input
        id="story-input"
        name=${args.name}
        size=${args.size}
        .value=${args.value}
        placeholder=${args.placeholder}
        ?required=${args.required}
        ?invalid=${args.invalid}
        ?disabled=${args.disabled}
      ></kitbash-input>
    </div>
  `,
};

export const Invalid: Story = {
  args: { invalid: true, placeholder: 'Invalid' },
  render: Default.render,
};

export const Required: Story = {
  args: { required: true },
  render: Default.render,
};
