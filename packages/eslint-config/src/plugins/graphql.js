import eslintPluginGraphql from '@graphql-eslint/eslint-plugin';

import { blockName } from '../lib/block-name.js';
import { DEFAULT_FILES, GQL_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  name: blockName('graphql/setup'),
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
    name: blockName('graphql/processor'),
    files: [...DEFAULT_FILES],
    processor: eslintPluginGraphql.processor,
  },
  baseConfig,
  {
    name: blockName('graphql/operations'),
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
    name: blockName('graphql/schema'),
    files: [...GQL_FILES],
    rules: {
      ...eslintPluginGraphql.configs['flat/schema-recommended'].rules,
    },
  },
];
