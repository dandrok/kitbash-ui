import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { cssVarName, semanticTokens } from '../src/tokens/semantic.ts';

const keys = Object.keys(semanticTokens) as (keyof typeof semanticTokens)[];

const meta = {
  title: 'Foundation/Token scales',
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function swatches(prefix: string) {
  return keys
    .filter((k) => k.startsWith(prefix))
    .map((key) => {
      const prop = cssVarName(key);
      return html`
        <div
          style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;"
        >
          <code style="min-width: 12rem; font-size: var(--kb-font-size-sm);"
            >${prop}</code
          >
          <div
            style="flex: 1; height: 12px; border-radius: 4px; background: var(--kb-color-bg-subtle);"
          >
            <div
              style="height: 100%; width: var(${prop}); max-width: 100%; background: var(--kb-color-accent-default); border-radius: 4px;"
            ></div>
          </div>
          <span style="font-size: var(--kb-font-size-sm); color: var(--kb-color-fg-muted);"
            >${semanticTokens[key].light}</span
          >
        </div>
      `;
    });
}

export const Space: Story = {
  name: 'Space',
  render: () => html`<div>${swatches('space-')}</div>`,
};

export const Radius: Story = {
  name: 'Radius',
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px;">
      ${keys
        .filter((k) => k.startsWith('radius-'))
        .map((key) => {
          const prop = cssVarName(key);
          return html`
            <div style="text-align: center;">
              <div
                style="width: 64px; height: 64px; background: var(--kb-color-accent-subtle); border: 2px solid var(--kb-color-accent-default); border-radius: var(${prop});"
              ></div>
              <code style="font-size: var(--kb-font-size-sm);">${prop}</code>
            </div>
          `;
        })}
    </div>
  `,
};

export const Typography: Story = {
  name: 'Typography',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${keys
        .filter((k) => k.startsWith('font-size-'))
        .map(
          (key) => html`
            <p style="margin: 0; font-size: var(${cssVarName(key)});">
              ${cssVarName(key)} — The quick brown fox
            </p>
          `,
        )}
    </div>
  `,
};
