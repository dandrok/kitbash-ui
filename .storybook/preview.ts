import type { Preview } from '@storybook/web-components-vite';

import '../src/tokens/themes/light.css';
import '../src/tokens/themes/dark.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Run axe on stories; fail CI-level review when we wire test-runner later
      test: 'todo',
    },
    layout: 'padded',
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for kitbash tokens',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = (context.globals.theme as string) || 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
        // Canvas follows semantic tokens (light/dark via data-theme)
        document.body.style.background = 'var(--kb-color-bg-canvas)';
        document.body.style.color = 'var(--kb-color-fg-default)';
        document.body.style.fontFamily = 'var(--kb-font-family-sans)';
        document.body.style.minHeight = '100vh';
        document.body.style.margin = '0';
      }
      return story();
    },
  ],
};

export default preview;
