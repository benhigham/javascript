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

**Primitive config**:
A `@benhigham/tsconfig` variant defined by the two orthogonal axes — runtime environment (node vs browser/DOM) and emit mode (library vs app) — rather than by a target framework. The package ships only primitives (`node` (the `.` default), `browser`, `node-app`, `browser-app`); framework toolchains (Next, Astro, Vite) are served by composing a primitive with the framework's own config and docs, never a bespoke variant.
_Avoid_: framework config (the deliberately-rejected alternative — see ADR-0001)

**Library config**:
A primitive whose emit mode is _library_: `tsc` emits JavaScript + `.d.ts`. The `node` (default) and `browser` configs. For consumers publishing a package whose types others consume.
_Avoid_: build config

**App config**:
A primitive whose emit mode is _app_: `noEmit` — a bundler (Vite/esbuild/swc) or runtime type-stripper performs the transpile and `tsc` only type-checks. The `node-app` and `browser-app` configs. For consumers building an application, not publishing types.
_Avoid_: bundler config, noEmit config
