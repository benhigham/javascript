import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';

import { definePlugin } from '../lib/define-plugin.js';
import { DEFAULT_FILES } from '../lib/file-patterns.js';

export default definePlugin({
  name: 'better-tailwindcss',
  purpose: 'tailwindcss',
  plugin: eslintPluginBetterTailwindcss,
  files: [...DEFAULT_FILES, '**/*.{html,vue}'],
  rules: {
    ...eslintPluginBetterTailwindcss.configs.recommended.rules,
  },
});
