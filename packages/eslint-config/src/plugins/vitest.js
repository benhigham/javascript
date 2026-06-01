import eslintPluginVitest from '@vitest/eslint-plugin';

import { TEST_FILES } from '../lib/file-patterns.js';

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
    // Build up from `recommended` (the curated floor) rather than `configs.all`
    // — `all` is a kitchen-sink that self-contradicts (e.g. `no-hooks` vs
    // `require-hook`) and grows silently on every plugin minor bump.
    ...eslintPluginVitest.configs.recommended.rules,

    // Prefer the canonical/strict matcher over its looser equivalents.
    'vitest/prefer-to-be': 'error',
    'vitest/prefer-to-have-length': 'error',
    'vitest/prefer-to-contain': 'error',
    'vitest/prefer-comparison-matcher': 'error',
    'vitest/prefer-equality-matcher': 'error',
    'vitest/prefer-strict-equal': 'error',
    // Strict boolean matcher (`toBe(true)`/`toBe(false)`) over the loose
    // `toBeTruthy`/`toBeFalsy`. This is the direct inverse of
    // `prefer-to-be-truthy`/`prefer-to-be-falsy`, so those stay off — enabling
    // both leaves every boolean assertion flagged by one rule or the other and
    // makes the autofix oscillate (no satisfiable form).
    'vitest/prefer-strict-boolean-matchers': 'error',
    'vitest/prefer-to-be-truthy': 'off',
    'vitest/prefer-to-be-falsy': 'off',
    'vitest/prefer-called-once': 'error',
    'vitest/prefer-called-times': 'error',
    'vitest/prefer-called-with': 'error',
    'vitest/prefer-spy-on': 'error',
    'vitest/prefer-vi-mocked': 'error',
    'vitest/prefer-mock-promise-shorthand': 'error',
    'vitest/prefer-expect-resolves': 'error',

    // Consistency and aliasing.
    'vitest/no-alias-methods': 'error',
    'vitest/consistent-test-it': 'error',
    'vitest/consistent-vitest-vi': 'error',
    'vitest/no-test-prefixes': 'error',
    'vitest/require-to-throw-message': 'error',

    // Hook ordering.
    'vitest/prefer-hooks-on-top': 'error',
    'vitest/prefer-hooks-in-order': 'error',

    // Blank-line padding around test constructs (auto-fixable).
    'vitest/padding-around-after-all-blocks': 'error',
    'vitest/padding-around-after-each-blocks': 'error',
    'vitest/padding-around-before-all-blocks': 'error',
    'vitest/padding-around-before-each-blocks': 'error',
    'vitest/padding-around-describe-blocks': 'error',
    'vitest/padding-around-expect-groups': 'error',
    'vitest/padding-around-test-blocks': 'error',

    // Cheap guardrails that rarely fire but catch genuine mistakes.
    'vitest/max-nested-describe': 'error',
    'vitest/require-top-level-describe': 'error',
    'vitest/consistent-test-filename': 'error',
    'vitest/no-large-snapshots': 'error',
    'vitest/require-hook': 'error',
    'vitest/no-test-return-statement': 'error',

    // Auto-fixable, so cheap to enforce.
    'vitest/require-mock-type-parameters': 'error',

    // Scope to where missing assertions hide real bugs (async/callback/loop)
    // rather than mandating `expect.assertions()` in every test.
    'vitest/prefer-expect-assertions': [
      'error',
      {
        onlyFunctionsWithAsyncKeyword: true,
        onlyFunctionsWithExpectInCallback: true,
        onlyFunctionsWithExpectInLoop: true,
      },
    ],
  },
};

export default config;
