# @benhigham/stylelint-config

## 2.0.0

### Major Changes

- [#71](https://github.com/benhigham/javascript/pull/71) [`f571448`](https://github.com/benhigham/javascript/commit/f571448b96a0129c2358784e863c100b798cdb37) Thanks [@benhigham](https://github.com/benhigham)! - Drop `stylelint-no-indistinguishable-colors` and `stylelint-no-unresolved-module`.

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

### Minor Changes

- [#77](https://github.com/benhigham/javascript/pull/77) [`3a6ddd1`](https://github.com/benhigham/javascript/commit/3a6ddd132a84cd4808830a3e2e77f44502667fbe) Thanks [@benhigham](https://github.com/benhigham)! - Refine unit allow-lists and nesting config:
  - `declaration-property-unit-allowed-list`: drop the `margin|padding` entry, narrow the `border|outline` pattern so only width-related properties are constrained to `px` — it still covers hyphenated longhands like `border-top-width` and `border-block-start-width` but excludes `border-radius` (and its `*-radius` longhands) and `outline-offset`, which can use other units. Also broaden `font-size` and `line-height` allowed units (line-height no longer accepts `none`).
  - `unit-allowed-list`: expand the global allow-list to cover modern length, viewport, container-query, grid, and angle units (`px`, `em`, `lh`/`rlh`, `ch`, `vmin`/`vmax`, `svw`/`svh`, `lvw`/`lvh`, `dvw`/`dvh`, `vi`/`vb`, `cqw`/`cqh`/`cqi`/`cqb`/`cqmin`/`cqmax`, `fr`, `turn`, `rad`, `dppx`) and drop the per-property `ignoreProperties` override.
  - `csstools/use-nesting`: use plain `'always'` by default and scope the SCSS syntax option to a new `**/*.scss` override.

### Patch Changes

- [#65](https://github.com/benhigham/javascript/pull/65) [`4a77d3d`](https://github.com/benhigham/javascript/commit/4a77d3d81e694b6b1e65ff422be44817d1f95a96) Thanks [@renovate](https://github.com/apps/renovate)! - Tighten `engines.node` to `>=22.13.0` to align with the floor required by `eslint-plugin-jsdoc@63` (a transitive dependency via `@benhigham/eslint-config`) and to match the baseline the broader ecosystem has converged on.

- [#69](https://github.com/benhigham/javascript/pull/69) [`1872192`](https://github.com/benhigham/javascript/commit/18721921b9f95f6d7c62aca2bed15cc86cc0c655) Thanks [@renovate](https://github.com/apps/renovate)! - Update `stylelint-order` to v8. No new default rules are enabled, but `stylelint --fix`
  now applies limited property sorting inside CSS-in-JS rule blocks containing
  interpolation; consumers may see new autofix output on styled-components / emotion code.

## 1.0.0

### Major Changes

- [#7](https://github.com/benhigham/javascript/pull/7) [`f640bcc`](https://github.com/benhigham/javascript/commit/f640bcce2466e683ce0f8ced1060dbb785f19dbe) Thanks [@benhigham](https://github.com/benhigham)! - Upgrade to Stylelint 17

  ### Breaking Changes
  - **Minimum Stylelint version is now 17.0.0** (previously 16.19.1)
  - **Removed `stylelint-selector-bem-pattern` plugin** — BEM enforcement is no longer included. If your project needs BEM validation, add `stylelint-selector-bem-pattern` directly.

  ### Changes
  - Upgraded `stylelint-config-standard-scss` to ^17.0.0
  - Upgraded `stylelint-high-performance-animation` to ^2.0.0
  - Upgraded `stylelint-declaration-block-no-ignored-properties` to ^3.0.0
  - Upgraded `stylelint-find-new-rules` to ^6.0.0 (dev dependency)
