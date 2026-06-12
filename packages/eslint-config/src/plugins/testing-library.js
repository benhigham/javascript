import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';

import { TEST_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const baseConfig = {
  files: [...TEST_FILES],
  plugins: {
    'testing-library': eslintPluginTestingLibrary,
  },
};

/** @type {Linter.Config} */
export const domConfig = {
  ...baseConfig,
  name: '@benhigham/eslint-config/testing-library/dom',
  rules: {
    ...eslintPluginTestingLibrary.configs['flat/dom'].rules,
  },
};

/** @type {Linter.Config} */
export const reactConfig = {
  ...baseConfig,
  name: '@benhigham/eslint-config/testing-library/react',
  rules: {
    ...eslintPluginTestingLibrary.configs['flat/react'].rules,
  },
};
