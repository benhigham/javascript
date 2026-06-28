---
'@benhigham/eslint-config': major
---

Update `eslint-plugin-unicorn` to v69. The `recommended` preset gains 141 new
rules (v66–v69), which may surface new errors in a consumer's CI.

- **Requires ESLint >= 10.4** (raised from `>=10.0.0`) and Node.js >= 22.
- `unicorn/prevent-abbreviations` was renamed to `unicorn/name-replacements`, and
  `unicorn/no-array-for-each` to `unicorn/no-for-each` — rename any override of the
  old keys. The old names linger as deprecated aliases, so a stale override silently
  stops working and the rule re-activates as errors.
- `unicorn/no-hex-escape` was removed (use `unicorn/prefer-unicode-code-point-escapes`).
