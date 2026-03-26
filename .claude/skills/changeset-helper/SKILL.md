---
name: changeset-helper
description: Create a changeset for current changes. Use when packages have been modified and need a changeset before committing, or when the user asks to create a changeset.
---

# Changeset Helper

Create a changeset for the current changes in this monorepo.

## Steps

1. Run `git diff --name-only HEAD` (and check `git status` for untracked files) to identify which files have changed.

2. Map changed files to affected packages by matching paths under `packages/`:
   - `packages/eslint-config/` → `@benhigham/eslint-config`
   - `packages/prettier-config/` → `@benhigham/prettier-config`
   - `packages/stylelint-config/` → `@benhigham/stylelint-config`
   - `packages/commitlint-config/` → `@benhigham/commitlint-config`
   - `packages/tsconfig/` → `@benhigham/tsconfig`
   - `packages/browserslist-config/` → `@benhigham/browserslist-config`

3. If no packages are affected (only root-level files changed), inform the user that no changeset is needed.

4. For each affected package, determine the semver bump by analyzing the nature of the changes:
   - **major**: Breaking changes — removing exports, renaming entry points, dropping support for a tool version, changing peer dependency requirements
   - **minor**: New functionality — adding new entry points/exports, adding new rules or plugins, adding new config variants
   - **patch**: Non-breaking fixes — updating rule severities, adjusting existing config values, fixing bugs, updating dependencies

5. Present the affected packages and suggested bumps to the user for confirmation before proceeding.

6. Write the changeset file directly to `.changeset/` using the standard format:

   ```markdown
   ---
   "@benhigham/package-name": patch
   ---

   Description of what changed
   ```

   The filename should be a random combination of adjectives and nouns joined by hyphens (e.g., `brave-lions-dance.md`), matching the style Changesets CLI uses.

7. Show the user the created changeset file for review.
