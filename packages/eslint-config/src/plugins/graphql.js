import eslintPluginGraphql from '@graphql-eslint/eslint-plugin';

import { DEFAULT_FILES, GQL_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  name: '@benhigham/eslint-config/graphql/setup',
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
    name: '@benhigham/eslint-config/graphql/processor',
    files: [...DEFAULT_FILES],
    processor: eslintPluginGraphql.processor,
  },
  baseConfig,
  {
    name: '@benhigham/eslint-config/graphql/operations',
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
    name: '@benhigham/eslint-config/graphql/schema',
    files: [...GQL_FILES],
    rules: {
      ...eslintPluginGraphql.configs['flat/schema-recommended'].rules,
    },
  },
];
