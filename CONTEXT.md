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
The invariant that every change to a published package's consumer-facing surface has a corresponding changeset, so its version bump and changelog are complete and nothing needs retroactive reconciliation. The surface is the _resolved behavior_ a consumer gets, not the set of files shipped — an internal restructure with byte-identical resolved behavior owes no changeset, even when the published tarball's file tree changes (or a previously-implied option becomes explicit without changing what TypeScript computes, or a composed flat-config block gains a `name` — tooling-visible in `--inspect-config` and ESLint's error messages, but absent from the resolved config a consumer's lint run applies).
_Avoid_: changeset coverage

**Primitive config**:
A `@benhigham/tsconfig` variant defined by the two orthogonal axes — runtime environment (node vs browser/DOM) and emit mode (library vs app) — rather than by a target framework. The package ships only primitives (`node` (the `.` default), `browser`, `node-app`, `browser-app`); framework toolchains (Next, Astro, Vite) are served by composing a primitive with the framework's own config and docs, never a bespoke variant.
_Avoid_: framework config (the deliberately-rejected alternative — see ADR-0001)

**Config fragment**:
An internal, unexported building block of `@benhigham/tsconfig` carrying one axis's worth of `compilerOptions` — an _emit_ fragment (`emit-library`, `emit-app`) or an _environment_ fragment (`env-node`, `env-browser`). Each primitive is composed as `base` + one emit fragment + one environment fragment via an `extends` array; fragments live in `src/internal/` and are never exported.
_Avoid_: preset, partial config, layer (that is eslint's composable unit — see _Layer_)

**Library config**:
A primitive whose emit mode is _library_: `tsc` emits JavaScript + `.d.ts`. The `node` (default) and `browser` configs. For consumers publishing a package whose types others consume.
_Avoid_: build config

**App config**:
A primitive whose emit mode is _app_: `noEmit` — a bundler (Vite/esbuild/swc) or runtime type-stripper performs the transpile and `tsc` only type-checks. The `node-app` and `browser-app` configs. For consumers building an application, not publishing types.
_Avoid_: bundler config, noEmit config

**Browserslist floor**:
The lowest browser/runtime a consumer's code must not break, taken from `@benhigham/browserslist-config` (e.g. `chrome 126`). It is the line that governs how floor-sensitive lint rules — those steering code toward ECMAScript built-ins that `compat` cannot catch (e.g. `unicorn/no-array-sort`, whose `.toSorted()` fix needs Chrome 110+) — are tuned: relaxed when the floor sits below the feature, required when it sits at or above. (Regex-flag syntax is _not_ such a case: the `v` flag is gated on the consumer's tsconfig `target`, a compile-time axis this floor doesn't move — see ADR-0004.)
_Avoid_: baseline, browser target, browserslist target

**Resolved config**:
The rule set (with parser, globals, and settings) ESLint computes for a single file path after composing every layer of an exported `@benhigham/eslint-config` config. It is what a consumer's file actually gets — the genuine interface of the package, and the surface its tests assert against — as opposed to the exported config arrays, which are the ingredients that compose into it.
_Avoid_: the config (overloaded — say "config arrays" or "config source" for the ingredients), effective config

**Block**:
A single flat-config object — the atom a _Layer_ is composed of (a layer is one or more blocks), and the unit a flat-config `name` attaches to. A block's `name` is tooling-visible (`eslint --inspect-config`, ESLint's error messages) but never enters the _resolved config_, so it is not part of the consumer-facing surface _Release coverage_ governs. Blocks this package authors are named `@benhigham/eslint-config/<slug>` through the `blockName` helper; upstream presets keep their own upstream names (ADR-0009).
_Avoid_: config object, layer (reserve for the one-or-more-blocks composable unit — see _Layer_)

