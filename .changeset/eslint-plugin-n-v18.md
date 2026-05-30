---
'@benhigham/eslint-config': patch
---

Update `eslint-plugin-n` to v18. The bundled `flat/recommended` preset no longer enables `n/no-unpublished-bin`, so that rule is no longer enforced by default. The plugin is now ESM-only and raises its own minimum ESLint to `>=8.57.1` (already satisfied by this config's `eslint >=10` peer). No new rules are added to the recommended preset, so previously-clean code will not see new lint reports.
