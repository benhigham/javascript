import eslintPluginNoUnsanitized from 'eslint-plugin-no-unsanitized';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

const { plugins, rules } = eslintPluginNoUnsanitized.configs.recommended;

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins,
  rules,
};

export default config;
