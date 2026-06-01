# @benhigham/eslint-config

## 4.2.2

### Patch Changes

- [#99](https://github.com/benhigham/javascript/pull/99) [`92842af`](https://github.com/benhigham/javascript/commit/92842af8e7e80cbcb9ac56f827a67fa14338fcb7) - Relax three vitest rules that proved destructive or high-ceremony on a real app test suite (surfaced while adopting the config in a static Next app).
  - **`prefer-called-with` (off):** its autofix rewrites `toHaveBeenCalled()` to `toHaveBeenCalledWith()` — "called with _zero_ arguments" — silently breaking every assertion on a mock that was called with arguments, and it forbids the legitimate "was it called at all" assertion on spies where the arguments aren't the point.
  - **`require-mock-type-parameters` (off):** forces a type argument on every `vi.fn()`, including mocks immediately cast to a target type (where the parameter is erased), and isn't reliably auto-fixable in practice.
  - **`prefer-expect-assertions` (off):** mandates `expect.assertions(n)` bookkeeping on async/callback/loop tests — a maintenance burden that rarely catches a real bug.

  These only relax the curated allowlist (all three are off in `@vitest/eslint-plugin`'s `recommended`); Node-library consumers wanting the stricter set can re-enable them locally.

## 4.2.1

### Patch Changes

- [#97](https://github.com/benhigham/javascript/pull/97) [`2da5f6b`](https://github.com/benhigham/javascript/commit/2da5f6b258bee8b49d491e0dc60140118c54a46b) - Fix a second contradictory vitest matcher pair (same class as the boolean matchers in the previous release). `prefer-called-once` (wants `toHaveBeenCalledOnce()`) and `prefer-called-times` (wants `toHaveBeenCalledTimes(1)`) are direct inverses on a single call, so enabling both left every "called once" assertion flagged by one rule or the other and made the autofix oscillate. Keep `prefer-called-times` (the explicit count form, consistent with preferring strict `toBe(true)` over `toBeTruthy()`) and turn `prefer-called-once` off; it only ever fired on the one-call case.

## 4.2.0

### Minor Changes

- [#95](https://github.com/benhigham/javascript/pull/95) [`8e00a5d`](https://github.com/benhigham/javascript/commit/8e00a5d9777dc6c4d52657b5b4a1fefdc4263545) - Fix app/browser adoption gaps surfaced consuming `/next` in a static Next app (follow-ups to ADR-0002).
  - **vitest:** `prefer-strict-boolean-matchers` and `prefer-to-be-truthy`/`prefer-to-be-falsy` were all enabled, but they are direct inverses — every boolean assertion was flagged by one rule or the other and the autofix oscillated with no satisfiable form. Keep the strict matcher (`toBe(true)`/`toBe(false)`) and turn the loose `toBeTruthy`/`toBeFalsy` pair off.
  - **browser/`next`:** `n/no-unsupported-features/node-builtins` is now neutralized on browser source alongside the `n/prefer-global/*` family — it flagged browser globals that Node has only added experimentally (`localStorage`, `Storage`, `navigator`) as unsupported Node features. Node-environment files (config files, build scripts) keep the rule.
  - **typescript:** config files are no longer force-listed under `projectService.allowDefaultProject`. A consumer whose tsconfig already includes them (e.g. `include: ["**/*.ts"]`, the pattern the app tsconfigs produce) had each config file in both the project and the default-project allowlist, which typescript-eslint rejects as a parse error; the project service now resolves them through the consumer's tsconfig.
  - **import-x:** `no-extraneous-dependencies` no longer sets `includeInternal` (back to the rule's default) — with it on, `package.json#imports` subpath self-imports (`#foo/bar`) were flagged as the package's own missing dependency. `import-x/internal-regex` is also dropped: it reclassified matching workspace packages (`@repo/*`) as internal, which the extraneous check then ignored, so an undeclared workspace import would slip through; left to resolve as external they stay dependency-checked, while `#` self-imports resolve internally and remain in the order rule's "internal" group. The devDependency allowlist now also covers build scripts (`scripts/**`) and runner setup files (`*.setup.*`, e.g. `vitest.setup.ts`) in addition to config, test, and test-support files.

## 4.1.0

### Minor Changes

- [#93](https://github.com/benhigham/javascript/pull/93) [`cfcc0c6`](https://github.com/benhigham/javascript/commit/cfcc0c64ea74c41a88c9dc1d04bd4c0520deebc9) - Distinguish app/browser consumers from Node libraries (see ADR-0002).
  - **JSDoc:** the base now composes the `contents` + `logical` + `stylistic` category presets (JS-flavor/TS split preserved) — it validates JSDoc quality without mandating that JSDoc exist. The "tags must exist" `requirements` set (`require-jsdoc`, `require-param`, `require-returns`, …) moves to a new opt-in export, `@benhigham/eslint-config/plugins/jsdoc-required`. **Library consumers** who relied on the base requiring JSDoc must now add this export to keep that enforcement. The per-flavor type-system tunings of the old `recommended-*` bundles are preserved: JS-flavor keeps `jsdoc/no-types` off and both flavors keep `jsdoc/no-undefined-types` off, so JSDoc-typed JS code and references to global/imported types are unaffected.
  - **browser/`next`:** the Node-environment `n/prefer-global/*` family is neutralized on browser source — notably `n/prefer-global/process`, which broke Next's build-time `process.env` replacement and shipped a non-existent `node:process` browser import. `compat` is scoped away from Node-environment files (config files, build scripts). The Node-library default (`.`, `./typescript`) is unchanged.
  - **vitest:** the config now builds up from `recommended` plus a curated high-value allowlist instead of `configs.all`; `no-hooks`, `require-test-timeout`, and `max-expects` are not enabled, and `prefer-expect-assertions` is scoped to async/callback/loop tests. This yields fewer, more meaningful errors and stops the rule set drifting on plugin minor bumps.
  - **import-x:** `no-extraneous-dependencies` now permits devDependencies in test-support directories (`test/`, `tests/`, `__mocks__/`, `__fixtures__/`, `test-utils/`) in addition to config and test files.

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
