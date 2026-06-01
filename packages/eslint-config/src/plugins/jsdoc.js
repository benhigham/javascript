import eslintPluginJsdoc from 'eslint-plugin-jsdoc';

import { JS_FILES, TS_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  plugins: {
    jsdoc: eslintPluginJsdoc,
  },
};

// Compose the plugin's per-category presets — `contents` (valid tag content),
// `logical` (sound tags), and `stylistic` (consistent formatting) — rather than
// the `recommended-*` bundle. These enforce JSDoc *quality* without mandating
// that JSDoc *exist*; the `requirements` category (the "tags must exist" set)
// is an opt-in export (`./plugins/jsdoc-required`). The JS-vs-TS flavor split
// mirrors the bundle: TS files reject inline types, JS files keep them.

/** @type {Linter.Config} */
export const jsConfig = {
  files: [...JS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/contents-typescript-flavor-error'].rules,
    ...eslintPluginJsdoc.configs['flat/logical-typescript-flavor-error'].rules,
    ...eslintPluginJsdoc.configs['flat/stylistic-typescript-flavor-error'].rules,
    // JS files use JSDoc as their type source, so permit inline types. The
    // granular flavor presets otherwise enable `no-types` (unlike the old
    // `recommended-typescript-flavor` bundle); leaving it on would erase the
    // JS-vs-TS flavor split this file exists to preserve, and would contradict
    // the `require-*-type` rules in the `./plugins/jsdoc-required` opt-in.
    'jsdoc/no-types': 'off',
  },
};

/** @type {Linter.Config} */
export const tsConfig = {
  files: [...TS_FILES],
  ...baseConfig,
  rules: {
    ...eslintPluginJsdoc.configs['flat/contents-typescript-error'].rules,
    ...eslintPluginJsdoc.configs['flat/logical-typescript-error'].rules,
    ...eslintPluginJsdoc.configs['flat/stylistic-typescript-error'].rules,
  },
};
