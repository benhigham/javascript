import eslintPluginVitest from "@vitest/eslint-plugin";

import { TEST_FILES } from "../constants.js";

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...TEST_FILES],
  plugins: {
    vitest: eslintPluginVitest,
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  languageOptions: {
    globals: {
      ...eslintPluginVitest.environments.env.globals,
    },
  },
  rules: {
    // Enable all rules, but prefer recommended severities where they differ.
    ...eslintPluginVitest.configs.all.rules,
    ...eslintPluginVitest.configs.recommended.rules,
  },
};

export default config;
