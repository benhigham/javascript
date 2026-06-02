import js from '@eslint/js';
import tseslint from 'typescript-eslint';

import { JS_FILES, TS_FILES } from './lib/file-patterns.js';
import dependConfig from './plugins/depend.js';
import eslintCommentsConfig from './plugins/eslint-comments.js';
import { jsConfig as jsdocJsConfig, tsConfig as jsdocTsConfig } from './plugins/jsdoc.js';
import nConfig from './plugins/n.js';
import noSecretsConfig from './plugins/no-secrets.js';
import noUnsanitizedConfig from './plugins/no-unsanitized.js';
import noUseExtendNativeConfig from './plugins/no-use-extend-native.js';
import promiseConfig from './plugins/promise.js';
import sonarjsConfig from './plugins/sonarjs.js';
import unicornConfig from './plugins/unicorn.js';
import vitestConfig from './plugins/vitest.js';

/** @import { Linter } from 'eslint' */

/**
 * Curated language-agnostic ESLint rules. Apply to both JS and TS files.
 * @type {Linter.RulesRecord}
 */
export const rules = {
  'capitalized-comments': 'off',

  // Bug prevention
  'accessor-pairs': ['error', { enforceForClassMembers: true }],
  'array-callback-return': ['error', { allowImplicit: true }],
  'block-scoped-var': 'error',
  curly: 'error',
  'default-case-last': 'error',
  eqeqeq: 'error',
  'guard-for-in': 'error',
  'no-alert': 'error',
  'no-caller': 'error',
  'no-constructor-return': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-label': 'error',
  'no-implicit-globals': 'error',
  'no-implied-eval': 'error',
  'no-iterator': 'error',
  'no-labels': 'error',
  'no-lone-blocks': 'error',
  'no-multi-str': 'error',
  'no-new': 'error',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-octal-escape': 'error',
  'no-promise-executor-return': 'error',
  'no-proto': 'error',
  'no-return-assign': ['error', 'always'],
  'no-script-url': 'error',
  'no-self-assign': ['error', { props: true }],
  'no-self-compare': 'error',
  'no-template-curly-in-string': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unreachable-loop': 'error',
  'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
  'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
  'no-useless-call': 'error',
  'no-useless-concat': 'error',
  'no-useless-return': 'error',
  radix: 'error',
  'require-unicode-regexp': 'error', // `u` or `v`; the browser layer narrows to `u`

  // Modern style / consistency
  'arrow-body-style': 'error',
  'no-else-return': ['error', { allowElseIf: false }],
  'no-lonely-if': 'error',
  'no-unneeded-ternary': 'error',
  'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
  'no-useless-rename': 'error',
  'no-var': 'error',
  'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],
  'one-var': ['error', 'never'],
  'operator-assignment': ['error', 'always'],
  'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
  'prefer-const': ['error', { destructuring: 'all' }],
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: { array: false, object: true },
      AssignmentExpression: { array: false, object: false },
    },
    { enforceForRenamedProperties: false },
  ],
  'prefer-exponentiation-operator': 'error',
  'prefer-numeric-literals': 'error',
  'prefer-object-has-own': 'error',
  'prefer-object-spread': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
};

/**
 * Non-type-aware `@typescript-eslint/*` tunings. Applied to TS files only; the
 * type-aware tunings live in `./typescript.js`.
 * @type {Linter.RulesRecord}
 */
export const tsRules = {
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
  '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
  '@typescript-eslint/no-loop-func': 'error',
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
  '@typescript-eslint/triple-slash-reference': [
    'error',
    { path: 'never', types: 'never', lib: 'never' },
  ],
};

/** @type {Linter.Config[]} */
const config = [
  {
    ignores: [
      'build',
      'coverage',
      'dist',
      'dist-ssr',
      'logs',
      'public',
      '.cache',
      'pnpm-lock.yaml',
    ],
  },
  {
    files: [...JS_FILES],
    ...js.configs.recommended,
  },
  // typescript-eslint's non-type-aware presets supply the TS parser and a
  // curated rule set for `.ts`/`.tsx` files without requiring `projectService`
  // or a consumer-provided tsconfig. Type-aware additions layer in via the
  // `/typescript` export using the `*TypeCheckedOnly` variants.
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  dependConfig,
  eslintCommentsConfig,
  jsdocJsConfig,
  jsdocTsConfig,
  nConfig,
  noSecretsConfig,
  noUnsanitizedConfig,
  noUseExtendNativeConfig,
  promiseConfig,
  sonarjsConfig,
  unicornConfig,
  vitestConfig,
  {
    files: [...TS_FILES],
    rules: tsRules,
  },
];

export default config;
