import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';

import * as browser from '../src/browser.js';
import * as base from '../src/index.js';
import * as next from '../src/next.js';
import * as graphql from '../src/plugins/graphql.js';
import * as jsdocRequired from '../src/plugins/jsdoc-required.js';
import * as playwright from '../src/plugins/playwright.js';
import * as tailwindcss from '../src/plugins/tailwindcss.js';
import * as turbo from '../src/plugins/turbo.js';
import * as react from '../src/react.js';
import * as typescript from '../src/typescript.js';

/** Absolute path to the package root (the parent of this `test/` directory). */
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Each export's module namespace, keyed by the subpath a consumer imports.
const MODULES = {
  '.': base,
  './browser': browser,
  './next': next,
  './react': react,
  './typescript': typescript,
  './plugins/graphql': graphql,
  './plugins/jsdoc-required': jsdocRequired,
  './plugins/playwright': playwright,
  './plugins/tailwindcss': tailwindcss,
  './plugins/turbo': turbo,
};

/**
 * Every export subpath these helpers can resolve — the keys of `MODULES`. The
 * smoke and invariant tests only cover what is listed here, so a guard test
 * pins this set against `package.json` `exports` to catch a newly-shipped
 * export that nobody added (which would otherwise ship with no coverage).
 */
export const TESTED_EXPORTS = Object.keys(MODULES);

/** Standalone exports: complete config arrays a consumer uses as their whole config. */
export const STANDALONE_EXPORTS = ['.', './browser', './next', './react', './typescript'];

/**
 * Optional plugin exports: opt-in configs a consumer spreads onto a base
 * config and scopes themselves. Some have no `files` (global, consumer-scoped)
 * and graphql has no default export (it ships `operationsConfig`/`schemaConfig`),
 * so they are smoke-tested as opt-in configs rather than resolved standalone.
 */
export const PLUGIN_EXPORTS = [
  './plugins/graphql',
  './plugins/jsdoc-required',
  './plugins/playwright',
  './plugins/tailwindcss',
  './plugins/turbo',
];

/**
 * Representative virtual file paths the configs are resolved against. None need
 * to exist on disk — `calculateConfigForFile` only matches the path against the
 * config globs. `configFile` and `script` hit the two distinct `NODE_FILES`
 * patterns (a `*.config.*` file and a path under `scripts/`); `test` and
 * `testJs` hit the `TEST_FILES` pattern (a TS and a JS test file — the pair that
 * pins the vitest `typecheck` setting to TS test files only). `typeTest` and
 * `typeTestInDir` both hit the `TYPE_TEST_FILES` pattern (a `*.test-d.ts` type-test
 * file — linted by the vitest layer only under the type-aware exports, never under
 * base `.`); `typeTestInDir` sits under `__tests__/`, the one place a `-d` file
 * also matches the runtime `TEST_FILES` dir glob, so it exercises the runtime
 * layer's `ignores` that keeps the overlap out of the base layer.
 */
export const FIXTURES = {
  js: 'src/a.js',
  ts: 'src/a.ts',
  tsx: 'src/a.tsx',
  configFile: 'a.config.ts',
  script: 'scripts/x.ts',
  test: 'src/a.test.ts',
  testJs: 'src/a.test.js',
  typeTest: 'src/a.test-d.ts',
  typeTestInDir: 'src/__tests__/a.test-d.ts',
};

/**
 * Resolve the effective config a standalone export computes for a file path —
 * the package's genuine interface. The path is virtual; this computes config
 * only (it does not lint), so the TypeScript `projectService` never runs.
 * @param {string} subpath A standalone export subpath (see `STANDALONE_EXPORTS`).
 * @param {string} relPath A file path relative to the package root.
 * @returns {Promise<import('eslint').Linter.Config>} The resolved config.
 */
export const resolveConfig = async (subpath, relPath) => {
  const config = MODULES[subpath].default;
  const overrideConfig = Array.isArray(config) ? config : [config];
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig, cwd: PKG_ROOT });

  return eslint.calculateConfigForFile(path.join(PKG_ROOT, relPath));
};

/**
 * A standalone export's ordered default config array — the composed source
 * (ingredients), not the per-file resolved config. Used by the structural
 * assertion that prettier is the single, last layer, which resolved config
 * cannot see (a duplicated or mid-chain prettier resolves identically).
 * @param {string} subpath A standalone export subpath (see `STANDALONE_EXPORTS`).
 * @returns {import('eslint').Linter.Config[]} The export's ordered config array.
 */
export const defaultConfigOf = (subpath) => MODULES[subpath].default;

/**
 * Every flat-config block an export exposes, gathered across its default and
 * named exports. Used to smoke-test optional plugin configs, which vary in shape (a
 * single object, an array, or named exports with no default).
 * @param {string} subpath An export subpath.
 * @returns {import('eslint').Linter.Config[]} Every flat-config object the export ships, across its default and named exports.
 */
export const configBlocksOf = (subpath) =>
  Object.values(MODULES[subpath])
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((block) => block !== null && typeof block === 'object');

const SEVERITY = ['off', 'warn', 'error'];

/**
 * The effective severity of a rule in a resolved config: `'off'`, `'warn'`,
 * `'error'`, or `'absent'` when no layer configured it.
 * @param {import('eslint').Linter.Config} config A resolved config.
 * @param {string} ruleId The rule to inspect.
 * @returns {string} The severity, or `'absent'`.
 */
export const severityOf = (config, ruleId) => {
  const entry = config.rules?.[ruleId];

  if (entry === undefined) {
    return 'absent';
  }

  return SEVERITY[entry[0]] ?? String(entry[0]);
};

/**
 * The first options object of a resolved rule entry (the element after the
 * severity), or `undefined` when the rule is absent or carries no options.
 * @param {import('eslint').Linter.Config} config A resolved config.
 * @param {string} ruleId The rule to inspect.
 * @returns {unknown} The rule's first options argument.
 */
export const optionsOf = (config, ruleId) => config.rules?.[ruleId]?.[1];
