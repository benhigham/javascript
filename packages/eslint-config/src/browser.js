import globals from 'globals';

import { confusingGlobals } from './lib/browser-globals.js';
import { DEFAULT_FILES, NODE_FILES } from './lib/file-patterns.js';
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
  {
    // `n` is a Node-environment plugin; its global-preference rules don't apply
    // to browser source. Most sharply, `n/prefer-global/process: never` flags
    // reads of `process.env` (Next's NODE_ENV and the public client vars) and
    // pushes a `node:process` import that breaks Next's build-time env
    // replacement and ships a non-existent browser import. Neutralize the whole
    // family on browser source; Node files (config, build scripts) keep them.
    files: [...DEFAULT_FILES],
    ignores: [...NODE_FILES],
    rules: {
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/console': 'off',
      'n/prefer-global/process': 'off',
      'n/prefer-global/text-decoder': 'off',
      'n/prefer-global/text-encoder': 'off',
      'n/prefer-global/url': 'off',
      'n/prefer-global/url-search-params': 'off',
    },
  },
];

/**
 * A shared ESLint configuration for libraries that use browser APIs.
 * @type {Linter.Config[]}
 */
const config = [...typescriptConfig, testingLibraryConfig, ...baseConfig];

export default config;
