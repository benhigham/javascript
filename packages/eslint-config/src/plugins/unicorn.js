import eslintPluginUnicorn from 'eslint-plugin-unicorn';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'unicorn',
  plugin: eslintPluginUnicorn,
  rules: {
    ...eslintPluginUnicorn.configs.recommended.rules,
    'unicorn/no-null': 'off', // null is required by DOM APIs, JSON, and many libraries.
    'unicorn/prevent-abbreviations': 'off', // Overly aggressive; common abbreviations (e.g. props, params) are clear.
  },
});
