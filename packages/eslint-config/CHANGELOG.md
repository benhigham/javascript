# @benhigham/eslint-config

## 4.0.0

### Major Changes

- [#57](https://github.com/benhigham/javascript/pull/57) [`b1d93e9`](https://github.com/benhigham/javascript/commit/b1d93e97f98fcba4f05c59db44092eb8171f5963) Thanks [@benhigham](https://github.com/benhigham)! - Drop the XO foundation; rebuild on `@eslint/js`, `typescript-eslint`, and `@eslint-react/eslint-plugin`.

  **Breaking changes for consumers:**
  - The default export (`@benhigham/eslint-config`) now lints both `.js` and `.ts`/`.tsx` files without requiring a `tsconfig` or `projectService`. Consumers who previously reached for `@benhigham/eslint-config/typescript` purely to enable TS support can use the default export.
  - Type-aware rules still live in `@benhigham/eslint-config/typescript`, but the underlying rule set is now `typescript-eslint`'s `recommendedTypeChecked` + `stylisticTypeChecked` rather than `eslint-config-xo-typescript`. Some XO-specific rules no longer fire.
  - `@benhigham/eslint-config/react` now uses `@eslint-react/eslint-plugin` instead of `eslint-config-xo-react` (and the conventional `eslint-plugin-react` / `eslint-plugin-react-hooks` pair). Consumers overriding `react/*` or `react-hooks/*` rule names need to remap to `@eslint-react/*` equivalents.
  - The package no longer provides a JSON parser. The `depend/ban-dependencies` rule no longer scans `package.json`, and `no-secrets/no-secrets` no longer scans JSON files. Consumers wanting JSON-aware linting should add `@eslint/json` themselves.
  - Some opinions inherited from XO are no longer enforced. Add them back inline in your own config if you want them.

  **Non-breaking:**
  - `@benhigham/eslint-config/browser` and `@benhigham/eslint-config/next` keep their composition; behavior shifts only through their inherited layers.
  - All `plugins/*` sub-exports are unchanged.

### Minor Changes

- [#73](https://github.com/benhigham/javascript/pull/73) [`add6fb2`](https://github.com/benhigham/javascript/commit/add6fb2f42085088fad00cb4f78e181c21500954) Thanks [@benhigham](https://github.com/benhigham)! - `browser` config: prune three non-standard entries (`opera`, `defaultStatus`,
  `defaultstatus`) from `no-restricted-globals` and enrich remaining entries
  with explanatory messages.

- [#67](https://github.com/benhigham/javascript/pull/67) [`5629977`](https://github.com/benhigham/javascript/commit/5629977d4011492454c90cee291946da6f1cd74a) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to v64. The recommended preset gains four new rules
  (`consistent-template-literal-escape`, `no-useless-iterator-to-array`,
  `prefer-simple-condition-first`, `switch-case-break-position`); consumers may see
  new lint reports on previously-clean code.

### Patch Changes

- [#65](https://github.com/benhigham/javascript/pull/65) [`4a77d3d`](https://github.com/benhigham/javascript/commit/4a77d3d81e694b6b1e65ff422be44817d1f95a96) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-jsdoc` to v63. No rule changes; the upstream release drops Node 20 support, which is reflected in the tightened `engines.node` floor.

- [#81](https://github.com/benhigham/javascript/pull/81) [`6e4589b`](https://github.com/benhigham/javascript/commit/6e4589b37edef7736c0ec1dbcee324cd00d3d98b) Thanks [@benhigham](https://github.com/benhigham)! - Update `eslint-plugin-n` to v18. The bundled `flat/recommended` preset no longer enables `n/no-unpublished-bin`, so that rule is no longer enforced by default. The plugin is now ESM-only and raises its own minimum ESLint to `>=8.57.1` (already satisfied by this config's `eslint >=10` peer). No new rules are added to the recommended preset, so previously-clean code will not see new lint reports.

## 3.0.0

### Major Changes

- [#24](https://github.com/benhigham/javascript/pull/24) [`98dcc70`](https://github.com/benhigham/javascript/commit/98dcc700a46f6f89018ba1108dcdb630bbf89eae) Thanks [@benhigham](https://github.com/benhigham)! - Upgrade to ESLint 10. Minimum required ESLint version is now `>=10.0.0`.
  - Bump `eslint` devDependency from `^9.34.0` to `^10.0.0`
  - Bump `eslint-config-xo-typescript` from `^9.0.0` to `^10.0.0` (raises TypeScript peer requirement from `>=5.5.0` to `>=5.9.0`)
  - Update `peerDependencies.eslint` from `>=9.26.0` to `>=10.0.0`
  - Resolves existing `eslint-config-xo@0.50` peer dep conflict (requires `>=10`)

### Minor Changes

- [#3](https://github.com/benhigham/javascript/pull/3) [`784cc52`](https://github.com/benhigham/javascript/commit/784cc52e1eac7938540951d4f57c5370738ecf80) Thanks [@dependabot](https://github.com/apps/dependabot)! - Upgrade eslint-plugin-unicorn from v61 to v63

  New recommended rules from v62 and v63 are now included in the shared configuration. See the [v62](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v62.0.0) and [v63](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v63.0.0) release notes for details.

### Patch Changes

- [#22](https://github.com/benhigham/javascript/pull/22) [`f1bcee4`](https://github.com/benhigham/javascript/commit/f1bcee4a9a4fb3e6ea045329049ccacfa24c9ae7) Thanks [@renovate](https://github.com/apps/renovate)! - Bump `eslint-plugin-sonarjs` from v3 to v4. Resolves transitive minimatch ReDoS vulnerabilities (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74).
