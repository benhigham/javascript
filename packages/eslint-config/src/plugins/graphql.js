import eslintPluginGraphql from '@graphql-eslint/eslint-plugin';

import { DEFAULT_FILES, GQL_FILES } from '../constants.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  files: [...GQL_FILES],
  languageOptions: {
    parser: eslintPluginGraphql.parser,
  },
  plugins: {
    '@graphql-eslint': eslintPluginGraphql,
  },
};

/** @type {Linter.Config[]} */
export const operationsConfig = [
  {
    files: [...DEFAULT_FILES],
    processor: eslintPluginGraphql.processor,
  },
  baseConfig,
  {
    files: [...GQL_FILES],
    rules: {
      ...eslintPluginGraphql.configs['flat/operations-recommended'].rules,
    },
  },
];

/** @type {Linter.Config[]} */
export const schemaConfig = [
  baseConfig,
  {
    files: [...GQL_FILES],
    rules: {
      ...eslintPluginGraphql.configs['flat/schema-recommended'].rules,
    },
  },
];
