import eslintPluginDepend from 'eslint-plugin-depend';

import { DEFAULT_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES, '**/package.json'],
  plugins: {
    depend: eslintPluginDepend,
  },
  rules: {
    'depend/ban-dependencies': 'error',
  },
};

export default config;
