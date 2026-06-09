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
  'require-unicode-regexp': 'error', // `u` or `v`; `v` not forced (needs tsconfig target ES2024) — see ADR-0004

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

// Shared `no-unused-vars` tuning honoring the `_`-prefix "intentionally unused"
// convention. Applied to TS files via `@typescript-eslint/no-unused-vars` (in
// `tsRules`) and to JS files via core `no-unused-vars` (the JS-scoped block in
// `base.js`), so the convention holds in both. `ignoreRestSiblings` permits the
// destructure-to-omit pattern (`{ a: _a, ...rest }`); `reportUsedIgnorePattern`
// keeps it honest — a `_`-prefixed name that is actually used is flagged.
export const unusedVarsOptions = {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
  ignoreRestSiblings: true,
  reportUsedIgnorePattern: true,
};

/**
 * Non-type-aware `@typescript-eslint/*` tunings. Applied to TS files only; the
 * type-aware tunings are `tsCheckedRules` below.
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
  '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
  '@typescript-eslint/triple-slash-reference': [
    'error',
    { path: 'never', types: 'never', lib: 'never' },
  ],
};

/**
 * Type-aware `@typescript-eslint/*` tunings (require `projectService`). Applied
 * as a TS-scoped layer within `typescript.js`'s `typescriptLayers`, beside the
 * `projectService` parser option that makes them resolve. Disjoint from the
 * non-type-aware `tsRules` the composer re-applies in the curated tail, so the
 * two compose to the full type-aware set without either needing a merged variant.
 * @type {Linter.RulesRecord}
 */
export const tsCheckedRules = {
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  '@typescript-eslint/no-floating-promises': [
    'error',
    {
      checkThenables: true,
      ignoreVoid: true,
      ignoreIIFE: true,
    },
  ],
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksConditionals: true,
      checksVoidReturn: false,
    },
  ],
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
      // Switching `||` to `??` in a mixed `&&`/`||` expression changes semantics;
      // the value-or-null cases still fire.
      ignoreMixedLogicalExpressions: true,
    },
  ],
  '@typescript-eslint/promise-function-async': 'error',
  '@typescript-eslint/restrict-plus-operands': ['error', { allowAny: false }],
  '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
};
