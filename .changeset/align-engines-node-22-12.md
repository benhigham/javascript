---
'@benhigham/prettier-config': patch
'@benhigham/browserslist-config': patch
'@benhigham/stylelint-config': patch
---

Tighten `engines.node` to `>=22.12.0` to match the first Node 22 LTS that ships stable `require(esm)` and aligned JSON module / import attribute support. This is the floor the broader ecosystem has converged on.
