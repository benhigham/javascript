import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintConfigXoReact from "eslint-config-xo-react";
import globals from "globals";

import { baseConfig as browserConfig } from "./browser.js";
import jsxA11yConfig from "./plugins/jsx-a11y.js";
import { reactConfig as testingLibraryConfig } from "./plugins/testing-library.js";
import typescriptConfig from "./typescript.js";

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration for libraries that use React.
 * @type {Linter.Config[]}
 */
const config = [
  ...typescriptConfig,
  ...browserConfig,
  jsxA11yConfig,
  testingLibraryConfig,
  ...eslintConfigXoReact,
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  // Apply prettier last in this config to disable formatting rules from preceding presets.
  eslintConfigPrettier,
];

export default config;
