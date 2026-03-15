import eslintPluginPromise from "eslint-plugin-promise";

import { DEFAULT_FILES } from "../constants.js";

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    promise: eslintPluginPromise,
  },
  rules: {
    ...eslintPluginPromise.configs["flat/recommended"].rules,
    "promise/no-return-wrap": ["error", { allowReject: true }],
    "promise/no-return-in-finally": "error", // Elevated from recommended 'warn' to 'error'.
    "promise/valid-params": "error", // Elevated from recommended 'warn' to 'error'.
    "promise/prefer-await-to-then": "error",
  },
};

export default config;
