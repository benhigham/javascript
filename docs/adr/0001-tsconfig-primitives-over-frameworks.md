# tsconfig ships environment×emit primitives, not framework configs

`@benhigham/tsconfig` is organized around two orthogonal axes — runtime environment (node vs browser/DOM) and emit mode (library vs app/noEmit) — exposing four primitives (`node`, `browser`, `node-app`, `browser-app`) over an internal `base` kernel, rather than per-framework configs (`next`, `astro`, `vite`, `react-app`).

We dropped the framework configs because each was either redundant or actively fragile: Next force-overwrites `module`/`jsx`/resolution on every build (and `extends` disables its plugin auto-injection), Astro ships and auto-wires its own `astro/tsconfigs/*` presets, and Vite needs a two-file app/node project-references split that a single config can't honestly represent. Tracking six framework toolchains meant constant drift against their upstreams for little value; primitives are stable and composable, and they put framework specifics where they belong — in the framework's own tooling, with composition documented in the package README.

## Consequences

- Framework consumers compose a primitive with the framework's config (recipes in `packages/tsconfig/README.md`). This is a breaking change: the `./react-app.json`, `./next.json`, `./astro.json`, and `./vite.json` subpaths are removed.
- `moduleResolution` follows the emit axis (library → `nodenext`, app → `bundler`), which also fixes the prior bug where an emitting `browser` config used bundler resolution and produced non-Node-resolvable output.
