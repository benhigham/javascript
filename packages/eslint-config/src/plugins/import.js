import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import eslintPluginImportX, {
  createNodeResolver,
} from "eslint-plugin-import-x";

import {
  CONFIG_FILES,
  DEFAULT_EXTENSIONS,
  DEFAULT_FILES,
  JS_EXTENSIONS,
  JS_FILES,
  TEST_FILES,
} from "../constants.js";

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
export const jsConfig = {
  files: [...JS_FILES],
  plugins: {
    "import-x": eslintPluginImportX,
  },
  settings: {
    "import-x/core-modules": ["electron"],
    "import-x/internal-regex": "^@repo/",
    "import-x/resolver-next": [
      createNodeResolver({
        extensions: [...JS_EXTENSIONS],
      }),
    ],
  },
  rules: {
    "import-x/default": "error",
    "import-x/export": "error",
    "import-x/extensions": [
      "error",
      "always",
      {
        ignorePackages: true,
      },
    ],
    "import-x/first": "error",
    "import-x/named": "error",
    "import-x/namespace": [
      "error",
      {
        allowComputed: true,
      },
    ],
    "import-x/no-absolute-path": "error",
    "import-x/no-anonymous-default-export": "error",
    "import-x/no-commonjs": "off", // Redundant with `unicorn/prefer-module`.
    "import-x/no-deprecated": "error",
    "import-x/no-named-default": "error",
    "import-x/no-webpack-loader-syntax": "error",
    "import-x/no-self-import": "error",
    "import-x/no-cycle": [
      "error",
      {
        ignoreExternal: true,
      },
    ],
    "import-x/no-useless-path-segments": "error",
    "import-x/newline-after-import": [
      "error",
      {
        considerComments: true,
      },
    ],
    "import-x/no-amd": "error",
    "import-x/no-duplicates": [
      "error",
      {
        "prefer-inline": true,
      },
    ],
    "import-x/no-empty-named-blocks": "error",
    "import-x/no-extraneous-dependencies": [
      "error",
      {
        includeInternal: true,
        includeTypes: true,
        devDependencies: [...CONFIG_FILES, ...TEST_FILES],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
    "import-x/no-mutable-exports": "error",
    "import-x/no-named-as-default-member": "error",
    "import-x/no-named-as-default": "error",
    "import-x/no-unresolved": [
      "error",
      {
        commonjs: false,
      },
    ],
    "import-x/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "object",
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        warnOnUnassignedImports: true,
      },
    ],
    "import-x/no-unassigned-import": [
      "error",
      {
        allow: [
          "@babel/polyfill",
          "**/register",
          "**/register.*",
          "**/register/**",
          "**/register/**.*",
          "**/*.css",
          "**/*.scss",
          "**/*.sass",
          "**/*.less",
        ],
      },
    ],
  },
};

/** @type {Linter.Config} */
export const tsConfig = {
  ...jsConfig,
  files: [...DEFAULT_FILES],
  settings: {
    ...jsConfig.settings,
    "import-x/extensions": [...DEFAULT_EXTENSIONS],
    "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
    "import-x/resolver-next": [
      createNodeResolver({
        extensions: [...DEFAULT_EXTENSIONS],
      }),
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
      }),
    ],
  },
};
