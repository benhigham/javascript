import eslintConfigPrettier from 'eslint-config-prettier/flat';

import { TS_FILES } from './file-patterns.js';
import { rules, tsRules as baseTsRules } from './tunings.js';

/** @import { Linter } from 'eslint' */

/**
 * Assemble an export's ordered layers into a complete config array, appending
 * the curated tail exactly once, last: the language-agnostic `rules`, the
 * TS-scoped curated `tsRules`, then `eslint-config-prettier`. Appending last is
 * what makes the tunings win over the presets the layers pull in and lets
 * prettier disable every preceding formatting rule.
 *
 * Callers pass raw, non-terminated layers and must never spread an
 * already-terminated sibling export (e.g. `./browser`'s default) — doing so
 * would bake the tail mid-array and let the ordering contract drift, which is
 * exactly what this assembler exists to prevent. See ADR-0007.
 * @param {Linter.Config[]} layers The export's ordered layers, with no curated tail and no prettier.
 * @param {object} [options]
 * @param {Linter.RulesRecord} [options.tsRules] The TS-file tuning variant to apply last: the base `tsRules` by default, or the type-aware superset (`tsTypeAwareRules`) for the type-aware exports.
 * @returns {Linter.Config[]} The complete config array.
 */
export const composeConfig = (layers, { tsRules = baseTsRules } = {}) => [
  ...layers,
  // Re-apply the curated rules after the layers so our tunings win.
  { rules },
  { files: [...TS_FILES], rules: tsRules },
  // Apply prettier last to disable formatting rules from the preceding presets.
  eslintConfigPrettier,
];
