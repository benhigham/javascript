import eslintPluginNoUnsanitized from 'eslint-plugin-no-unsanitized';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    'no-unsanitized': eslintPluginNoUnsanitized,
  },
  rules: {
    ...eslintPluginNoUnsanitized.configs.recommended.rules,
  },
};

export default config;
