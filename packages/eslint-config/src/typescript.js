import eslintConfigPrettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

import baseConfig, { rules } from './base.js';
import { CONFIG_FILES, JS_FILES } from './constants.js';
import { tsConfig as importConfig } from './plugins/import.js';

/** @import { Linter } from 'eslint' */

/**
 * Rules from `@typescript-eslint/eslint-plugin` that require type information,
 * derived at module-load time so the list stays in sync on plugin upgrades.
 * @type {Linter.RulesRecord}
 */
const jsDisableTypeRules = Object.fromEntries(
  Object.entries(tseslint.plugin.rules)
    .filter(([, rule]) => rule?.meta?.docs?.requiresTypeChecking)
    .map(([name]) => [`@typescript-eslint/${name}`, 'off']),
);

/** @type {Linter.RulesRecord} */
const tsRules = {
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-expect-error': 'allow-with-description',
      minimumDescriptionLength: 4,
    },
  ],
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'allow-as-parameter',
    },
  ],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
  '@typescript-eslint/no-floating-promises': [
    'error',
    {
      checkThenables: true,
      ignoreVoid: true,
      ignoreIIFE: true,
    },
  ],
  '@typescript-eslint/no-loop-func': 'error',
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksConditionals: true,
      checksVoidReturn: false,
    },
  ],
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        'domain',
        'freelist',
        'smalloc',
        'punycode',
        'sys',
        'querystring',
        'colors',
        { name: 'mkdirp', message: 'Use `fs.mkdir` with `{recursive: true}` instead.' },
        { name: 'rimraf', message: 'Use `fs.rm` with `{recursive: true}` instead.' },
        { name: 'object-assign', message: 'Use `Object.assign()` or object spread instead.' },
        { name: 'left-pad', message: 'Use `String.prototype.padStart()` instead.' },
        { name: 'isarray', message: 'Use `Array.isArray()` instead.' },
        { name: 'globalthis', message: 'Use the `globalThis` global instead.' },
        { name: 'abort-controller', message: 'Use the native `AbortController` instead.' },
        { name: 'queue-microtask', message: 'Use `queueMicrotask()` instead.' },
        { name: 'has', message: 'Use `Object.hasOwn()` instead.' },
        { name: 'hasown', message: 'Use `Object.hasOwn()` instead.' },
        { name: 'is-nan', message: 'Use `Number.isNaN()` instead.' },
        { name: 'is-finite', message: 'Use `Number.isFinite()` instead.' },
        { name: 'aggregate-error', message: 'Use the native `AggregateError` instead.' },
        { name: 'array-flatten', message: 'Use `Array.prototype.flat()` instead.' },
        { name: 'concat-map', message: 'Use `Array.prototype.flatMap()` instead.' },
        { name: 'safe-buffer', message: 'Use `Buffer.alloc()` or `Buffer.from()` instead.' },
        { name: 'es6-promise', message: 'Use `Promise` instead.' },
        { name: 'whatwg-url', message: 'Use the native `URL` API instead.' },
      ],
    },
  ],
  '@typescript-eslint/no-shadow': ['error', { ignoreOnInitialization: true }],
  '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
  '@typescript-eslint/only-throw-error': [
    'error',
    {
      allowThrowingUnknown: true,
      allowThrowingAny: false,
    },
  ],
  '@typescript-eslint/prefer-nullish-coalescing': [
    'error',
    {
      ignoreTernaryTests: false,
      ignoreConditionalTests: false,
      ignoreMixedLogicalExpressions: false,
    },
  ],
  '@typescript-eslint/promise-function-async': 'error',
  '@typescript-eslint/restrict-plus-operands': ['error', { allowAny: false }],
  '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
  '@typescript-eslint/triple-slash-reference': [
    'error',
    { path: 'never', types: 'never', lib: 'never' },
  ],
};

/**
 * A shared ESLint configuration for libraries that use TypeScript.
 * @type {Linter.Config[]}
 */
const config = [
  ...baseConfig,
  importConfig,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [...CONFIG_FILES],
        },
      },
    },
    rules: { ...rules, ...tsRules },
  },
  {
    files: [...JS_FILES],
    rules: jsDisableTypeRules,
  },
  // Apply prettier last in this config to disable formatting rules from preceding presets.
  eslintConfigPrettier,
];

export default config;
