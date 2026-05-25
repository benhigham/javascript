import eslintConfigPrettier from 'eslint-config-prettier/flat';

import baseConfig, { rules, tsRules } from './base.js';
import { TS_FILES } from './constants.js';
import { jsConfig as importConfig } from './plugins/import.js';

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration.
 * @type {Linter.Config[]}
 */
const config = [
  ...baseConfig,
  importConfig,
  // Re-apply curated rules after intermediate configs so our tunings win.
  { rules },
  { files: [...TS_FILES], rules: tsRules },
  // Apply prettier last to disable formatting rules from preceding presets.
  eslintConfigPrettier,
];

export default config;
