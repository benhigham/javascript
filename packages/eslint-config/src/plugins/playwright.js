import eslintPluginPlaywright from 'eslint-plugin-playwright';

/** @import { Linter } from 'eslint' */

// No `files` property — consumers are expected to scope this to their test files.
/** @type {Linter.Config} */
const config = {
  plugins: {
    playwright: eslintPluginPlaywright,
  },
  rules: {
    ...eslintPluginPlaywright.configs['flat/recommended'].rules,
  },
};

export default config;
