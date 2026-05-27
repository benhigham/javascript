import eslintPluginDepend from 'eslint-plugin-depend';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    depend: eslintPluginDepend,
  },
  rules: {
    'depend/ban-dependencies': 'error',
  },
};

export default config;
