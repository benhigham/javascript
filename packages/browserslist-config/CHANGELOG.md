# @benhigham/browserslist-config

## 2.0.0

### Major Changes

- [#116](https://github.com/benhigham/javascript/pull/116) [`9421b13`](https://github.com/benhigham/javascript/commit/9421b1310b63ef45f62de19aefe6399932ae2cdb) - Move the default floor to a single rolling, modern query — `last 2 years and not dead and fully supports es6-module` — replacing the `defaults`-based desktop/mobile arrays. The clauses are intersected with `and` (Browserslist combines array/comma entries with `or`, which would broaden the floor instead of narrowing it), so the floor now lands at roughly Baseline "newly available" (today ~Chrome 126 / Firefox 127 / Safari 17.6), dropping the long tail of low-end and niche engines. Consumers' build output targets narrow accordingly. The `./node` export is unchanged. See ADR-0004.

## 1.0.2

### Patch Changes

- [#65](https://github.com/benhigham/javascript/pull/65) [`4a77d3d`](https://github.com/benhigham/javascript/commit/4a77d3d81e694b6b1e65ff422be44817d1f95a96) Thanks [@renovate](https://github.com/apps/renovate)! - Tighten `engines.node` to `>=22.13.0` to align with the floor required by `eslint-plugin-jsdoc@63` (a transitive dependency via `@benhigham/eslint-config`) and to match the baseline the broader ecosystem has converged on.

## 1.0.1

### Patch Changes

- [#36](https://github.com/benhigham/javascript/pull/36) [`9b5b8fb`](https://github.com/benhigham/javascript/commit/9b5b8fb276816c62e3f5d057315c48eae2b958c0) Thanks [@benhigham](https://github.com/benhigham)! - Migrate to `benhigham/javascript` monorepo. No functional changes.
