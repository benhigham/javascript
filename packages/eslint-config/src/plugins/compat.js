import eslintPluginCompat from 'eslint-plugin-compat';

import { definePlugin } from '../lib/define-plugin.js';
import { NODE_FILES } from '../lib/file-patterns.js';

export default definePlugin({
  name: 'compat',
  plugin: eslintPluginCompat,
  // `compat` checks browser API availability against browserslist — it belongs
  // to the browser environment, so skip Node-environment files (config files,
  // build scripts) where browser-compat checks produce false positives.
  ignores: [...NODE_FILES],
  settings: {
    lintAllEsApis: true,
  },
  rules: {
    'compat/compat': 'error',
  },
});
