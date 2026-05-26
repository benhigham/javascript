---
'@benhigham/prettier-config': patch
'@benhigham/browserslist-config': patch
'@benhigham/stylelint-config': patch
---

Tighten `engines.node` to `>=22.13.0` to align with the floor required by `eslint-plugin-jsdoc@63` (a transitive dependency via `@benhigham/eslint-config`) and to match the baseline the broader ecosystem has converged on.
