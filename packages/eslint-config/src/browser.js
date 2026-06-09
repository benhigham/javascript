import globals from 'globals';

import baseKernel from './base.js';
import { confusingGlobals } from './lib/browser-globals.js';
import { composeConfig } from './lib/compose.js';
import { DEFAULT_FILES, NODE_FILES } from './lib/file-patterns.js';
import compatConfig from './plugins/compat.js';
import { domConfig as testingLibraryConfig } from './plugins/testing-library.js';
import { typescriptLayers } from './typescript.js';

/** @import { Linter } from 'eslint' */

/**
 * The browser-environment layers: `compat`, the browser globals, and the
 * per-environment neutralization of Node `n` rules and browser-hostile unicorn
 * rules on browser source (Node files — config and build scripts — keep them).
 * Reused by `./react`. (#109 will give the neutralization its own internal owner.)
 * @type {Linter.Config[]}
 */
export const browserEnv = [
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
    // `n` is a Node-environment plugin; its global-preference and
    // Node-version-support rules don't apply to browser source. Most sharply,
    // `n/prefer-global/process: never` flags reads of `process.env` (Next's
    // NODE_ENV and the public client vars) and pushes a `node:process` import
    // that breaks Next's build-time env replacement and ships a non-existent
    // browser import. `no-unsupported-features/node-builtins` likewise flags
    // browser globals that Node has only added experimentally (`localStorage`,
    // `Storage`, `navigator`) as unsupported Node features. Neutralize them on
    // browser source; Node files (config, build scripts) keep them.
    files: [...DEFAULT_FILES],
    ignores: [...NODE_FILES],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/console': 'off',
      'n/prefer-global/process': 'off',
      'n/prefer-global/text-decoder': 'off',
      'n/prefer-global/text-encoder': 'off',
      'n/prefer-global/url': 'off',
      'n/prefer-global/url-search-params': 'off',
    },
  },
  {
    // `unicorn/prefer-global-this` autofixes idiomatic `window`/`self` access to
    // `globalThis` and rewrites the canonical `typeof window === 'undefined'`
    // guard. `globalThis` is floor-safe (ES2020), so this is an idiom/churn
    // conflict with browser source, not a floor issue. NODE_FILES keep it on
    // (`globalThis` is the correct global there).
    files: [...DEFAULT_FILES],
    ignores: [...NODE_FILES],
    rules: {
      'unicorn/prefer-global-this': 'off',
    },
  },
];

/**
 * A shared ESLint configuration for libraries that use browser APIs.
 * @type {Linter.Config[]}
 */
const config = composeConfig([
  ...baseKernel,
  ...typescriptLayers,
  testingLibraryConfig,
  ...browserEnv,
]);

export default config;
