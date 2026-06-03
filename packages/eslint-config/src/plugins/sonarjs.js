import eslintPluginSonarjs from 'eslint-plugin-sonarjs';

import { DEFAULT_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    sonarjs: eslintPluginSonarjs,
  },
  rules: {
    ...eslintPluginSonarjs.configs.recommended.rules,
    // Defer all unused detection to `no-unused-vars`, which honors the
    // `_`-prefix convention and `ignoreRestSiblings`; sonarjs's overlapping
    // rules ignore both (e.g. they flag the destructure-to-omit `{ a: _a,
    // ...rest }`). `no-unused-function-argument` is already off in recommended.
    'sonarjs/unused-import': 'off',
    'sonarjs/no-unused-vars': 'off',
  },
};

export default config;
