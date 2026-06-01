---
'@benhigham/eslint-config': minor
---

Fix app/browser adoption gaps surfaced consuming `/next` in a static Next app (follow-ups to ADR-0002).

- **vitest:** `prefer-strict-boolean-matchers` and `prefer-to-be-truthy`/`prefer-to-be-falsy` were all enabled, but they are direct inverses — every boolean assertion was flagged by one rule or the other and the autofix oscillated with no satisfiable form. Keep the strict matcher (`toBe(true)`/`toBe(false)`) and turn the loose `toBeTruthy`/`toBeFalsy` pair off.
- **browser/`next`:** `n/no-unsupported-features/node-builtins` is now neutralized on browser source alongside the `n/prefer-global/*` family — it flagged browser globals that Node has only added experimentally (`localStorage`, `Storage`, `navigator`) as unsupported Node features. Node-environment files (config files, build scripts) keep the rule.
- **typescript:** config files are no longer force-listed under `projectService.allowDefaultProject`. A consumer whose tsconfig already includes them (e.g. `include: ["**/*.ts"]`, the pattern the app tsconfigs produce) had each config file in both the project and the default-project allowlist, which typescript-eslint rejects as a parse error; the project service now resolves them through the consumer's tsconfig.
- **import-x:** `no-extraneous-dependencies` no longer sets `includeInternal` — with it on, `package.json#imports` subpath self-imports (`#foo/bar`) were flagged as the package's own missing dependency. The devDependency allowlist now also covers build scripts (`scripts/**`) and runner setup files (`*.setup.*`, e.g. `vitest.setup.ts`) in addition to config, test, and test-support files.
