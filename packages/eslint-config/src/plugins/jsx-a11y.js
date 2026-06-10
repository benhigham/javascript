import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'jsx-a11y',
  plugin: eslintPluginJsxA11y,
  rules: {
    ...eslintPluginJsxA11y.flatConfigs.strict.rules,
  },
});
