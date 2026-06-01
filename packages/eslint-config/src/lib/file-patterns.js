export const JS_EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs'];
export const TS_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts'];
export const DEFAULT_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

export const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];
export const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
export const DEFAULT_FILES = ['**/*.?(c|m)[jt]s?(x)'];
export const GQL_FILES = ['**/*.{graphql,gql}'];
export const TEST_FILES = ['**/__tests__/**/*.?(c|m)[jt]s?(x)', '**/*.{test,spec}.?(c|m)[jt]s?(x)'];
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
