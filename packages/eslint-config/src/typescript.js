import tseslint from 'typescript-eslint';

import base from './base.js';
import { composeConfig } from './lib/compose.js';
import { TS_FILES } from './lib/file-patterns.js';
import { tsCheckedRules } from './lib/tunings.js';
import { tsConfig as importConfig } from './plugins/import.js';
import {
  tsConfig as vitestTsConfig,
  tsTypeTestConfig as vitestTypeTestConfig,
} from './plugins/vitest.js';

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
 * The layers the TypeScript export adds on top of the base kernel: the import
 * layer (TS variant), the type-aware `typescript-eslint` presets (scoped to TS
 * files), the `projectService` parser option, the type-aware vitest blocks, and
 * the curated type-aware tunings (`tsCheckedRules`, scoped to TS files). An
 * additive delta — it does not include `base`; the exports that reuse it
 * (`./browser`, `./react`, `./next`) prepend `base` themselves. Including
 * these layers is what makes an export type-aware; no `composeConfig` variant is
 * involved.
 * @type {Linter.Config[]}
 */
export const typescriptLayers = [
  importConfig,
  // Layer only the type-aware additions on top of base. Scoped to TS files so
  // JS files keep their core-rule coverage and never see type-aware rules.
  ...scopeToTs(tseslint.configs.recommendedTypeCheckedOnly),
  ...scopeToTs(tseslint.configs.stylisticTypeCheckedOnly),
  {
    name: '@benhigham/eslint-config/typescript/project-service',
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
  // The type-test layer (`*.test-d.*`): a self-contained vitest block scoped to
  // type-test files. It only composes here, where `projectService` exists, so the
  // type-requiring rules have type info. The base vitest layer excludes these
  // files, so this is the sole place they are linted. See ADR-0005.
  vitestTypeTestConfig,
  // The curated type-aware tunings, scoped to TS files and co-located with the
  // `projectService` that resolves them. They sit after the `*TypeCheckedOnly`
  // presets so they win, and are disjoint from the non-type-aware `tsRules` the
  // composer re-applies in the tail — so the two compose to the full type-aware
  // set with no merged variant. See ADR-0007.
  {
    name: '@benhigham/eslint-config/tunings/ts-type-aware',
    files: [...TS_FILES],
    rules: tsCheckedRules,
  },
];

/**
 * A shared ESLint configuration for libraries that use TypeScript.
 * @type {Linter.Config[]}
 */
const config = composeConfig([...base, ...typescriptLayers]);

export default config;
