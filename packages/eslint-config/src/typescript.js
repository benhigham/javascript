import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintConfigXoTypeScript from "eslint-config-xo-typescript";

import baseConfig, { rules } from "./base.js";
import { CONFIG_FILES, JS_FILES } from "./constants.js";
import { tsConfig as importConfig } from "./plugins/import.js";
import { tsConfig as jsdocConfig } from "./plugins/jsdoc.js";

/** @import { Linter } from 'eslint' */

/** @type {Linter.RulesRecord} */
const jsDisableTypeRules = {
  "@typescript-eslint/consistent-type-exports": "off",
  "@typescript-eslint/no-duplicate-type-constituents": "off",
  "@typescript-eslint/no-mixed-enums": "off",
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/no-unnecessary-type-arguments": "off",
  "@typescript-eslint/no-unnecessary-type-assertion": "off",
  "@typescript-eslint/no-unnecessary-type-parameters": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-enum-comparison": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-type-assertion": "off",
  "@typescript-eslint/no-unsafe-unary-minus": "off",
  "@typescript-eslint/non-nullable-type-assertion-style": "off",
  "@typescript-eslint/prefer-readonly": "off",
  "@typescript-eslint/prefer-readonly-parameter-types": "off",
  "@typescript-eslint/prefer-reduce-type-parameter": "off",
  "@typescript-eslint/related-getter-setter-pairs": "off",
  "@typescript-eslint/switch-exhaustiveness-check": "off",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
};

/**
 * A shared ESLint configuration for libraries that use TypeScript.
 * @type {Linter.Config[]}
 */
const config = [
  ...baseConfig,
  importConfig,
  jsdocConfig,
  ...eslintConfigXoTypeScript,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [...CONFIG_FILES],
        },
      },
    },
    rules,
  },
  {
    files: [...JS_FILES],
    rules: jsDisableTypeRules,
  },
  // Apply prettier last in this config to disable formatting rules from preceding presets.
  eslintConfigPrettier,
];

export default config;
