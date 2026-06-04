# Type-test files are linted only in the type-aware layer

vitest type-test files (`*.{test,spec}-d.{ts,tsx,mts,cts}`, whose bodies hold `expectTypeOf`/`assertType` type-level assertions) never reached the shipped vitest layer: the runtime `TEST_FILES` globs match `*.{test,spec}.*` and `**/__tests__/**`, but not the `-d` suffix. We add a dedicated `TYPE_TEST_FILES` glob and lint these files **only** in the type-aware layer (`./typescript` and the exports that build on it), co-located with `projectService` and `settings.vitest.typecheck: true`. The base/non-type-aware vitest layer excludes type-test files outright (via `ignores`), so they are governed by exactly one block.

Type-aware-only is forced by how the plugin behaves, not preference. The vitest rules only treat `expectTypeOf`/`assertType` as assertions when `typecheck` is set — without it, `expect-expect` flags every bare-`expectTypeOf` file as having no assertions — and `typecheck` in turn makes rules like `valid-title` call `getParserServices()`, which is a hard crash without type information (the very crash #114 fixed by relocating `typecheck: true` to ride with `projectService`). A type-test file is meaningful only with type information, so the base export is the wrong home: linting it there would misfire or crash.

Within the type-aware block we apply the curated runtime vitest rule set minus a deny-list, established empirically rather than guessed. On idiomatic type-test files only two curated rules misfire: `require-hook` (flags a bare top-level `expectTypeOf` as setup that belongs in a hook) and `padding-around-expect-groups` (treats a type assertion as a runtime expect group). Both are turned off for type-test files. The two rules triage suspected — `consistent-test-filename` and `require-top-level-describe` — do **not** misfire: `consistent-test-filename` self-skips a `-d` file because the filename fails its `allTestPattern` gate, and `require-top-level-describe` fires only on a `test()` outside a `describe`, identically to runtime tests.

## Considered Options

- **Add the `-d` glob to the runtime `TEST_FILES`** (issue #113, option 1). Rejected: under the base `.` export there is no `typecheck` setting, so `expect-expect` flags every bare-`expectTypeOf` file as assertion-less and the structural rules misfire — and the file can't be type-checked there anyway.
- **A hand-picked allow-list of type-test rules** (issue #113, option 2). Rejected: a second curation that duplicates intent and silently goes stale on plugin bumps. Reusing the curated runtime set minus a small deny-list keeps one source of truth; a newly useful type-test rule flows in automatically, and only a newly-misfiring rule needs revisiting.
- **Accept the `__tests__/`-located overlap.** A type-test file under `__tests__/` already matches the runtime `TEST_FILES` dir glob and would keep leaking into the runtime layer (misfiring under base `.`). Rejected in favour of excluding `-d` from the runtime layer, which makes "type-aware only" literally true and yields a crisp invariant: under base `.`, a `-d` file carries no vitest rules.

## Consequences

- Ships as a **minor** in `@benhigham/eslint-config` and needs a changeset — it adds a new linted file class, which can surface new lint errors in a consumer's CI.
- Asserted through the resolved config (ADR-0003): under `./typescript` a `-d` fixture resolves the vitest rules with `typecheck: true` and the two deny-listed rules `off`; under base `.` it resolves no vitest rules.
- Builds on #114 (which relocated `typecheck: true` to ride with `projectService`); that fix must remain in place for the type-aware block to be crash-free by construction.
