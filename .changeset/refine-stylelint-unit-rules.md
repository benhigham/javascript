---
'@benhigham/stylelint-config': minor
---

Refine unit allow-lists and nesting config:

- `declaration-property-unit-allowed-list`: drop the `margin|padding` entry, narrow the `border|outline` pattern so only width-related properties are constrained to `px` — it still covers hyphenated longhands like `border-top-width` and `border-block-start-width` but excludes `border-radius` (and its `*-radius` longhands) and `outline-offset`, which can use other units. Also broaden `font-size` and `line-height` allowed units (line-height no longer accepts `none`).
- `unit-allowed-list`: expand the global allow-list to cover modern length, viewport, container-query, grid, and angle units (`px`, `em`, `lh`/`rlh`, `ch`, `vmin`/`vmax`, `svw`/`svh`, `lvw`/`lvh`, `dvw`/`dvh`, `vi`/`vb`, `cqw`/`cqh`/`cqi`/`cqb`/`cqmin`/`cqmax`, `fr`, `turn`, `rad`, `dppx`) and drop the per-property `ignoreProperties` override.
- `csstools/use-nesting`: use plain `'always'` by default and scope the SCSS syntax option to a new `**/*.scss` override.
