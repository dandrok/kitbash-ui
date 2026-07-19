import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import '../dist/vanilla/tabs.js';
import '../dist/vanilla/tab.js';
import '../dist/vanilla/tab-panel.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Navigation/Tabs',
  component: 'kitbash-tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Use `kitbash-tabs` + `kitbash-tab` + `kitbash-tab-panel`. Listen for `kitbash-change` on tabs to set the matching panel `open`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-tabs label="Demo tabs">
        <kitbash-tab value="one" selected>Overview</kitbash-tab>
        <kitbash-tab value="two">Details</kitbash-tab>
        <kitbash-tab value="three" disabled>Disabled</kitbash-tab>
      </kitbash-tabs>
      <kitbash-tab-panel value="one" open>
        <kitbash-text>Overview panel content.</kitbash-text>
      </kitbash-tab-panel>
      <kitbash-tab-panel value="two">
        <kitbash-text
          >Details panel (set open via app state when tab two is
          selected).</kitbash-text
        >
      </kitbash-tab-panel>
      <kitbash-text size="sm" tone="muted">
        Clicking a tab selects it (siblings unselected). Wire panels in your app
        with kitbash-change.
      </kitbash-text>
    </kitbash-stack>
  `,
  play: async ({ canvasElement }) => {
    const tabsHost = canvasElement.querySelector('kitbash-tabs');
    expect(tabsHost).toBeTruthy();

    const tabEls = Array.from(
      canvasElement.querySelectorAll('kitbash-tab'),
    ) as HTMLElement[];
    expect(tabEls.length).toBeGreaterThanOrEqual(2);

    const buttonOf = (tab: HTMLElement) =>
      tab.shadowRoot?.querySelector('button') as HTMLButtonElement | null;

    await waitFor(() => {
      expect(buttonOf(tabEls[0])).toBeTruthy();
    });

    const first = buttonOf(tabEls[0]);
    const second = buttonOf(tabEls[1]);
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    if (!first || !second) return;

    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(second.getAttribute('aria-selected')).toBe('false');

    first.focus();
    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() => {
      expect(buttonOf(tabEls[0])?.getAttribute('aria-selected')).toBe('false');
      expect(buttonOf(tabEls[1])?.getAttribute('aria-selected')).toBe('true');
    });
  },
};
