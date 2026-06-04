---
'@benhigham/eslint-config': patch
---

Scope the vitest `typecheck` setting to type-aware test files, fixing a hard ESLint crash on non-type-aware test files (surfaced while adding the resolved-config test surface).

The vitest layer set `settings.vitest.typecheck: true` in the base config, so it applied under every export and on every test file. That setting makes the type-requiring vitest rules (e.g. `vitest/valid-title`) call `getParserServices()`, which **throws** (ESLint exit 2, aborting the whole run) on any file linted without type information — i.e. a JS test file anywhere, or a TS test file under the non-type-aware base (`.`) export, neither of which sets `parserOptions.projectService`.

The fix relocates `typecheck: true` out of the base vitest layer into the type-aware TypeScript layer, scoped to TS test files (new `TS_TEST_FILES` glob) and co-located with `projectService` — so the setting can only ever land where type information exists. Type-aware consumers (`./typescript`, `./browser`, `./react`, `./next`) keep the feature on their TS tests unchanged; JS test files and the base `.` export no longer crash.
