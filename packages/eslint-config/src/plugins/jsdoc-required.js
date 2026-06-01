import eslintPluginJsdoc from 'eslint-plugin-jsdoc';

import { JS_FILES, TS_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  plugins: {
    jsdoc: eslintPluginJsdoc,
  },
};

// Opt-in mandate: the `requirements` category — `require-jsdoc`, `require-param`,
// `require-returns`, `require-property*`, `require-yields*`, `require-example`,
// etc. ("tags must exist"). Kept out of the base so apps aren't forced to
// document every symbol; libraries opt in by spreading this export. The JS-vs-TS
// flavor split matches the quality presets in `./jsdoc.js`.

/** @type {Linter.Config} */
export const jsConfig = {
  files: [...JS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/requirements-typescript-flavor-error'].rules,
  },
};

/** @type {Linter.Config} */
export const tsConfig = {
  files: [...TS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/requirements-typescript-error'].rules,
  },
};

/**
 * A shared ESLint configuration that mandates the existence of JSDoc tags.
 * @type {Linter.Config[]}
 */
const config = [jsConfig, tsConfig];

export default config;
