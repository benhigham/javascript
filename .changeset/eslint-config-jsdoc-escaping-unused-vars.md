---
'@benhigham/eslint-config': minor
---

Stop corrupting JSDoc, and honor the `_`-prefix "intentionally unused" convention across JS and TS (surfaced while adopting the config in a static Next app).

- **`jsdoc/text-escaping` (off, both JS and TS):** the `contents` category preset enables it at error, but every `recommended-*` bundle ships it off. Its autofix escapes `<` → `&lt;` in JSDoc, but isn't markdown-aware (it mangles `<` inside backtick code spans) and escapes only `<`, not `>` — asymmetric corruption. It targets JSDoc rendered as raw HTML; TS/TSDoc and editor hover render markdown, where the escaping is pure damage. Restores the bundle default.
- **`no-unused-vars` honors the `_`-prefix convention across JS and TS:** `argsIgnorePattern`/`varsIgnorePattern`/`caughtErrorsIgnorePattern`/`destructuredArrayIgnorePattern` are set to `^_`, and `ignoreRestSiblings` permits the destructure-to-omit pattern (`{ a: _a, ...rest }`). Applied to TS files via `@typescript-eslint/no-unused-vars` and to JS files via core `no-unused-vars`, so a `_`-prefixed name means "intentionally unused" everywhere. `reportUsedIgnorePattern: true` keeps the convention honest: a `_`-prefixed name that is actually used is now flagged (rename it) — that option can newly-fail previously-passing code, hence the minor bump.
- **`sonarjs/no-unused-vars` (off):** it duplicated unused detection but ignored the `_` patterns and `ignoreRestSiblings` above (it flagged the destructure-to-omit `_a`), so unused detection now defers entirely to `no-unused-vars` — matching the existing `sonarjs/unused-import: off` precedent.
