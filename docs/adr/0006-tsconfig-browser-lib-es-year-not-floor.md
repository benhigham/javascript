# Browser tsconfig `lib` tracks the standard ES-year, not the literal floor

ADR-0004 establishes that a config's browser support tracks a rolling, modern browserslist floor, and that `lib` reflects what that floor supports. Read literally for `@benhigham/tsconfig`, the floor (today ~Chrome 126 / Firefox 127 / Safari 17.6) already supports two of the three staged `ESNext.*` lib groups TypeScript exposes — `ESNext.Array` (`Array.fromAsync`, Baseline Jan 2024) and `ESNext.Collection` (`Set` `union`/`intersection`/…, Baseline Jun 2024) — leaving only `ESNext.Iterator` (iterator helpers, Baseline Mar 2025; Safari 18.4 / Firefox 131) genuinely above the floor. We nonetheless type the browser primitives' `lib` at the **standard ES-year only** (`["ES2024", "DOM"]`) and keep **all three** `ESNext.*` groups node-only. The remaining node-vs-browser env gap is a deliberate one-sentence asymmetry: node additionally gets the staged `ESNext.*` helpers because its pinned `>= 22.13` runtime guarantees the whole set; browser doesn't, because we hold its `lib` to whole ES-year boundaries.

## Considered options

The rejected alternative was a **floor-faithful** `lib`: type the browser primitives as exactly what the floor supports (`ES2024 + ESNext.Array + ESNext.Collection + DOM`, with node adding only `ESNext.Iterator`). It is the literal reading of ADR-0004 and never under-types a below-floor global, but we rejected it for three reasons:

1. **It is unstable.** That asymmetry is a transient artifact of the browser floor lagging the proposals; it erodes to nothing as the rolling window clears Firefox 131 / Safari 18.4 (≈ within a year), at which point the browser and node `lib` would collapse to identical. Enshrining a vanishing distinction in a config that consumers pin is churn for churn's sake — each floor crossing would owe a browser-`lib` bump and changeset.
2. **`ESNext.Collection` rides the knife-edge.** Firefox 127 (the `Set`-methods laggard) _is_ today's floor. `compat/compat` cannot police a lib-typed global, so a consumer whose actual floor sits one version below would get neither a type error nor a lint error — a silent runtime hazard (the blind spot CONTEXT.md's _Browserslist floor_ term names).
3. **Whole ES-year boundaries are easier to reason about** than a per-proposal floor chase that must be re-verified against live Baseline data every time the floor rolls.

The standard-ES-year line is stable and floor-movement-independent, which is why we picked it.

## Consequences

- The browser primitives (`browser`, `browser-app`) deliberately omit some globals their floor already supports (`Array.fromAsync`, the `Set` methods). A consumer who wants them adds the relevant `ESNext.*` entry to their own `lib`. This is intentional, not an oversight: `internal/env-browser.json` carries a pointer comment to this ADR, and `test/matrix.test.js` asserts the browser primitives' `lib` carries no `esnext.*` entry — so a "fix" that re-adds them fails CI.
- The browser `lib` move from `ES2023` to `ES2024` is additive (new globals, nothing removed) and ships as a **minor**.
- `target` is unaffected — it stays `ES2023`; ADR-0004 governs the `target` / `require-unicode-regexp` `v`-flag reasoning, which this decision does not reopen.

Refines [ADR-0004](./0004-modern-browser-runtime-floor.md).
