# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo of shareable JavaScript/TypeScript tooling configurations published to npm under the `@benhigham` scope. Packages: eslint-config, prettier-config, stylelint-config, commitlint-config, tsconfig, browserslist-config.

## Commands

```bash
pnpm install                          # Install dependencies
pnpm run lint                         # Lint all packages (via Turborepo)
pnpm run lint:fix                     # Auto-fix lint issues across all packages
pnpm run format:check                 # Check formatting across all packages
pnpm run format                       # Fix formatting across all packages (root-level Prettier)
pnpm changeset                        # Create a changeset for versioning

# Single package
pnpm --filter @benhigham/<pkg> lint   # Lint one package (e.g., eslint-config)
```

Each package has `lint`, `lint:fix`, and `format:check` scripts. There are no test suites.

## Toolchain

- **pnpm** workspaces with a `catalog:` for shared dependency versions in `pnpm-workspace.yaml`
- **Turborepo** orchestrates `lint`, `lint:fix`, and `format:check` tasks
- **Changesets** for versioning and npm publishing (public access, GitHub changelog)
- **Lefthook** git hooks: pre-commit (Prettier on staged files), commit-msg (commitlint), post-merge (auto `pnpm install`)
- **mise** manages development tool versions (`.mise.toml`)
- **Renovate** for automated dependency updates

## Commit Convention

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint (extends `@commitlint/config-conventional`). Body lines max 100 characters.

Renovate uses `build` for dependency updates and `ci` for GitHub Actions updates.

## Architecture

### ESLint Config (`packages/eslint-config`)

Uses **ESLint flat config** format (ESLint 10+). Configs compose as arrays via layered entry points:

- **`index.js`** (base JS) — xo + import + base plugins + prettier
- **`typescript.js`** — base + xo-typescript + TS import/jsdoc variants; relaxes strict type rules for `.js` files
- **`browser.js`** — typescript + compat plugin + testing-library (DOM) + browser globals
- **`react.js`** — typescript + browser + jsx-a11y + xo-react + testing-library (React)
- **`next.js`** — react + next plugin

Optional plugins exported separately: `plugins/graphql`, `plugins/playwright`, `plugins/tailwindcss`, `plugins/turbo`.

Plugin configs live in `src/plugins/` and follow a consistent pattern: import plugin, define config object with files/rules/plugins, export default. File globs and extension lists are centralized in `src/constants.js`.

### Other Packages

- **prettier-config** — Single quotes, trailing commas everywhere
- **stylelint-config** — Extends standard-scss + recess-order; 10 plugins for browser compat, performance, strict values, nesting
- **commitlint-config** — Extends config-conventional
- **tsconfig** — 7 variants: base (NodeNext/strict), browser, react-app, react-library, next, astro, vite
- **browserslist-config** — Default (ES modules + last 2 major versions) and Node (maintained versions)

## CI

The **Main** workflow runs on push to `main`, on PRs, and on manual dispatch: dependency review (PRs only), commitlint on commit range, format check, lint. The **Release** workflow triggers after Main succeeds on `main` and uses a reusable Changesets release workflow.
