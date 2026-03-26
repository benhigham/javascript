import eslintPluginN from 'eslint-plugin-n';

import { DEFAULT_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    n: eslintPluginN,
  },
  rules: {
    ...eslintPluginN.configs['flat/recommended'].rules,

    // Redundant with `import-x/no-extraneous-dependencies`.
    'n/no-extraneous-import': 'off',
    'n/no-extraneous-require': 'off',

    // Redundant with `import-x/no-unresolved`.
    'n/no-missing-import': 'off',
    'n/no-missing-require': 'off',

    'n/no-unpublished-import': ['error', { allowModules: ['electron'] }],
    'n/no-unpublished-require': ['error', { allowModules: ['electron'] }],
    'n/no-mixed-requires': ['error', { grouping: true, allowCall: true }],
    'n/no-new-require': 'error',
    'n/no-path-concat': 'error',
    // Supplements `import-x/extensions` — both enforce file extensions, but keeping both ensures coverage regardless of resolver configuration.
    'n/file-extension-in-import': ['error', 'always'],
    'n/prefer-global/buffer': ['error', 'never'],
    'n/prefer-global/console': ['error', 'always'],
    'n/prefer-global/process': ['error', 'never'],
    'n/prefer-global/text-decoder': ['error', 'always'],
    'n/prefer-global/text-encoder': ['error', 'always'],
    'n/prefer-global/url-search-params': ['error', 'always'],
    'n/prefer-global/url': ['error', 'always'],
    'n/prefer-promises/dns': 'error',
    'n/prefer-promises/fs': 'error',
  },
};

export default config;
