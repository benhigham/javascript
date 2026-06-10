import eslintPluginNext from '@next/eslint-plugin-next';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: '@next/next',
  plugin: eslintPluginNext,
  rules: {
    ...eslintPluginNext.configs.recommended.rules,
    ...eslintPluginNext.configs['core-web-vitals'].rules,
  },
});
