import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/input.js';

type InputArgs = {
  name: string;
  value: string;
  placeholder: string;
  required: boolean;
  invalid: boolean;
};

/**
 * Form-associated `kitbash-input`. Pair with Label in the primitives wave for full a11y naming.
 * Stories demonstrate invalid/required states for keyboard + AT checks.
 */
const meta = {
  title: 'Components/Input',
  component: 'kitbash-input',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    name: 'example',
    value: '',
    placeholder: 'Type here…',
    required: false,
    invalid: false,
  },
} satisfies Meta<InputArgs>;

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {
  render: (args) => html`
    <label style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <span>Example field</span>
      <kitbash-input
        name=${args.name}
        .value=${args.value}
        placeholder=${args.placeholder}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></kitbash-input>
    </label>
  `,
};

export const Invalid: Story = {
  args: {
    invalid: true,
    value: '',
    placeholder: 'Invalid state',
  },
  render: (args) => html`
    <label style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <span>Invalid field</span>
      <kitbash-input
        name=${args.name}
        .value=${args.value}
        placeholder=${args.placeholder}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></kitbash-input>
    </label>
  `,
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required',
  },
  render: (args) => html`
    <label style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <span>Required field</span>
      <kitbash-input
        name=${args.name}
        .value=${args.value}
        placeholder=${args.placeholder}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></kitbash-input>
    </label>
  `,
};
