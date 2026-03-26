import dependConfig from './plugins/depend.js';
import eslintCommentsConfig from './plugins/eslint-comments.js';
import { jsConfig as jsdocConfig } from './plugins/jsdoc.js';
import nConfig from './plugins/n.js';
import noSecretsConfig from './plugins/no-secrets.js';
import noUnsanitizedConfig from './plugins/no-unsanitized.js';
import noUseExtendNativeConfig from './plugins/no-use-extend-native.js';
import promiseConfig from './plugins/promise.js';
import sonarjsConfig from './plugins/sonarjs.js';
import unicornConfig from './plugins/unicorn.js';
import vitestConfig from './plugins/vitest.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.RulesRecord} */
export const rules = {
  'capitalized-comments': 'off',
};

/** @type {Linter.Config[]} */
const config = [
  {
    ignores: [
      'build',
      'coverage',
      'dist',
      'dist-ssr',
      'logs',
      'public',
      '.cache',
      'pnpm-lock.yaml',
    ],
  },
  dependConfig,
  eslintCommentsConfig,
  jsdocConfig,
  nConfig,
  noSecretsConfig,
  noUnsanitizedConfig,
  noUseExtendNativeConfig,
  promiseConfig,
  sonarjsConfig,
  unicornConfig,
  vitestConfig,
];

export default config;
