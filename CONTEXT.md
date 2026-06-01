# JavaScript Tooling Configs

Monorepo of shareable JavaScript/TypeScript tooling configurations published to npm under the `@benhigham` scope.

## Language

**Consumer-facing dependency**:
A runtime `dependency` of a published config package that ships to and affects consumers — e.g. the bundled ESLint/Stylelint plugins, or `@commitlint/config-conventional`. A bump to one changes consumer behaviour and warrants a release. Pinned directly in each package's `package.json`.
_Avoid_: bundled dependency (use only when contrasting against peer/dev)

**Tooling dependency**:
A dependency used only to develop, lint, or build this repo, routed through the pnpm `catalog:` (e.g. `eslint`, `typescript`, `prettier`, `stylelint`, `turbo`). A bump has no consumer impact and warrants no release.
_Avoid_: dev dependency (overloaded with the literal `devDependencies` field)

**Release coverage**:
The invariant that every change to a published package's consumer-facing surface has a corresponding changeset, so its version bump and changelog are complete and nothing needs retroactive reconciliation.
_Avoid_: changeset coverage
