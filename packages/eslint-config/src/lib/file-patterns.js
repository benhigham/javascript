export const JS_EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs'];
export const TS_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts'];
export const DEFAULT_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

export const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];
export const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
export const DEFAULT_FILES = ['**/*.?(c|m)[jt]s?(x)'];
export const GQL_FILES = ['**/*.{graphql,gql}'];
export const TEST_FILES = ['**/__tests__/**/*.?(c|m)[jt]s?(x)', '**/*.{test,spec}.?(c|m)[jt]s?(x)'];
// The TypeScript subset of TEST_FILES, listing the same extensions as TS_FILES
// so it stays a strict subset of it. The vitest `typecheck` setting (which makes
// type-aware vitest rules consult parser type services) must ride only where
// type information exists — i.e. TS test files in the type-aware layer, alongside
// `projectService`. Scoping the setting to these globs keeps it off JS test files
// and off non-type-aware exports, where those rules would otherwise throw a hard
// crash for want of type info.
export const TS_TEST_FILES = [
  '**/__tests__/**/*.{ts,tsx,mts,cts}',
  '**/*.{test,spec}.{ts,tsx,mts,cts}',
];
// vitest type-test files (`expectTypeOf`/`assertType`), named with vitest's `-d`
// suffix convention. TS-only (type tests are inherently TypeScript), listing the
// same extensions as TS_FILES. This file class is governed solely by the
// type-aware layer: the type-requiring vitest rules need `typecheck` +
// `projectService`, so the runtime vitest layer excludes these (via `ignores`)
// and `typescript.js` lints them through a dedicated block. Not a strict subset
// of TEST_FILES: the `*.{test,spec}.*` suffix never matches a `-d` name, but the
// `**/__tests__/**` dir glob does match a `-d` file placed under `__tests__/` —
// the runtime layer's `ignores` covers that overlap, so a type-test file is
// governed by the type-aware block wherever it sits.
export const TYPE_TEST_FILES = ['**/*.{test,spec}-d.{ts,tsx,mts,cts}'];
// Node-environment files within an otherwise browser/app project — config files
// and build scripts. In the browser/`next` layer these keep their Node rules
// (`n`) while browser source has them neutralized; `compat` is the inverse.
export const NODE_FILES = ['**/*.config.?(c|m)[jt]s?(x)', '**/scripts/**/*.?(c|m)[jt]s?(x)'];
// Test-support files (helpers, mocks, fixtures, setup) that import
// devDependencies but aren't named `*.{test,spec}.*` — broadens the import-x
// devDep allowlist without widening vitest rule scoping (which stays on
// `TEST_FILES`). The `*.setup.*` pattern covers root setup files wired into a
// runner's `setupFiles` (e.g. `vitest.setup.ts`, `jest.setup.ts`).
export const TEST_SUPPORT_FILES = [
  '**/test?(s)/**',
  '**/__mocks__/**',
  '**/__fixtures__/**',
  '**/test-utils/**',
  '**/*.setup.?(c|m)[jt]s?(x)',
];
