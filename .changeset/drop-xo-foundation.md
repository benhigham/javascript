---
'@benhigham/eslint-config': major
---

Drop the XO foundation; rebuild on `@eslint/js`, `typescript-eslint`, and `@eslint-react/eslint-plugin`.

**Breaking changes for consumers:**

- The default export (`@benhigham/eslint-config`) now lints both `.js` and `.ts`/`.tsx` files without requiring a `tsconfig` or `projectService`. Consumers who previously reached for `@benhigham/eslint-config/typescript` purely to enable TS support can use the default export.
- Type-aware rules still live in `@benhigham/eslint-config/typescript`, but the underlying rule set is now `typescript-eslint`'s `recommendedTypeChecked` + `stylisticTypeChecked` rather than `eslint-config-xo-typescript`. Some XO-specific rules no longer fire.
- `@benhigham/eslint-config/react` now uses `@eslint-react/eslint-plugin` instead of `eslint-config-xo-react` (and the conventional `eslint-plugin-react` / `eslint-plugin-react-hooks` pair). Consumers overriding `react/*` or `react-hooks/*` rule names need to remap to `@eslint-react/*` equivalents.
- The package no longer provides a JSON parser. The `depend/ban-dependencies` rule no longer scans `package.json`, and `no-secrets/no-secrets` no longer scans JSON files. Consumers wanting JSON-aware linting should add `@eslint/json` themselves.
- Some opinions inherited from XO are no longer enforced. Add them back inline in your own config if you want them.

**Non-breaking:**

- `@benhigham/eslint-config/browser` and `@benhigham/eslint-config/next` keep their composition; behavior shifts only through their inherited layers.
- All `plugins/*` sub-exports are unchanged.
