---
'@benhigham/stylelint-config': minor
---

Fix two rules that no longer exist in `stylelint-scss@7`, which were reported as `Unknown rule` on every linted file and never actually ran.

- `scss/at-import-partial-extension` → `scss/load-partial-extension` (the rule was generalised from `@import`-only to all load directives; still configured as `'never'`).
- `scss/max-nesting-depth` → core `max-nesting-depth` (the SCSS-plugin rule was removed in favour of stylelint core; still configured as `3`).

**Heads up — two previously-inert checks now enforce:** because these rules were unknown, they did nothing on the published config. With the corrected names they are active, so a project may see new failures where its SCSS nests deeper than 3 levels, or carries file extensions in `@use`/`@forward`/`@import` partial paths. Resolve the reports, or override the rules locally if the stricter enforcement isn't wanted.
