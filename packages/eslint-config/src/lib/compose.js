import eslintConfigPrettier from 'eslint-config-prettier/flat';

import { TS_FILES } from './file-patterns.js';
import { rules, tsRules } from './tunings.js';

/** @import { Linter } from 'eslint' */

/**
 * Compose an export's ordered layers into a complete config array, appending
 * the same curated tail exactly once, last: the language-agnostic `rules`, the
 * TS-scoped non-type-aware `tsRules`, then `eslint-config-prettier`. Appending
 * last is what makes the tunings win over the presets the layers pull in and
 * lets prettier disable every preceding formatting rule.
 *
 * The tail is universal — there is no type-aware variant to pass. The type-aware
 * tunings (`tsCheckedRules`) ride as their own TS-scoped layer inside
 * `typescriptLayers`, beside the `projectService` that resolves them, and are
 * disjoint from `tsRules`; an export is type-aware purely by including those
 * layers, never by configuring this composer.
 *
 * Callers pass raw, non-terminated layers and must never spread an
 * already-terminated sibling export (e.g. `./browser`'s default) — doing so
 * would bake the tail mid-array and let the ordering contract drift, which is
 * exactly what this composer exists to prevent. See ADR-0007.
 * @param {Linter.Config[]} layers The export's ordered layers, with no curated tail and no prettier.
 * @returns {Linter.Config[]} The complete config array.
 */
export const composeConfig = (layers) => [
  ...layers,
  // Re-apply the curated rules after the layers so our tunings win.
  { rules },
  { files: [...TS_FILES], rules: tsRules },
  // Apply prettier last to disable formatting rules from the preceding presets.
  eslintConfigPrettier,
];
