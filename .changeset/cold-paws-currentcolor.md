---
'@benhigham/stylelint-config': patch
---

Fix `stylelint --fix` not converging for stylesheets that use `currentColor`. The inherited `value-keyword-case: lower` fixer rewrites `currentColor` to `currentcolor`, which the case-sensitive `ignoreValues` of `scale-unlimited/declaration-strict-value` no longer matched, leaving a standing error. Both casings are now listed in `ignoreValues`, so a single `--fix` pass reaches a clean, stable state.
