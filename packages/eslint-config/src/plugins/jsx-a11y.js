import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

import { DEFAULT_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    'jsx-a11y': eslintPluginJsxA11y,
  },
  rules: {
    ...eslintPluginJsxA11y.flatConfigs.strict.rules,
  },
};

export default config;
