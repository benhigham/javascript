import eslintPluginNoSecrets from 'eslint-plugin-no-secrets';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    'no-secrets': eslintPluginNoSecrets,
  },
  rules: {
    'no-secrets/no-secrets': 'error',
  },
};

export default config;
