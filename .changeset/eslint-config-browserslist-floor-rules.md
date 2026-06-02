---
'@benhigham/eslint-config': patch
---

Relax rules that fought a consumer's browserslist floor or churned/broke app and test idioms (surfaced adopting the config in a static Next app).

- **`require-unicode-regexp` (base: require `u` or `v`; browser: require `u`):** the base no longer forces the ES2024 `v` flag — it accepts either `u` or `v` and flags an unflagged regex (offering a suggestion to add `u`). The browser layer requires `u` and rejects `v`: `/…/v` is a `SyntaxError` below Chrome 112 / Safari 17, SWC doesn't downlevel it, and `compat` doesn't catch regex-flag syntax. Existing `/…/v` is then flagged, with an editor suggestion (not an `eslint --fix` autofix) to switch to `/…/u`.
- **`unicorn/no-array-sort` (off, browser layer):** it errors on any use of `.sort()`'s return value and its only escape is `.toSorted()` (Chrome 110+) — it won't accept the floor-safe `[...arr].sort()` — steering browser code above the floor. Node libraries keep it (`.toSorted()` is supported on this config's Node floor, `engines.node` `>=22.13`).
- **`unicorn/prefer-global-this` (off, browser layer):** it autofixes idiomatic `window`/`self` access to `globalThis` and rewrites the canonical `typeof window === 'undefined'` guard; `globalThis` is floor-safe, so this is an idiom/churn conflict, not a floor issue.
- **`unicorn/no-useless-undefined` (off, test files):** a destructive autofix that strips deliberate explicit `undefined` stubs/unset values in tests (`toBe(undefined)`, `mockReturnValue(undefined)`).
- **`@typescript-eslint/prefer-nullish-coalescing` (`ignoreMixedLogicalExpressions: true`):** stops flagging `||` in mixed `&&`/`||` expressions, where switching to `??` changes semantics; value-or-null cases still fire.

The browser-layer relaxations don't affect the Node-library default (`.`, `./typescript`); the test-file and `prefer-nullish` changes apply everywhere.
