import globals from 'globals';

import { confusingGlobals } from './browser-globals.js';
import compatConfig from './plugins/compat.js';
import { domConfig as testingLibraryConfig } from './plugins/testing-library.js';
import typescriptConfig from './typescript.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config[]} */
export const baseConfig = [
  compatConfig,
  {
    languageOptions: {
      globals: {
        ...globals.es2026,
        ...globals.browser,
      },
    },
    rules: {
      'no-restricted-globals': ['error', ...confusingGlobals],
    },
  },
];

/**
 * A shared ESLint configuration for libraries that use browser APIs.
 * @type {Linter.Config[]}
 */
const config = [...typescriptConfig, testingLibraryConfig, ...baseConfig];

export default config;
