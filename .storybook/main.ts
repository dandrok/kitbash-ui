import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|js)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  async viteFinal(config) {
    // Ensure built CE assets resolve from project root
    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        allow: ['..'],
      },
    };
    return config;
  },
};

export default config;
