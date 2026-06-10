import eslintPluginNoUnsanitized from 'eslint-plugin-no-unsanitized';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'no-unsanitized',
  plugin: eslintPluginNoUnsanitized,
  rules: {
    ...eslintPluginNoUnsanitized.configs.recommended.rules,
  },
});
