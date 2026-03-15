import eslintPluginUnicorn from "eslint-plugin-unicorn";

import { DEFAULT_FILES } from "../constants.js";

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const config = {
  files: [...DEFAULT_FILES],
  plugins: {
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    ...eslintPluginUnicorn.configs.recommended.rules,
    "unicorn/no-null": "off", // null is required by DOM APIs, JSON, and many libraries.
    "unicorn/prevent-abbreviations": "off", // Overly aggressive; common abbreviations (e.g. props, params) are clear.
  },
};

export default config;
