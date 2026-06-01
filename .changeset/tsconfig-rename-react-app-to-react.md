---
'@benhigham/tsconfig': major
---

Rename the `react-app.json` config to `react.json`.

The export subpath `@benhigham/tsconfig/react-app.json` is removed in favour of
`@benhigham/tsconfig/react.json`; the underlying `src/react-app.json` is renamed
to `src/react.json` and the internal `next.json` / `astro.json` / `vite.json`
`extends` chains are repointed. With the `react-library` config gone (removed in
2.0.0), the React variant is now the only React config, so the app-vs-library
qualifier in `react-app` is redundant — `react` also lines up with
`@benhigham/eslint-config`'s `./react` entry point.

This is a breaking change. Update consumer `tsconfig.json`s:

```diff
-  "extends": "@benhigham/tsconfig/react-app.json"
+  "extends": "@benhigham/tsconfig/react.json"
```
