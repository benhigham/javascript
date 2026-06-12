import eslintPluginCompat from 'eslint-plugin-compat';

import { definePlugin } from '../lib/define-plugin.js';

// `compat` checks browser API availability against browserslist. This wrapper
// states only what the plugin is; where it applies — scoped off Node files,
// the inverse half of the environment seam — is authored by the browser layer
// that owns the environment (`browser.js`, ADR-0002).
export default definePlugin({
  name: 'compat',
  plugin: eslintPluginCompat,
  settings: {
    lintAllEsApis: true,
  },
  rules: {
    'compat/compat': 'error',
  },
});
