import eslintPluginTurbo from "eslint-plugin-turbo";

/** @import { Linter } from 'eslint' */

// No `files` property — consumers are expected to scope this to their project.
/** @type {Linter.Config} */
const config = {
  plugins: {
    turbo: eslintPluginTurbo,
  },
  settings: {
    ...eslintPluginTurbo.configs["flat/recommended"].settings,
  },
  rules: {
    "turbo/no-undeclared-env-vars": "error",
  },
};

export default config;
