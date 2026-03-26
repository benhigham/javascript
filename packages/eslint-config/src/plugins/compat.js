import eslintPluginCompat from 'eslint-plugin-compat';

import { DEFAULT_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
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
