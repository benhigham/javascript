# eslint-config is tested through its resolved config

`@benhigham/eslint-config` is a deep module whose interface is the _resolved config per file_ (CONTEXT.md), and it shipped with no tests — every composition invariant was enforced by a comment. We test it by resolving each exported config against representative virtual file paths with ESLint's `calculateConfigForFile` and asserting **targeted facts** (severity + the options we set) about the effective rule entries — the same surface a consumer experiences, so a test fails for the same reason a consumer would.

## Considered Options

- **Lint fixtures and assert reported messages.** Rejected: asserts composition invariants by proxy, couples tests to upstream message wording (the churn this repo already designs against), and needs a real tsconfig + `projectService` for type-aware rules — the exact cost the resolved-config seam avoids. Its only unique coverage ("does the rule body run") is upstream's job; and config resolution already throws on a missing plugin or unknown/stale rule name, so the valuable smoke coverage is free.
- **Unit-test the exported `rules`/`tsRules` objects.** Rejected: tests the ingredients, not the composition (`scopeToTs`, the last-wins tail, per-environment scoping) — i.e. not the interface.
- **Snapshot the resolved config.** Rejected: `calculateConfigForFile` returns entries with ESLint's defaults merged in, so a snapshot drifts on every plugin/typescript-eslint minor bump and encodes no intent.

## Consequences

- vitest is adopted as the runner (a tooling dependency via the catalog, no release), finally exercising the vitest ESLint layer this repo ships but never ran.
- Tests pin the load-bearing composition invariants and keep churn-prone react/next/optional-plugin rule sets at resolution-smoke level.
- This is the enabling move for the other architecture-review refactors (tsconfig matrix, layer-assembly consolidation, plugin-wrapper collapse), which become behaviour-preserving once the interface is asserted.
