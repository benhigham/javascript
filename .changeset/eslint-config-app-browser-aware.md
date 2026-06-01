---
'@benhigham/eslint-config': minor
---

Distinguish app/browser consumers from Node libraries (see ADR-0002).

- **JSDoc:** the base now composes the `contents` + `logical` + `stylistic` category presets (JS-flavor/TS split preserved) — it validates JSDoc quality without mandating that JSDoc exist. The "tags must exist" `requirements` set (`require-jsdoc`, `require-param`, `require-returns`, …) moves to a new opt-in export, `@benhigham/eslint-config/plugins/jsdoc-required`. **Library consumers** who relied on the base requiring JSDoc must now add this export to keep that enforcement. The per-flavor type-system tunings of the old `recommended-*` bundles are preserved: JS-flavor keeps `jsdoc/no-types` off and both flavors keep `jsdoc/no-undefined-types` off, so JSDoc-typed JS code and references to global/imported types are unaffected.
- **browser/`next`:** the Node-environment `n/prefer-global/*` family is neutralized on browser source — notably `n/prefer-global/process`, which broke Next's build-time `process.env` replacement and shipped a non-existent `node:process` browser import. `compat` is scoped away from Node-environment files (config files, build scripts). The Node-library default (`.`, `./typescript`) is unchanged.
- **vitest:** the config now builds up from `recommended` plus a curated high-value allowlist instead of `configs.all`; `no-hooks`, `require-test-timeout`, and `max-expects` are not enabled, and `prefer-expect-assertions` is scoped to async/callback/loop tests. This yields fewer, more meaningful errors and stops the rule set drifting on plugin minor bumps.
- **import-x:** `no-extraneous-dependencies` now permits devDependencies in test-support directories (`test/`, `tests/`, `__mocks__/`, `__fixtures__/`, `test-utils/`) in addition to config and test files.
