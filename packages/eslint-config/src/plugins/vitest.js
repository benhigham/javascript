import eslintPluginVitest from '@vitest/eslint-plugin';

import { TEST_FILES, TS_TEST_FILES, TYPE_TEST_FILES } from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/**
 * The curated vitest rule set. Shared between the runtime test layer (`config`,
 * scoped to TEST_FILES) and the type-test layer (`tsTypeTestConfig`, scoped to
 * TYPE_TEST_FILES), so both build on a single source of truth — the type-test
 * block only differs by a small deny-list, applied on top.
 * @type {Linter.RulesRecord}
 */
const rules = {
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
  // `toBeTruthy`/`toBeFalsy`. It is the direct inverse of
  // `prefer-to-be-truthy`/`prefer-to-be-falsy`, so those stay off — enabling
  // both leaves every boolean assertion flagged by one rule or the other.
  'vitest/prefer-strict-boolean-matchers': 'error',
  'vitest/prefer-to-be-truthy': 'off',
  'vitest/prefer-to-be-falsy': 'off',
  // Explicit count form (`toHaveBeenCalledTimes(1)`) over the
  // `toHaveBeenCalledOnce()` shorthand — the same lean toward the explicit
  // matcher as the strict boolean choice above. Direct inverse of
  // `prefer-called-once` on a single call, so that stays off; enabling both
  // leaves the assertion flagged by one rule or the other (neither touches
  // counts other than one).
  'vitest/prefer-called-times': 'error',
  'vitest/prefer-called-once': 'off',
  // `prefer-called-with` is off: its autofix rewrites `toHaveBeenCalled()` to
  // `toHaveBeenCalledWith()` (i.e. "called with *zero* args"), silently
  // breaking every assertion on a mock that was called with arguments. It
  // also forbids the legitimate "was it called at all" assertion on spies
  // where the arguments aren't the point.
  'vitest/prefer-called-with': 'off',
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

  // High-ceremony rules, off for app/browser consumers: they impose broad,
  // low-value churn on a typical app test suite for little safety. (Node
  // libraries can re-enable them locally.)
  // - `require-mock-type-parameters`: forces a type argument on every
  //   `vi.fn()`, including mocks immediately cast to a target type (where the
  //   parameter is erased); not reliably auto-fixable in practice.
  // - `prefer-expect-assertions`: mandates `expect.assertions(n)` bookkeeping
  //   on async/callback/loop tests — a maintenance burden that rarely catches
  //   a real bug here.
  'vitest/require-mock-type-parameters': 'off',
  'vitest/prefer-expect-assertions': 'off',

  // Not a vitest rule, but relaxed here because it fires in test files:
  // `unicorn/no-useless-undefined` is a destructive autofix that strips the
  // deliberate explicit `undefined` stubs/unset values that are normal in tests
  // (`toBe(undefined)`, `mockReturnValue(undefined)`). The `unicorn` plugin is
  // already registered for these files by `unicorn.js`.
  'unicorn/no-useless-undefined': 'off',
};

/**
 * The vitest plugin + environment globals shared by both full vitest blocks
 * (`config` and `tsTypeTestConfig`). They differ only in `files`/`ignores`,
 * `settings`, and `rules`; the plugin registration and globals are identical, so
 * they live here once. (The `tsConfig` overlay below is settings-only and rides
 * on a block that already registered these, so it does not spread this.)
 * @type {Linter.Config}
 */
const vitestEnv = {
  plugins: {
    vitest: eslintPluginVitest,
  },
  languageOptions: {
    globals: {
      ...eslintPluginVitest.environments.env.globals,
    },
  },
};

/**
 * The runtime vitest layer: the curated rules on runtime test files. Type-test
 * files (`*.test-d.*`) are excluded via `ignores` — they need `typecheck` +
 * `projectService`, so they are governed solely by the type-aware
 * `tsTypeTestConfig` block (composed in `typescript.js`), never the base layer.
 * @type {Linter.Config}
 */
const config = {
  ...vitestEnv,
  files: [...TEST_FILES],
  ignores: [...TYPE_TEST_FILES],
  rules,
};

/**
 * The type-aware half of the vitest layer: `typecheck: true` makes the
 * type-requiring vitest rules (e.g. `vitest/valid-title`) recognize
 * `expectTypeOf`/`assertType` and consult the parser's type services. Those
 * services only exist where `parserOptions.projectService` is set, so this is
 * composed in by `typescript.js` (which owns `projectService`) and scoped to TS
 * test files. Keeping it out of the default `config` above is deliberate: on a
 * non-type-aware export (`.`), or a JS test file anywhere, the setting would
 * make those rules throw a hard ESLint crash for want of type information.
 * @type {Linter.Config}
 */
export const tsConfig = {
  files: [...TS_TEST_FILES],
  settings: {
    vitest: {
      typecheck: true,
    },
  },
};

/**
 * The type-test layer: the whole vitest surface for `*.test-d.*` files. Because
 * the runtime `config` excludes these (via `ignores`), this block must register
 * the plugin and globals itself, then apply the curated `rules` plus
 * `typecheck: true`. It is composed only by `typescript.js`, after the
 * `projectService` block, so the type-requiring rules always have type info.
 *
 * Two curated rules are turned off here because they misfire on idiomatic type
 * tests (empirically, against the plugin's behavior): `require-hook` flags a
 * bare top-level `expectTypeOf`/`assertType` as setup that belongs in a hook,
 * and `padding-around-expect-groups` treats a type assertion as a runtime expect
 * group. The structural rules triage suspected — `consistent-test-filename`
 * (self-skips a `-d` name via its `allTestPattern`) and `require-top-level-describe`
 * (only fires on a `test()` outside `describe`, same as runtime) — do not, so
 * they stay on. See ADR-0005.
 * @type {Linter.Config}
 */
export const tsTypeTestConfig = {
  ...vitestEnv,
  files: [...TYPE_TEST_FILES],
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  rules: {
    ...rules,
    'vitest/require-hook': 'off',
    'vitest/padding-around-expect-groups': 'off',
  },
};

export default config;
