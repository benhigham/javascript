# @benhigham/tsconfig

## 3.0.0

### Major Changes

- [#88](https://github.com/benhigham/javascript/pull/88) [`f28e6d6`](https://github.com/benhigham/javascript/commit/f28e6d657996ce787f1121bf3a88325c47e7a646) - Redesign the package around environment×emit primitives and drop the framework-specific configs.

  Configs are now organized by the two axes that actually drive TypeScript settings — runtime environment (node vs browser/DOM) and emit mode (library vs app/noEmit) — instead of by target framework:
  - `.` / `./node.json` — node library (emits js + `.d.ts`; `module: nodenext`)
  - `./browser.json` — DOM library (emits; adds `DOM` lib + `jsx: react-jsx`)
  - `./node-app.json` — node app (`noEmit`; `module: esnext` + bundler resolution)
  - `./browser-app.json` — browser app (`noEmit`; adds `DOM` lib + `jsx: react-jsx`)

  **Removed exports (breaking):** `./react-app.json`, `./next.json`, `./astro.json`, `./vite.json`. Framework toolchains are now served by composing a primitive with the framework's own config — see the package README for migration recipes. In brief:
  - `react-app` / `vite` → `./browser-app.json` (Vite users add a `tsconfig.node.json` extending `./node-app.json` for `vite.config.ts`, mirroring create-vite's project-references split)
  - `next` → extend `./browser-app.json`, re-declaring `plugins: [{ "name": "next" }]` and the `.next/types` includes (Next disables automatic plugin injection under `extends`); or keep create-next-app's tsconfig and layer `./browser-app.json` for strictness
  - `astro` → extend `astro/tsconfigs/strict` (Astro ships and auto-wires its own preset)

  **Other changes:**
  - Fixes a latent bug: the old `browser.json` set `moduleResolution: bundler` while emitting, producing extensionless imports that don't resolve under Node ESM. Library primitives (`node`, `browser`) now use `nodenext`; `moduleResolution` follows the emit axis, not the environment.
  - `lib` modernized: node configs use `["ES2024", "ESNext.Array", "ESNext.Collection", "ESNext.Iterator"]` (matching `@tsconfig/node22`); browser configs use `["ES2023", "DOM"]` (TypeScript 6.0 folded `lib.dom.iterable` into `lib.dom`, leaving an empty back-compat stub, so `DOM.Iterable` is redundant under the `typescript >= 6.0` peer requirement).
  - `erasableSyntaxOnly` is enabled across all configs — source must be type-stripper-portable, so `enum`, runtime `namespace`, and constructor parameter properties are disallowed.
  - The library configs no longer set `removeComments`, so JSDoc is preserved in the emitted `.d.ts` and consumers keep their editor hover documentation.

  See ADR-0001 for the rationale behind shipping primitives instead of framework configs.

## 2.0.0

### Major Changes

- [#46](https://github.com/benhigham/javascript/pull/46) [`ebcf950`](https://github.com/benhigham/javascript/commit/ebcf95085287f9fe0afadb4616dbfb73bc0bfe98) Thanks [@renovate](https://github.com/apps/renovate)! - Require TypeScript 6, update browser-oriented configs for TS 6 compatibility, and remove the redundant react-library config.

  Also tighten `engines.node` to `>=22.13.0` (was `>=22`) to match the floor adopted across the `@benhigham` packages.

## 1.0.1

### Patch Changes

- [#36](https://github.com/benhigham/javascript/pull/36) [`9b5b8fb`](https://github.com/benhigham/javascript/commit/9b5b8fb276816c62e3f5d057315c48eae2b958c0) Thanks [@benhigham](https://github.com/benhigham)! - Restore `typescript` peer dependency (`>=5.5`) that was inadvertently dropped during the monorepo migration.
