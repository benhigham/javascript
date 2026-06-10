import eslintPluginPlaywright from 'eslint-plugin-playwright';

import { definePlugin } from '../lib/define-plugin.js';

// `files: null` — no `files` property; consumers scope this to their test files.
export default definePlugin({
  name: 'playwright',
  plugin: eslintPluginPlaywright,
  files: null,
  rules: {
    ...eslintPluginPlaywright.configs['flat/recommended'].rules,
  },
});
