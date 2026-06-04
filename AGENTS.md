# Agent Instructions

This file provides guidance to AI agents when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## Overview

Monorepo of shareable JavaScript/TypeScript tooling configurations published to npm under the `@benhigham` scope. Packages: eslint-config, prettier-config, stylelint-config, commitlint-config, tsconfig, browserslist-config.

## Agent skills

Project-scoped agent skills live in `.agents/skills/`. `.claude/skills` is a symlink to that directory.

### Issue tracker

Issues are tracked in GitHub Issues for `benhigham/javascript` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default canonical triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain-doc layout. See `docs/agents/domain.md`.

## Commands

```bash
pnpm install                          # Install dependencies
pnpm run lint                         # Lint all packages (via Turborepo)
pnpm run lint:affected                # Lint only packages affected by changes
pnpm run lint:fix                     # Auto-fix lint issues across all packages
pnpm run lint:md                      # markdownlint over all *.md files
pnpm run lint:md:fix                  # markdownlint auto-fix
pnpm run lint:actions                 # actionlint over GitHub Actions workflows
pnpm run test                         # Run package test suites (via Turborepo)
pnpm run format                       # Fix formatting across the repo (root Prettier)
pnpm run format:check                 # Check formatting across the repo (root Prettier)
pnpm changeset                        # Create a changeset for versioning

# Single package
pnpm --filter @benhigham/<pkg> lint   # Lint one package (e.g., eslint-config)
```

Each package has `lint` and `lint:fix` scripts. Formatting is run from the repository root (no per-package `format:check`). `eslint-config` and `stylelint-config` have Vitest suites (a `test` script asserting resolved-config and browser-support behavior), orchestrated via `turbo run test`; the other packages have no tests.

## Toolchain

- **pnpm** workspaces with a `catalog:` for shared dependency versions in `pnpm-workspace.yaml`
- **Turborepo** orchestrates `lint` and `lint:fix` tasks (Prettier runs at root, not via Turborepo)
- **Changesets** for versioning and npm publishing (public access, GitHub changelog)
- **Lefthook** git hooks — pre-commit (piped, fail-fast): Prettier → ESLint → markdownlint → actionlint, all on staged files; commit-msg (commitlint); post-merge on `main` (auto `pnpm install`)
- **mise** manages development tool versions (`.mise.toml`), including `actionlint`
- **markdownlint-cli2** lints all `*.md` files via `.markdownlint-cli2.jsonc` at root
- **Renovate** for automated dependency updates (extends `config:best-practices`)

The monorepo dogfoods its own configs: `@benhigham/prettier-config` (via `prettier.config.js`) and `@benhigham/commitlint-config` (via `commitlint.config.js`), both referenced as `workspace:*` devDependencies.

Dependency pinning has release implications. Bundled plugins that ship to consumers (e.g. `@eslint-react/...`, `@graphql-eslint/...`) are direct `dependencies`, pinned with `^` in each package — bumping one is consumer-facing and **needs a changeset**. Tooling used only to develop this repo (`eslint`, `prettier`, `stylelint`, `@commitlint/cli`) routes through `catalog:` in devDependencies and warrants no release. CONTEXT.md formalizes these as _consumer-facing_ vs _tooling_ dependencies.

## Commit Convention

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint (extends `@commitlint/config-conventional`). Body lines max 100 characters.

Renovate uses default semantic commit types (`chore(deps):` for dependency updates).

## Architecture

### ESLint Config (`packages/eslint-config`)

Uses **ESLint flat config** format (ESLint 10+). Configs compose as arrays via layered entry points:

- **`index.js`** (base JS) — `base.js` (`@eslint/js` recommended + `typescript-eslint` recommended/stylistic + curated rules + bundled plugin configs) + import + prettier
- **`typescript.js`** — base + `typescript-eslint` `*TypeCheckedOnly` presets (scoped to TS files, see below) + `projectService` + curated type-aware rules + prettier
- **`browser.js`** — typescript + compat plugin + testing-library (DOM) + browser globals
- **`react.js`** — typescript + browser + jsx-a11y + `@eslint-react/eslint-plugin` (`recommended-type-checked`) + testing-library (React)
- **`next.js`** — react + next plugin

The `*TypeCheckedOnly` presets ship "global" blocks that disable corresponding core ESLint rules everywhere. `typescript.js` scopes those blocks to TS files only (via `scopeToTs`), so `.js` files keep their core-rule coverage from `base.js`.

Optional plugins exported separately: `plugins/graphql`, `plugins/playwright`, `plugins/tailwindcss`, `plugins/turbo`.

Plugin configs live in `src/plugins/` and follow a consistent pattern: import plugin, define config object with files/rules/plugins, export default. File globs and extension lists are centralized in `src/lib/file-patterns.js` (browser globals in `src/lib/browser-globals.js`).

### Other Packages

- **prettier-config** — Single quotes, trailing commas everywhere
- **stylelint-config** — Extends standard-scss + recess-order; plugins for browser compat, performance, strict values, nesting
- **commitlint-config** — Extends config-conventional; enforces 100-char body line length
- **tsconfig** — 4 environment×emit primitives over an internal `base` kernel: `node` (the `.` default) and `browser` are libraries (`tsc` emits, `nodenext`); `node-app` and `browser-app` are apps (`noEmit`, bundler resolution). No framework configs — consumers compose a primitive with the framework's own config (see `packages/tsconfig/README.md`; ADR-0001)
- **browserslist-config** — Default (a single rolling, modern query `last 2 years and not dead and fully supports es6-module`, landing at ~Baseline "newly"; see ADR-0004) and Node (maintained versions)

## CI

The **CI** workflow runs on push to `main`, on PRs, and on manual dispatch: dependency review (PRs only), commitlint on commit range, format check, lint, test, lint markdown, lint GitHub Actions. The **Release** workflow triggers after CI succeeds on `main` and uses a reusable Changesets release workflow.
