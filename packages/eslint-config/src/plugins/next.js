import eslintPluginNext from '@next/eslint-plugin-next';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    '@next/next': eslintPluginNext,
  },
  rules: {
    ...eslintPluginNext.configs.recommended.rules,
    ...eslintPluginNext.configs['core-web-vitals'].rules,
  },
};

export default config;
