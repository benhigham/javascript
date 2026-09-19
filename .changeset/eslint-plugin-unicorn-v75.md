---
'@benhigham/eslint-config': major
---

Update `eslint-plugin-unicorn` to v75. The `recommended` preset gains eight new
error-level rules, which may surface new errors in a consumer's CI.

- `unicorn/no-async-iterator-callback`
- `unicorn/no-unsafe-sqlite-interpolation`
- `unicorn/no-unused-builtin-method-return` — replaces the deprecated
  `unicorn/no-unused-array-method-return`, which leaves the preset; move any
  override of the old rule to the new one
- `unicorn/no-unused-iterator-helper`
- `unicorn/no-useless-set-construction` (autofixable)
- `unicorn/no-using-resource-escape`
- `unicorn/prefer-combined-guards` (autofixable)
- `unicorn/prefer-temporal-conversion` (autofixable) — fires only on code that
  already uses Temporal

`unicorn/prefer-ternary` also now flags an `if` with an early `return` followed
by a `return`, and autofixes it into a single ternary `return`.

Two more rules were promoted into the preset upstream but are disabled here.
Re-enable either locally if you want it.

- `unicorn/prefer-iterator-zip` — its only remedy is `Iterator.zip()`, which is
  in Chrome 153 / Firefox 148 but not Safari or any Node release, so satisfying
  it lands code above every consumer's runtime floor.
- `unicorn/single-line-block-comment-style` — it expands every standalone
  one-line block comment, including `/** @type {X} */` and other one-line
  JSDoc/TSDoc, into a three-line block. That's a style call, not a defect.
