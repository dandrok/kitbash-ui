import type { Preview } from '@storybook/web-components-vite';

import '../src/tokens/themes/light.css';
import '../src/tokens/themes/dark.css';
import '../src/tokens/themes/terminal/light.css';
import '../src/tokens/themes/terminal/dark.css';
import {
  applyPreset,
  applyTheme,
  type KitbashPreset,
  type KitbashTheme,
} from '../src/tokens/semantic.ts';

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
      description: 'Color scheme (data-theme)',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark / night', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    preset: {
      description: 'Brand preset (data-kb-preset) — maps to blog UI mode',
      defaultValue: 'default',
      toolbar: {
        title: 'Preset',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (regular)' },
          { value: 'terminal', title: 'Terminal' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = ((context.globals.theme as string) ||
        'light') as KitbashTheme;
      const preset = ((context.globals.preset as string) ||
        'default') as KitbashPreset;
      if (typeof document !== 'undefined') {
        applyTheme(theme === 'dark' ? 'dark' : 'light');
        applyPreset(preset === 'terminal' ? 'terminal' : 'default');
        // Canvas follows semantic tokens (theme + preset)
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
