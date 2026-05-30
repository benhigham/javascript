# @benhigham/commitlint-config

## 3.0.0

### Major Changes

- [#64](https://github.com/benhigham/javascript/pull/64) [`648b8c8`](https://github.com/benhigham/javascript/commit/648b8c8390621bc0a6fa71088e2388592b697ae5) Thanks [@renovate](https://github.com/apps/renovate)! - Update `@commitlint/config-conventional` and `@commitlint/format` to v21. The `@commitlint/cli` peer dependency requirement is raised to `>=21.0.0` (was `>=20.0.0`), so consumers must upgrade their commitlint CLI. Minimum Node version is now 22.13.0 (was 22.0.0); Node 18 and 20 are no longer supported.

## 2.0.0

### Major Changes

- [#36](https://github.com/benhigham/javascript/pull/36) [`9b5b8fb`](https://github.com/benhigham/javascript/commit/9b5b8fb276816c62e3f5d057315c48eae2b958c0) Thanks [@benhigham](https://github.com/benhigham)! - Activate `body-max-line-length` rule. The rule was previously disabled (severity `0`) and is now set to error (severity `2`) with a 100-character limit. Commits with body lines exceeding 100 characters will now be rejected.

  Restore `@commitlint/cli` peer dependency that was inadvertently dropped during the monorepo migration.
