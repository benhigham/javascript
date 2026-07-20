---
'@benhigham/eslint-config': major
---

Update `eslint-plugin-unicorn` to v72. The `recommended` preset gains six new
error-level rules, which may surface new errors in a consumer's CI. The ESLint
(`>=10.4`) and Node.js (`>=22`) floors are unchanged.

- `unicorn/no-multiple-promise-resolver-calls`
- `unicorn/no-shorthand-property-overrides`
- `unicorn/no-transition-all`
- `unicorn/no-unnecessary-string-trim` (autofixable)
- `unicorn/no-useless-re-export`
- `unicorn/prefer-then-catch` — note that `.then(onFulfilled, onRejected)` and
  `.then(onFulfilled).catch(onRejected)` are not equivalent; the chained form
  also catches what `onFulfilled` throws. The rule reports a suggestion rather
  than an autofix, so review each one.

A seventh, `unicorn/prefer-dom-node-html-methods`, was promoted into the preset
upstream but is disabled here. Its read side is an autofix that matches the
`innerHTML` property name alone — no type information — so any non-DOM object
carrying an `innerHTML` key is rewritten to `.getHTML()` and throws at runtime.
`Element#getHTML()` is also Chrome 125 / Firefox 128 / Safari 18, so the fix can
land below a consumer's browser floor. Re-enable it locally if you want it.

`unicorn/prefer-minimal-ternary` renamed its `checkVaryingCallee` option to
`checkVaryingBase` — rename any override of the old key, which now fails schema
validation.
