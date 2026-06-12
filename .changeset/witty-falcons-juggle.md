---
'@benhigham/eslint-config': minor
---

Update `eslint-plugin-unicorn` to v65. The recommended preset gains 28 new rules
(`better-dom-traversing`, `consistent-compound-words`, `consistent-json-file-read`,
`no-array-fill-with-reference-type`, `no-array-from-fill`, `no-blob-to-file`,
`no-canvas-to-image`, `no-confusing-array-splice`, `no-duplicate-set-values`,
`no-exports-in-scripts`, `no-incorrect-query-selector`, `no-late-current-target-access`,
`no-this-outside-of-class`, `no-unnecessary-nested-ternary`, `no-unused-array-method-return`,
`prefer-array-last-methods`, `prefer-get-or-insert-computed`, `prefer-https`,
`prefer-includes-over-repeated-comparisons`, `prefer-iterator-to-array-at-end`,
`prefer-math-abs`, `prefer-queue-microtask`, `prefer-split-limit`, `prefer-string-match-all`,
`prefer-string-pad-start-end`, `prefer-string-repeat`, `require-css-escape`,
`require-passive-events`); consumers may see new lint reports on previously-clean code.

Migration notes for consumers with their own overrides:

- `unicorn/prefer-dom-node-dataset` was renamed to `unicorn/dom-node-dataset` — rename any
  override, or ESLint errors on configuring a nonexistent rule.
- `unicorn/better-regex` was removed — drop any override that enables it.
