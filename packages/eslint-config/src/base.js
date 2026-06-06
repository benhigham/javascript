import js from '@eslint/js';
import tseslint from 'typescript-eslint';

import { JS_FILES } from './lib/file-patterns.js';
import { unusedVarsOptions } from './lib/tunings.js';
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
 * The base kernel layer: ignores, the JS recommended preset, the non-type-aware
 * `typescript-eslint` presets, the curated plugin configs, and the core
 * `no-unused-vars` tuning for JS files. Every export composes this through
 * `composeConfig`, which appends the curated tail (`rules`/`tsRules` + prettier);
 * the curated rule data itself lives in `lib/tunings.js`. See ADR-0007.
 * @type {Linter.Config[]}
 */
const baseKernel = [
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
  // `/typescript` export's `typescriptLayers` using the `*TypeCheckedOnly` variants.
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
  // Honor the `_`-prefix convention for core `no-unused-vars` on JS files (TS
  // files get it via `@typescript-eslint/no-unused-vars` in the curated tail).
  // Applied once here is enough: nothing re-touches core `no-unused-vars` for JS
  // files after the kernel.
  {
    files: [...JS_FILES],
    rules: {
      'no-unused-vars': ['error', unusedVarsOptions],
    },
  },
];

export default baseKernel;
