import config from './src/index.js';

/**
 * Dogfood the package's own base config. The shipped vitest layer sets
 * `typecheck: true` for consumers whose tests are type-aware (`./typescript` +
 * projectService); this package's tests are plain `.js` linted by the base (no
 * projectService), so disable it for them — the type-aware vitest rules (e.g.
 * `vitest/valid-title`) would otherwise throw for want of type information.
 * @type {import('eslint').Linter.Config[]}
 */
const eslintConfig = [
  ...config,
  {
    files: ['test/**/*.js'],
    settings: {
      vitest: {
        typecheck: false,
      },
    },
  },
];

export default eslintConfig;
