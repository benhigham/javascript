---
'@benhigham/commitlint-config': major
---

Activate `body-max-line-length` rule. The rule was previously disabled (severity `0`) and is now set to error (severity `2`) with a 100-character limit. Commits with body lines exceeding 100 characters will now be rejected.

Restore `@commitlint/cli` peer dependency that was inadvertently dropped during the monorepo migration.
