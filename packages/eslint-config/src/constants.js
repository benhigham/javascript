export const JS_EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs'];
export const TS_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts'];
export const DEFAULT_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

export const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];
export const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
export const DEFAULT_FILES = ['**/*.?(c|m)[jt]s?(x)'];
export const JSON_FILES = ['**/*.json?(c|5)'];
export const GQL_FILES = ['**/*.{graphql,gql}'];
export const CONFIG_FILES = ['*.config.?(c|m)[jt]s'];
export const TEST_FILES = [
  '**/__tests__/**/*.?(c|m)[jt]s?(x)',
  '**/*.{test,spec}.?(c|m)[jt]s?(x)',
];
