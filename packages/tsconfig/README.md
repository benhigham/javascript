# @benhigham/tsconfig

Shareable TypeScript configurations, organized as **environment×emit primitives** rather than per-framework presets.

Every TypeScript project's base settings are really driven by two orthogonal questions:

- **Where does it run?** Node, or the browser/DOM.
- **Who emits the JavaScript?** `tsc` does (a **library** — emits `.js` + `.d.ts`), or a bundler/runtime does (an **app** — `noEmit`).

That gives a 2×2, and this package ships one config per cell:

|             | library (`tsc` emits)              | app (`noEmit`, bundler transpiles)     |
| ----------- | ---------------------------------- | -------------------------------------- |
| **node**    | `.` (`@benhigham/tsconfig`)        | `@benhigham/tsconfig/node-app.json`    |
| **browser** | `@benhigham/tsconfig/browser.json` | `@benhigham/tsconfig/browser-app.json` |

`moduleResolution` follows the **emit** axis (libraries → `nodenext` so output resolves under Node; apps → `bundler`). The **environment** axis sets the `lib`: browser adds `DOM` + `jsx: react-jsx` on top of the `ES2024` baseline, while node additionally carries the staged `ESNext.*` iterator/Set/array helpers its pinned runtime guarantees and the browser configs omit by design (ADR-0006). There is no framework config — see [Framework composition](#framework-composition).

## Requirements

- TypeScript `>= 6.0`
- Node `>= 22.13.0`

## Install

```sh
pnpm add -D @benhigham/tsconfig typescript
```

## Usage

**Node library** (publishing a package whose types others consume):

```jsonc
// tsconfig.json
{ "extends": "@benhigham/tsconfig" }
```

**Browser/DOM library** (e.g. a component library compiled by `tsc`):

```jsonc
{ "extends": "@benhigham/tsconfig/browser.json" }
```

**Browser app** (an SPA type-checked by `tsc`, bundled by Vite/esbuild/swc):

```jsonc
{ "extends": "@benhigham/tsconfig/browser-app.json" }
```

**Node app** (a backend or script run via `tsx`/Bun or bundled by esbuild/tsup, type-checked only):

```jsonc
{ "extends": "@benhigham/tsconfig/node-app.json" }
```

The library configs emit to `${configDir}/dist`; override `outDir` if you need somewhere else. The app configs set `noEmit`; add `incremental` + `tsBuildInfoFile` yourself if you want cached type-checks.

## Framework composition

This package deliberately ships no `next`/`astro`/`vite`/`react-app` configs. Each of those toolchains either manages its own tsconfig or ships its own preset, so the durable approach is to compose a primitive with the framework's own tooling.

### Vite (React/Vue/Solid)

Mirror create-vite's project-references split — the app and the Vite config are different environments:

```jsonc
// tsconfig.json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }],
}
// tsconfig.app.json
{
  "extends": "@benhigham/tsconfig/browser-app.json",
  "compilerOptions": { "types": ["vite/client"] },
  "include": ["src"],
}
// tsconfig.node.json — type-checks vite.config.ts under Node
{
  "extends": "@benhigham/tsconfig/node-app.json",
  "include": ["vite.config.ts"],
}
```

### Next.js

Next force-manages `module`, `moduleResolution`, `jsx`, and friends on every build, and — importantly — **disables its automatic plugin injection when your tsconfig uses `extends`**. So extend `browser-app` for strictness, but re-declare the Next plugin and the generated-types includes yourself:

```jsonc
// tsconfig.json
{
  "extends": "@benhigham/tsconfig/browser-app.json",
  "compilerOptions": { "plugins": [{ "name": "next" }] },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"],
}
```

Next will still re-assert its required fields (`jsx: react-jsx`, `module: esnext`, …) on build — that's expected and harmless.

### Astro

Astro publishes and auto-wires its own presets, which set Astro-specific options (`jsx: preserve`, the `.astro/types.d.ts` include) that a React-oriented config would get wrong. Use Astro's preset directly rather than one from this package:

```jsonc
{ "extends": "astro/tsconfigs/strict" }
```

## Notes

- **JSX runtime.** `browser` and `browser-app` set `jsx: "react-jsx"` (the standard automatic runtime). For Solid, Vue JSX, or another runtime, override `jsx`/`jsxImportSource`:

  ```jsonc
  {
    "extends": "@benhigham/tsconfig/browser-app.json",
    "compilerOptions": { "jsx": "preserve", "jsxImportSource": "solid-js" },
  }
  ```

- **`erasableSyntaxOnly`.** All configs enable this, so your source stays portable to type-strippers (Node's `--experimental-strip-types`, esbuild, swc). `enum`, runtime `namespace`, and constructor parameter properties are reported as errors — use unions/objects, plain modules, and explicit field assignment instead. This only constrains code you author; importing a dependency that uses an `enum` is unaffected.

- **`.ts` import extensions.** The **app** configs (`node-app`, `browser-app`) enable `allowImportingTsExtensions`, so you can write relative imports with their real `.ts`/`.tsx` extension (`import './util.ts'`) — the bundler resolves them and `tsc` emits nothing. The **library** configs deliberately do not: a published package may be built by `tsc` _or_ a bundler, and `.ts`→`.js` rewriting only happens under `tsc` (via `rewriteRelativeImportExtensions`) — per-file builders such as esbuild's transform mode, unbuild's mkdist, or bare swc would ship a literal `./util.ts` specifier. Author library imports with the conventional `.js` extension (or none), which resolves correctly under every toolchain.
