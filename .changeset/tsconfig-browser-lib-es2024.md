---
'@benhigham/tsconfig': minor
---

Align the browser primitives' `lib` baseline to `ES2024`. `internal/env-browser.json` moves from `lib: ["ES2023", "DOM"]` to `lib: ["ES2024", "DOM"]`, so `browser` and `browser-app` consumers now type the ES2024 globals their floor already supports — `Object.groupBy`/`Map.groupBy`, `Promise.withResolvers`, `String.prototype.isWellFormed`/`toWellFormed`, and resizable `ArrayBuffer`. Additive (nothing removed); `target` stays `ES2023` and the node configs are byte-identical.

The staged `ESNext.*` helpers (`Array.fromAsync`, the `Set` methods, iterator helpers) remain **node-only** by design: the browser `lib` tracks the standard ES-year, not the literal browserslist floor, so it is not chased across a rolling floor that `compat` cannot police. See ADR-0006.
