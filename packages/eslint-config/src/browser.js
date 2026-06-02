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
    // These rules steer code toward syntax or APIs newer than the consumer's
    // browserslist floor, and `compat` doesn't catch the result:
    //   - `require-unicode-regexp`'s `v` flag is ES2024 (Chrome 112+ / Safari 17+),
    //     a `SyntaxError` below the floor that SWC doesn't downlevel; require `u`
    //     instead (existing `/…/v` is then flagged, with a suggestion to use `u`).
    //   - `unicorn/no-array-sort` only offers `.toSorted()` (Chrome 110+) as the
    //     escape from a flagged `.sort()`, not the floor-safe `[...arr].sort()`.
    // Scoped to browser source; NODE_FILES run on Node (>=20), where both are fine.
    files: [...DEFAULT_FILES],
    ignores: [...NODE_FILES],
    rules: {
      'require-unicode-regexp': ['error', { requireFlag: 'u' }],
      'unicorn/no-array-sort': 'off',
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
const config = [...typescriptConfig, testingLibraryConfig, ...baseConfig];

export default config;
