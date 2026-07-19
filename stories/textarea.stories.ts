import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../dist/vanilla/textarea.js';
import '../dist/vanilla/label.js';

type Args = {
  value: string;
  placeholder: string;
  required: boolean;
  invalid: boolean;
  disabled: boolean;
};

const meta = {
  title: 'Components/Textarea',
  component: 'kitbash-textarea',
  tags: ['autodocs'],
  args: {
    value: '',
    placeholder: 'Write a message…',
    required: false,
    invalid: false,
    disabled: false,
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 400px;">
      <kitbash-label for="ta" ?required=${args.required}>Message</kitbash-label>
      <kitbash-textarea
        id="ta"
        name="message"
        .value=${args.value}
        placeholder=${args.placeholder}
        ?required=${args.required}
        ?invalid=${args.invalid}
        ?disabled=${args.disabled}
      ></kitbash-textarea>
    </div>
  `,
};
