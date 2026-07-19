import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { cssVarName, semanticTokens } from '../src/tokens/semantic.ts';

const colorKeys = Object.keys(semanticTokens).filter((k) =>
  k.startsWith('color-'),
) as (keyof typeof semanticTokens)[];

/**
 * Visual sample of semantic color tokens. Switch Theme toolbar to verify dark mode.
 */
const meta: Meta = {
  title: 'Foundation/Tokens',
  tags: ['autodocs'],
  parameters: {
    a11y: {
      // Decorative swatches only — skip axe on non-interactive demos
      disable: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColorSwatches: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;"
    >
      ${colorKeys.map((key) => {
        const prop = cssVarName(key);
        return html`
          <div
            style="border: 1px solid var(--kb-color-border-default); border-radius: var(--kb-radius-md); overflow: hidden;"
          >
            <div style="height: 64px; background: var(${prop});"></div>
            <div
              style="padding: 8px; font-size: var(--kb-font-size-sm); color: var(--kb-color-fg-default);"
            >
              <code>${prop}</code>
            </div>
          </div>
        `;
      })}
    </div>
  `,
};
