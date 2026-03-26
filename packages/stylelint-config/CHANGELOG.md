# @benhigham/stylelint-config

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
