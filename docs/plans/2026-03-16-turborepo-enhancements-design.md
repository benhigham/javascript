# Turborepo Enhancements — Design Doc

_Approved: 2026-03-16_

## Context

benhigham/javascript is a pnpm Turborepo monorepo with 6 JIT config packages (eslint-config, prettier-config, stylelint-config, commitlint-config, tsconfig, browserslist-config). Turbo is installed but underutilised — CI never calls it, `build` task is dead code, `format:check` bypasses turbo, no caching.

## Changes

### 1. turbo.json overhaul

- Remove `build` task (no package has a build script — all JIT)
- Add `globalEnv: ["CI"]`
- Add `cache: false` to `lint:fix` (mutates files, no outputs)
- Keep `lint` and `format:check` as cacheable with `outputs: []`
- No `dependsOn` — packages don't depend on each other for linting

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["CI"],
  "tasks": {
    "lint": { "outputs": [] },
    "lint:fix": { "cache": false },
    "format:check": { "outputs": [] }
  }
}
```

### 2. Root package.json scripts

- Remove `build` script
- Change `format:check` from `prettier --check .` to `turbo run format:check`
- `format` (write) stays as root prettier (intentional — whole-repo formatting)
- `lint` and `lint:fix` already delegate to turbo

```json
"scripts": {
    "changeset": "changeset",
    "changeset:status": "changeset status",
    "format": "prettier --write .",
    "format:check": "turbo run format:check",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "release": "changeset publish",
    "version": "changeset version"
}
```

### 3. Package scripts — add lint/format:check where missing

- Add `"lint": "eslint ."` and `"lint:fix": "eslint --fix ."` to: browserslist-config, commitlint-config, prettier-config, stylelint-config, tsconfig
- Add `"format:check": "prettier --check ."` to commitlint-config (only one missing it)
- Add devDeps to all 5 packages: `"eslint": "catalog:"`, `"@benhigham/eslint-config": "workspace:*"`
- Add `"prettier": "catalog:"` to commitlint-config (only one missing it)
- eslint-config already has all scripts — no changes needed
- Confirmed: `@benhigham/eslint-config` declares `peerDependencies: { "eslint": ">=10.0.0" }` — compatible

### 4. CI workflow (main.yml)

- Fix action versions: checkout@v6→@v4, setup-node@v6→@v4
- Add `actions/cache@v4` for `.turbo/` directory
  - Key: `turbo-${{ runner.os }}-${{ hashFiles('**/turbo.json', '**/pnpm-lock.yaml') }}`
  - Restore key: `turbo-${{ runner.os }}-`
- Add `TURBO_LOG_ORDER: grouped` at job-level `env:` block
- Add `Lint` step: `pnpm run lint`
- `format:check` step now goes through turbo via root script change
- Keep `fetch-depth: 0` (changesets needs full history)

### 5. Expand pnpm catalog

- Add `eslint: ^10.0.0` (now used in 6 packages)
- Add single-consumer deps for consistency: `stylelint`, `browserslist`, `@commitlint/types`
- Exact version ranges confirmed during implementation from current lockfile

## Deferred

- Remote caching (Vercel) — revisit when repo grows
- Per-package turbo.json overrides — not needed while packages are uniform
- `turbo boundaries` — experimental, revisit later
- `turbo watch` — low value for config packages
- `dependsOn` / transit pattern — add when inter-package deps appear
- `--affected` in CI — add when package count makes full runs slow

## Constraints

- All packages are JIT (source-only, no compilation)
- No inter-package dependencies for linting
- Changesets + npm Trusted Publishers (OIDC) for releases
- LEFTHOOK=0 in sandbox (no build artifacts)
- PR-based workflow — no direct-to-main pushes
