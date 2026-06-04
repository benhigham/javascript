---
'@benhigham/eslint-config': minor
---

Lint vitest type-test files (`*.test-d.ts`) in the type-aware layer.

The vitest layer's `TEST_FILES` globs match `*.{test,spec}.*` and `**/__tests__/**`, but not vitest's `-d` type-test convention — so `*.test-d.ts` files (the home of `expectTypeOf`/`assertType`) never reached the vitest layer, even though `settings.vitest.typecheck: true` exists precisely to make the vitest rules type-test-aware.

Type-test files are now linted, but **only under the type-aware exports** (`./typescript`, `./browser`, `./react`, `./next`): a new `TYPE_TEST_FILES` glob is governed by a dedicated block that registers the vitest plugin, applies the curated rule set, and rides with `projectService` + `typecheck: true`. This is by construction — the type-requiring vitest rules (e.g. `vitest/valid-title`) and `expect-expect`'s recognition of type assertions only work where `typecheck` and type information exist, so the base (`.`) export deliberately excludes these files (the runtime vitest layer now `ignores` them).

Two curated rules are turned off for type-test files because they misfire on idiomatic type tests: `vitest/require-hook` (flags a bare top-level `expectTypeOf`/`assertType` as setup that belongs in a hook) and `vitest/padding-around-expect-groups` (treats a type assertion as a runtime expect group). Everything else in the curated set applies.

This is a minor (not a patch): it adds a new file class to the linted set, so it can surface new lint errors in a consumer's CI. Builds on the `typecheck` relocation from the previous release. See ADR-0005.
