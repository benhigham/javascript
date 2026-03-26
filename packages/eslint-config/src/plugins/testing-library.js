import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';

import { TEST_FILES } from '../constants.js';

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
  rules: {
    ...eslintPluginTestingLibrary.configs['flat/dom'].rules,
  },
};

/** @type {Linter.Config} */
export const reactConfig = {
  ...baseConfig,
  rules: {
    ...eslintPluginTestingLibrary.configs['flat/react'].rules,
  },
};
