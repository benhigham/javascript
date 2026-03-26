import eslintPluginSonarjs from 'eslint-plugin-sonarjs';

import { DEFAULT_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    sonarjs: eslintPluginSonarjs,
  },
  rules: {
    ...eslintPluginSonarjs.configs.recommended.rules,
    'sonarjs/unused-import': 'off', // We use `no-unused-vars` instead.
  },
};

export default config;
