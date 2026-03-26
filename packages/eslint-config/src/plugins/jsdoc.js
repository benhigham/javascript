import eslintPluginJsdoc from 'eslint-plugin-jsdoc';

import { JS_FILES, TS_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  plugins: {
    jsdoc: eslintPluginJsdoc,
  },
};

/** @type {Linter.Config} */
export const jsConfig = {
  files: [...JS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/recommended-typescript-flavor-error']
      .rules,
  },
};

/** @type {Linter.Config} */
export const tsConfig = {
  files: [...TS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/recommended-typescript-error'].rules,
  },
};