**Layer**:
One concern's contribution to an `@benhigham/eslint-config` export's config array — one or more _blocks_ (flat-config objects) spread in at a fixed position (the JS recommended preset, `browserEnvLayers`, the curated tail). The composable unit of an eslint export, as a _config fragment_ is of a tsconfig — the word differs because the mechanism does (flat-array spread vs tsconfig `extends`). Reusable layer bundles follow a shape-suffix convention: `*Layers` is an array of config objects to spread (`typescriptLayers`, `reactLayers`), `*Config` is a single config object to place (`compatConfig`, `reactConfig`). `base` — the kernel every export prepends — is the lone exception.
_Avoid_: fragment (reserved for tsconfig — see _Config fragment_), part

**Composition invariant**:
A guarantee about which rule configuration wins for a given file, arising from the order and scoping of the layers an `@benhigham/eslint-config` export composes rather than from any single layer — e.g. the JS-vs-TS split that keeps the type-checked global disables off `.js`, the "last-wins" curated tail, the _environment seam_'s per-environment `n`/`compat` behaviour, and prettier applied last. The class of decisions the package's resolved-config tests assert (ADR-0003); the order-and-prettier members are concentrated in one config composer rather than hand-written per export (ADR-0007).
_Avoid_: composition decision, tuning (too vague — bare "tuning" for the invariant; "curated tunings" names the rule data, below)

**Environment seam**:
The browser-vs-Node boundary inside a project linted with `@benhigham/eslint-config`'s browser-family exports (`/browser`, `/react`, `/next`): Node files — config files and build scripts — versus browser source. Environment-owned rules apply or fall away along it, by two distinct mechanisms: Node-environment rules (`n`, the browser-hostile unicorn idioms) are _neutralized_ — overridden off — on browser source while Node files keep them, and the browser-API checker `compat` is conversely _scoped_ — never applies — off Node files. Both halves of the seam are authored together in the browser environment layer, the layer that owns the environment (ADR-0002). A _composition invariant_ instance, asserted through the resolved config.
_Avoid_: split (too vague), NODE_FILES (the glob constant implementing the seam, not the concept), scoping/neutralization used interchangeably (they name the seam's two distinct mechanisms)

**Curated tunings**:
The repo's own ESLint rule customisations layered over the bundled presets, in `eslint-config/src/lib/tunings.js`: the language-agnostic `rules`, the non-type-aware `tsRules`, and the type-aware `tsCheckedRules`. The composer re-applies `rules` and `tsRules` last — the _curated tail_ — so they win over the presets; `tsCheckedRules` rides as a TS-scoped layer beside `projectService` (ADR-0007). Rule **data**, as opposed to the order-and-scoping guarantee a _composition invariant_ names.
_Avoid_: tuning (bare — overloaded with the composition-invariant sense)

**Type-test file**:
A vitest test file using the `-d` suffix convention — `*.{test,spec}-d.{ts,tsx,mts,cts}` — whose body holds type-level assertions (`expectTypeOf`/`assertType`) rather than runtime ones. Inherently TypeScript and meaningful only with type information, so `@benhigham/eslint-config` lints it solely in the type-aware layer (where `typecheck: true` rides with `projectService`), never under the base/non-type-aware exports; the runtime test layer excludes it outright. The few curated vitest rules that assume a runtime test (`require-hook`, `padding-around-expect-groups`) are turned off for it.
_Avoid_: type test (the activity), test file (overloaded — reserve for runtime `*.{test,spec}.*` files)

**Fix convergence**:
The property that a config's autofixer (`stylelint --fix`, `eslint --fix`) drives a file to a clean, stable fixpoint — no findings remain and a re-run changes nothing. Broken when two rules disagree on a canonical form and the rejecting side has no fixer (or the fixers oscillate). A first-class config invariant: a convergence bug is fixed where a reconciliation exists (e.g. `stylelint-config`'s `currentColor` casing, whose reconciliation is to list both casings in `ignoreValues` — identified and tracked in issue #133); the rare genuine exception — where both rules have independent value and no auto-reconciliation exists — is documented rather than silently dropped (ADR-0010, `use-nesting` vs `selector-no-redundant-nesting-selector` on descendant nesting).
_Avoid_: idempotent fix (names only the re-run-changes-nothing half), fixpoint (bare jargon)
