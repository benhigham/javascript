import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import eslintPluginImportX, { createNodeResolver } from 'eslint-plugin-import-x';

import { blockName } from '../lib/block-name.js';
import {
  DEFAULT_EXTENSIONS,
  DEFAULT_FILES,
  JS_EXTENSIONS,
  JS_FILES,
  NODE_FILES,
  TEST_FILES,
  TEST_SUPPORT_FILES,
  TYPE_TEST_FILES,
} from '../lib/file-patterns.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
export const jsConfig = {
  name: blockName('import/js'),
  files: [...JS_FILES],
  plugins: {
    'import-x': eslintPluginImportX,
  },
  settings: {
    'import-x/core-modules': ['electron'],
    // No `import-x/internal-regex`: it would also mark matching workspace
    // packages (`@repo/*`) internal, and `no-extraneous-dependencies` skips
    // internal imports — so undeclared workspace deps would go unchecked. Left
    // external they stay checked. (Its only other effect is order grouping.)
    'import-x/resolver-next': [
      createNodeResolver({
        extensions: [...JS_EXTENSIONS],
      }),
    ],
  },
  rules: {
    'import-x/default': 'error',
    'import-x/export': 'error',
    'import-x/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],
    'import-x/first': 'error',
    'import-x/named': 'error',
    'import-x/namespace': [
      'error',
      {
        allowComputed: true,
      },
    ],
    'import-x/no-absolute-path': 'error',
    'import-x/no-anonymous-default-export': 'error',
    'import-x/no-commonjs': 'off', // Redundant with `unicorn/prefer-module`.
    'import-x/no-deprecated': 'error',
    'import-x/no-named-default': 'error',
    'import-x/no-webpack-loader-syntax': 'error',
    'import-x/no-self-import': 'error',
    'import-x/no-cycle': [
      'error',
      {
        ignoreExternal: true,
      },
    ],
    'import-x/no-useless-path-segments': 'error',
    'import-x/newline-after-import': [
      'error',
      {
        considerComments: true,
      },
    ],
    'import-x/no-amd': 'error',
    'import-x/no-duplicates': [
      'error',
      {
        'prefer-inline': true,
      },
    ],
    'import-x/no-empty-named-blocks': 'error',
    'import-x/no-extraneous-dependencies': [
      'error',
      {
        // Leave `includeInternal` at its default (false): turning it on also
        // checks imports that resolve inside the package, flagging
        // `package.json#imports` self-imports (`#foo/bar`) as the package's own
        // missing dependency.
        includeTypes: true,
        // Permit devDependencies in Node-environment files (config files, build
        // scripts), test/test-support files (helpers/mocks/fixtures/setup that
        // import vitest, @testing-library/*, etc. but aren't named
        // `*.{test,spec}.*`), and type-test files (`*.test-d.*`, which import
        // `expectTypeOf`/`assertType` from vitest). This is the import layer, so
        // it applies on every export — independent of the type-aware-only vitest
        // rule scoping; the allowlist is intentionally broader.
        devDependencies: [...NODE_FILES, ...TEST_FILES, ...TEST_SUPPORT_FILES, ...TYPE_TEST_FILES],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
    'import-x/no-mutable-exports': 'error',
    'import-x/no-named-as-default-member': 'error',
    'import-x/no-named-as-default': 'error',
    'import-x/no-unresolved': [
      'error',
      {
        commonjs: false,
      },
    ],
    'import-x/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
      },
    ],
    'import-x/no-unassigned-import': [
      'error',
      {
        allow: [
          '@babel/polyfill',
          '**/register',
          '**/register.*',
          '**/register/**',
          '**/register/**.*',
          '**/*.css',
          '**/*.scss',
          '**/*.sass',
          '**/*.less',
        ],
      },
    ],
  },
};

/** @type {Linter.Config} */
export const tsConfig = {
  ...jsConfig,
  name: blockName('import/ts'),
  files: [...DEFAULT_FILES],
  settings: {
    ...jsConfig.settings,
    'import-x/extensions': [...DEFAULT_EXTENSIONS],
    'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import-x/resolver-next': [
      createNodeResolver({
        extensions: [...DEFAULT_EXTENSIONS],
      }),
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
      }),
    ],
  },
};
