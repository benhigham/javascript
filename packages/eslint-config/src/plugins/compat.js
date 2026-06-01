import eslintPluginCompat from 'eslint-plugin-compat';

import { DEFAULT_FILES, NODE_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  // `compat` checks browser API availability against browserslist — it belongs
  // to the browser environment, so skip Node-environment files (config files,
  // build scripts) where browser-compat checks produce false positives.
  ignores: [...NODE_FILES],
  plugins: {
    compat: eslintPluginCompat,
  },
  settings: {
    lintAllEsApis: true,
  },
  rules: {
    'compat/compat': 'error',
  },
};

export default config;
