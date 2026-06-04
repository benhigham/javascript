---
'@benhigham/eslint-config': major
---

Drop the browser-layer floor workarounds now that the toolchain targets a modern browser floor (ADR-0004). The browser-only narrowing of `require-unicode-regexp` to the `u` flag is removed — at the modern floor both `u` and `v` run, so the base's flag-agnostic rule (require `u` or `v`) applies uniformly. `v` is intentionally not forced: it is gated on the consumer's tsconfig `target` (ES2024), which `@benhigham/tsconfig` does not set, so forcing it would require every consumer to set `target: ES2024`. `unicorn/no-array-sort` is re-enabled (its `.toSorted()` autofix is floor-safe and needs only `lib: ES2023`); this surfaces new errors in consumer code.
