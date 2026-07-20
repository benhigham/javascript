# @benhigham/eslint-config

## 7.0.0

### Major Changes

- [#159](https://github.com/benhigham/javascript/pull/159) [`7a4d38a`](https://github.com/benhigham/javascript/commit/7a4d38a258454f47e3b83b84fa191d3b4a9daf24) - Update `eslint-plugin-unicorn` to v72. The `recommended` preset gains six new
  error-level rules, which may surface new errors in a consumer's CI. The ESLint
  (`>=10.4`) and Node.js (`>=22`) floors are unchanged.

  - `unicorn/no-multiple-promise-resolver-calls`
  - `unicorn/no-shorthand-property-overrides`
  - `unicorn/no-transition-all`
  - `unicorn/no-unnecessary-string-trim` (autofixable)
  - `unicorn/no-useless-re-export`
  - `unicorn/prefer-then-catch` — note that `.then(onFulfilled, onRejected)` and
    `.then(onFulfilled).catch(onRejected)` are not equivalent; the chained form
    also catches what `onFulfilled` throws. The rule reports a suggestion rather
    than an autofix, so review each one.

  A seventh, `unicorn/prefer-dom-node-html-methods`, was promoted into the preset
  upstream but is disabled here. Its read side is an autofix that matches the
  `innerHTML` property name alone — no type information — so any non-DOM object
  carrying an `innerHTML` key is rewritten to `.getHTML()` and throws at runtime.
  `Element#getHTML()` is also Chrome 125 / Firefox 128 / Safari 18, so the fix can
  land below a consumer's browser floor. Re-enable it locally if you want it.

  `unicorn/prefer-minimal-ternary` renamed its `checkVaryingCallee` option to
  `checkVaryingBase` — rename any override of the old key, which now fails schema
  validation.

## 6.0.1

### Patch Changes

- [#153](https://github.com/benhigham/javascript/pull/153) [`3dff6f6`](https://github.com/benhigham/javascript/commit/3dff6f61e6432bd2ac5c29fc9a62524aaf4b1792) - Relax `unicorn/no-top-level-assignment-in-function` and `unicorn/no-global-object-property-assignment` in test files. Both are recommended `error` since unicorn v71 and expose no options, yet they fire on idiomatic Vitest setup: module-scope capture assigned in a `beforeEach` / stubbed-class constructor / `vi.mock` factory, and stubbing a browser global (`window.scrollBy = spy`). A genuinely-wrong stub fails loudly when the suite runs, so the rules' silent-drift value — the reason they earn their keep in source — is low there. They stay on for source files; suites that want the guard can re-enable them locally.

## 6.0.0

### Major Changes

- [#149](https://github.com/benhigham/javascript/pull/149) [`fd7f95f`](https://github.com/benhigham/javascript/commit/fd7f95f8614fc2d5ace19765999dbb79c0147878) - Update `eslint-plugin-unicorn` to v71. The `recommended` preset gains 151 new
  rules (v66–v71), which may surface new errors in a consumer's CI.

  - **Requires ESLint >= 10.4** (raised from `>=10.0.0`) and Node.js >= 22.
  - `unicorn/prevent-abbreviations` was renamed to `unicorn/name-replacements`, and
    `unicorn/no-array-for-each` to `unicorn/no-for-each` — rename any override of the
    old keys. The old names linger as deprecated aliases, so a stale override silently
    stops working and the rule re-activates as errors.
  - `unicorn/no-hex-escape` was removed (use `unicorn/prefer-unicode-code-point-escapes`).

### Patch Changes

- [#147](https://github.com/benhigham/javascript/pull/147) [`d6e5116`](https://github.com/benhigham/javascript/commit/d6e511639570975a3d7cd66e33535f4e5e94eb00) - Relax `sonarjs/no-floating-point-equality` in test files. The rule flags any float-sensitive operand in an `expect().toBe()/toEqual()` (or a raw `===`), including a correct exact-literal fixture like `toBe(0.6)`, and it has no option to allow exact literals. In test code a genuinely-wrong float assertion fails loudly when the suite runs, so the rule's silent-drift value — the reason it earns its keep in source — is low there. It stays on for source files; suites that want the guard can re-enable it locally and reach for `toBeCloseTo`.

## 5.0.0

### Major Changes

- [#116](https://github.com/benhigham/javascript/pull/116) [`9421b13`](https://github.com/benhigham/javascript/commit/9421b1310b63ef45f62de19aefe6399932ae2cdb) - Drop the browser-layer floor workarounds now that the toolchain targets a modern browser floor (ADR-0004). The browser-only narrowing of `require-unicode-regexp` to the `u` flag is removed — at the modern floor both `u` and `v` run, so the base's flag-agnostic rule (require `u` or `v`) applies uniformly. `v` is intentionally not forced: it is gated on the consumer's tsconfig `target` (ES2024), which `@benhigham/tsconfig` does not set, so forcing it would require every consumer to set `target: ES2024`. `unicorn/no-array-sort` is re-enabled (its `.toSorted()` autofix is floor-safe and needs only `lib: ES2023`); this surfaces new errors in consumer code.

### Minor Changes

- [#117](https://github.com/benhigham/javascript/pull/117) [`e211dfe`](https://github.com/benhigham/javascript/commit/e211dfee369fddd9fdcd00837ac67422d62517ac) - Lint vitest type-test files (`*.test-d.ts`) in the type-aware layer.

  The vitest layer's `TEST_FILES` globs match `*.{test,spec}.*` and `**/__tests__/**`, but not vitest's `-d` type-test convention — so `*.test-d.ts` files (the home of `expectTypeOf`/`assertType`) never reached the vitest layer, even though `settings.vitest.typecheck: true` exists precisely to make the vitest rules type-test-aware.

  Type-test files are now linted, but **only under the type-aware exports** (`./typescript`, `./browser`, `./react`, `./next`): a new `TYPE_TEST_FILES` glob is governed by a dedicated block that registers the vitest plugin, applies the curated rule set, and rides with `projectService` + `typecheck: true`. This is by construction — the type-requiring vitest rules (e.g. `vitest/valid-title`) and `expect-expect`'s recognition of type assertions only work where `typecheck` and type information exist, so the base (`.`) export deliberately excludes these files (the runtime vitest layer now `ignores` them).

  Two curated rules are turned off for type-test files because they misfire on idiomatic type tests: `vitest/require-hook` (flags a bare top-level `expectTypeOf`/`assertType` as setup that belongs in a hook) and `vitest/padding-around-expect-groups` (treats a type assertion as a runtime expect group). Everything else in the curated set applies.

  This is a minor (not a patch): it adds a new file class to the linted set, so it can surface new lint errors in a consumer's CI. Builds on the `typecheck` relocation from the previous release. See ADR-0005.

- [#128](https://github.com/benhigham/javascript/pull/128) [`90a1890`](https://github.com/benhigham/javascript/commit/90a1890196af15d8a9fc7000fd29805bf6fc8622) - Update `eslint-plugin-unicorn` to v65. The recommended preset gains 28 new rules
  (`better-dom-traversing`, `consistent-compound-words`, `consistent-json-file-read`,
  `no-array-fill-with-reference-type`, `no-array-from-fill`, `no-blob-to-file`,
  `no-canvas-to-image`, `no-confusing-array-splice`, `no-duplicate-set-values`,
  `no-exports-in-scripts`, `no-incorrect-query-selector`, `no-late-current-target-access`,
  `no-this-outside-of-class`, `no-unnecessary-nested-ternary`, `no-unused-array-method-return`,
  `prefer-array-last-methods`, `prefer-get-or-insert-computed`, `prefer-https`,
  `prefer-includes-over-repeated-comparisons`, `prefer-iterator-to-array-at-end`,
  `prefer-math-abs`, `prefer-queue-microtask`, `prefer-split-limit`, `prefer-string-match-all`,
  `prefer-string-pad-start-end`, `prefer-string-repeat`, `require-css-escape`,
  `require-passive-events`); consumers may see new lint reports on previously-clean code.

  Migration notes for consumers with their own overrides:

  - `unicorn/prefer-dom-node-dataset` was renamed to `unicorn/dom-node-dataset` — rename any
    override, or ESLint errors on configuring a nonexistent rule.
  - `unicorn/better-regex` was removed — drop any override that enables it.

### Patch Changes

- [#114](https://github.com/benhigham/javascript/pull/114) [`d774ef1`](https://github.com/benhigham/javascript/commit/d774ef189ab30d77d53a69439cc3b02c075a0850) - Scope the vitest `typecheck` setting to type-aware test files, fixing a hard ESLint crash on non-type-aware test files (surfaced while adding the resolved-config test surface).

  The vitest layer set `settings.vitest.typecheck: true` in the base config, so it applied under every export and on every test file. That setting makes the type-requiring vitest rules (e.g. `vitest/valid-title`) call `getParserServices()`, which **throws** (ESLint exit 2, aborting the whole run) on any file linted without type information — i.e. a JS test file anywhere, or a TS test file under the non-type-aware base (`.`) export, neither of which sets `parserOptions.projectService`.

  The fix relocates `typecheck: true` out of the base vitest layer into the type-aware TypeScript layer, scoped to TS test files (new `TS_TEST_FILES` glob) and co-located with `projectService` — so the setting can only ever land where type information exists. Type-aware consumers (`./typescript`, `./browser`, `./react`, `./next`) keep the feature on their TS tests unchanged; JS test files and the base `.` export no longer crash.

## 4.3.0

### Minor Changes

- [#103](https://github.com/benhigham/javascript/pull/103) [`82cdf2a`](https://github.com/benhigham/javascript/commit/82cdf2a921c567442fce8429d55bf1451048be66) - Stop corrupting JSDoc, and honor the `_`-prefix "intentionally unused" convention across JS and TS (surfaced while adopting the config in a static Next app).
  - **`jsdoc/text-escaping` (off, both JS and TS):** the `contents` category preset enables it at error, but every `recommended-*` bundle ships it off. Its autofix escapes `<` → `&lt;` in JSDoc, but isn't markdown-aware (it mangles `<` inside backtick code spans) and escapes only `<`, not `>` — asymmetric corruption. It targets JSDoc rendered as raw HTML; TS/TSDoc and editor hover render markdown, where the escaping is pure damage. Restores the bundle default.
  - **`no-unused-vars` honors the `_`-prefix convention across JS and TS:** `argsIgnorePattern`/`varsIgnorePattern`/`caughtErrorsIgnorePattern`/`destructuredArrayIgnorePattern` are set to `^_`, and `ignoreRestSiblings` permits the destructure-to-omit pattern (`{ a: _a, ...rest }`). Applied to TS files via `@typescript-eslint/no-unused-vars` and to JS files via core `no-unused-vars`, so a `_`-prefixed name means "intentionally unused" everywhere. `reportUsedIgnorePattern: true` keeps the convention honest: a `_`-prefixed name that is actually used is now flagged (rename it) — that option can newly-fail previously-passing code, hence the minor bump.
  - **`sonarjs/no-unused-vars` (off):** it duplicated unused detection but ignored the `_` patterns and `ignoreRestSiblings` above (it flagged the destructure-to-omit `_a`), so unused detection now defers entirely to `no-unused-vars` — matching the existing `sonarjs/unused-import: off` precedent.

## 4.2.3

### Patch Changes

- [#101](https://github.com/benhigham/javascript/pull/101) [`e66cfd5`](https://github.com/benhigham/javascript/commit/e66cfd56d93c92080168e1d7955766350efdbaa6) - Relax rules that fought a consumer's browserslist floor or churned/broke app and test idioms (surfaced adopting the config in a static Next app).
  - **`require-unicode-regexp` (base: require `u` or `v`; browser: require `u`):** the base no longer forces the ES2024 `v` flag — it accepts either `u` or `v` and flags an unflagged regex (offering a suggestion to add `u`). The browser layer requires `u` and rejects `v`: `/…/v` is a `SyntaxError` below Chrome 112 / Safari 17, SWC doesn't downlevel it, and `compat` doesn't catch regex-flag syntax. Existing `/…/v` is then flagged, with an editor suggestion (not an `eslint --fix` autofix) to switch to `/…/u`.
  - **`unicorn/no-array-sort` (off, browser layer):** it errors on any use of `.sort()`'s return value and its only escape is `.toSorted()` (Chrome 110+) — it won't accept the floor-safe `[...arr].sort()` — steering browser code above the floor. Node libraries keep it (`.toSorted()` is supported on this config's Node floor, `engines.node` `>=22.13`).
  - **`unicorn/prefer-global-this` (off, browser layer):** it autofixes idiomatic `window`/`self` access to `globalThis` and rewrites the canonical `typeof window === 'undefined'` guard; `globalThis` is floor-safe, so this is an idiom/churn conflict, not a floor issue.
  - **`unicorn/no-useless-undefined` (off, test files):** a destructive autofix that strips deliberate explicit `undefined` stubs/unset values in tests (`toBe(undefined)`, `mockReturnValue(undefined)`).
  - **`@typescript-eslint/prefer-nullish-coalescing` (`ignoreMixedLogicalExpressions: true`):** stops flagging `||` in mixed `&&`/`||` expressions, where switching to `??` changes semantics; value-or-null cases still fire.

  The browser-layer relaxations don't affect the Node-library default (`.`, `./typescript`); the test-file and `prefer-nullish` changes apply everywhere.

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
