import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import '../dist/vanilla/theme-toggle.js';
import '../dist/vanilla/preset-toggle.js';
import '../dist/vanilla/toggle-group.js';
import '../dist/vanilla/scroll-top.js';
import '../dist/vanilla/stack.js';
import '../dist/vanilla/text.js';

const meta = {
  title: 'Navigation/Blog chrome',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Header toggles and scroll-to-top patterned after astro-blog-md. Use Storybook **Theme** + **Preset** toolbars together with these controls.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Toggles: Story = {
  render: () => html`
    <kitbash-stack gap="md">
      <kitbash-text size="sm" tone="muted">
        Segmented group (blog header). Click to flip document theme / preset +
        localStorage. Labels use theme=night (display) while value is dark.
      </kitbash-text>
      <kitbash-toggle-group>
        <kitbash-theme-toggle></kitbash-theme-toggle>
        <kitbash-preset-toggle></kitbash-preset-toggle>
      </kitbash-toggle-group>
    </kitbash-stack>
  `,
  play: async ({ canvasElement }) => {
    const themeBtn = canvasElement
      .querySelector('kitbash-theme-toggle')
      ?.shadowRoot?.querySelector('button');
    expect(themeBtn).toBeTruthy();
    if (!themeBtn) return;

    const before = document.documentElement.dataset.theme;
    await userEvent.click(themeBtn);
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).not.toBe(before);
    });
  },
};

export const ScrollTop: Story = {
  render: () => html`
    <div style="min-height: 180vh; padding: 1rem 0;">
      <kitbash-stack gap="md">
        <kitbash-text>
          Scroll down — the control appears after ~300px (story binds
          <code>visible</code>).
        </kitbash-text>
        <kitbash-text tone="muted" size="sm">
          Host apps: <code>el.visible = window.scrollY &gt; 300</code> (no CE
          window lifecycle — see sdk-feedback).
        </kitbash-text>
      </kitbash-stack>
      <kitbash-scroll-top id="demo-scroll-top"></kitbash-scroll-top>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector(
      'kitbash-scroll-top',
    ) as HTMLElement & { visible?: boolean };
    expect(el).toBeTruthy();
    if (!el) return;

    const sync = () => {
      el.visible = window.scrollY > 300;
    };
    window.addEventListener('scroll', sync, { passive: true });
    sync();

    // Simulate scrolled state without relying on animated scroll
    el.visible = true;
    await waitFor(() => {
      expect(el.hasAttribute('visible') || el.visible === true).toBe(true);
      expect(el.shadowRoot?.querySelector('button')).toBeTruthy();
    });

    const btn = el.shadowRoot?.querySelector('button');
    expect(btn).toBeTruthy();
    if (btn) {
      window.scrollTo(0, 400);
      await userEvent.click(btn);
      await waitFor(() => {
        expect(window.scrollY).toBeLessThan(50);
      });
    }
  },
};
