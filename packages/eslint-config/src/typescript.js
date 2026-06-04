import eslintConfigPrettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

import baseConfig, { rules, tsRules } from './base.js';
import { TS_FILES } from './lib/file-patterns.js';
import { tsConfig as importConfig } from './plugins/import.js';
import { tsConfig as vitestTsConfig } from './plugins/vitest.js';

/** @import { Linter } from 'eslint' */

/**
 * Scope a typescript-eslint preset's config blocks to TS files only. The
 * `*TypeCheckedOnly` presets ship a "global" block that disables corresponding
 * core ESLint rules everywhere; scoping prevents those disables from leaking
 * into JS files (which keep their core-rule coverage from `base.js`).
 * @param {Linter.Config[]} configs Config blocks to constrain.
 * @returns {Linter.Config[]} The same blocks with `files` restricted to TS extensions.
 */
const scopeToTs = (configs) => configs.map((block) => ({ ...block, files: [...TS_FILES] }));

/**
 * Type-aware `@typescript-eslint/*` tunings (require `projectService`).
 * Non-type-aware tunings live in `./base.js` as `tsRules`.
 * @type {Linter.RulesRecord}
 */
const tsCheckedRules = {
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

/**
 * A shared ESLint configuration for libraries that use TypeScript.
 * @type {Linter.Config[]}
 */
const config = [
  ...baseConfig,
  importConfig,
  // Layer only the type-aware additions on top of base. Scoped to TS files so
  // JS files keep their core-rule coverage and never see type-aware rules.
  ...scopeToTs(tseslint.configs.recommendedTypeCheckedOnly),
  ...scopeToTs(tseslint.configs.stylisticTypeCheckedOnly),
  {
    files: [...TS_FILES],
    languageOptions: {
      parserOptions: {
        // Resolve every TS file through the consumer's tsconfig project. We do
        // not list config files under `allowDefaultProject`: a consumer whose
        // tsconfig already includes them (e.g. `include: ["**/*.ts"]`, the
        // pattern the app tsconfigs produce) would have each config file in
        // both the project and the default-project allowlist, which
        // typescript-eslint rejects as a parse error. Config files that sit
        // outside the project should be added to the consumer's tsconfig.
        projectService: true,
      },
    },
  },
  // Enable the vitest `typecheck` setting here, co-located with `projectService`
  // and scoped to TS test files — the only place type information is guaranteed,
  // so the type-requiring vitest rules never crash for want of it. The base
  // vitest layer (in `base.js`) ships the rules; this adds the type-aware setting.
  vitestTsConfig,
  // Re-apply curated rules after intermediate configs so our tunings win.
  { rules },
  { files: [...TS_FILES], rules: { ...tsRules, ...tsCheckedRules } },
  // Apply prettier last to disable formatting rules from preceding presets.
  eslintConfigPrettier,
];

export default config;
