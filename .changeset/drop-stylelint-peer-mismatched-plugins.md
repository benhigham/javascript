---
'@benhigham/stylelint-config': major
---

Drop `stylelint-no-indistinguishable-colors` and `stylelint-no-unresolved-module`.

**Breaking changes for consumers:**

- The rule `plugin/stylelint-no-indistinguishable-colors` (flags colors that
  are visually too close to distinguish) is no longer enforced. Consumers
  needing the check should install `stylelint-no-indistinguishable-colors`
  directly and re-add the plugin + rule in their own config.
- The rule `plugin/no-unresolved-module` (validates `@import` / `@use` paths
  against `node_modules`) is no longer enforced. Consumers needing the check
  should install `stylelint-no-unresolved-module` directly and re-add the
  plugin + rule in their own config.

**Why:** both plugins cap their stylelint peer-dependency at `^16`, while this
config targets stylelint `^17`. Installs produced peer-dep warnings and the
rules could not be reliably supported. No stylelint-17-compatible alternatives
were available at the time of removal.

**Side effect:** removing `stylelint-no-unresolved-module` eliminates its
transitive `scss-parser` → `lodash` chain, the only consumer of full `lodash`
in the install graph. The accompanying `lodash@<4.17.23` override in
`pnpm-workspace.yaml` has been removed as it is no longer needed.
