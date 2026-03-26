# @benhigham/commitlint-config

## 2.0.0

### Major Changes

- [#36](https://github.com/benhigham/javascript/pull/36) [`9b5b8fb`](https://github.com/benhigham/javascript/commit/9b5b8fb276816c62e3f5d057315c48eae2b958c0) Thanks [@benhigham](https://github.com/benhigham)! - Activate `body-max-line-length` rule. The rule was previously disabled (severity `0`) and is now set to error (severity `2`) with a 100-character limit. Commits with body lines exceeding 100 characters will now be rejected.

  Restore `@commitlint/cli` peer dependency that was inadvertently dropped during the monorepo migration.
