import baseKernel from './base.js';
import { composeConfig } from './lib/compose.js';
import { jsConfig as importConfig } from './plugins/import.js';

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration. Uses the base `tsRules` variant (no type-aware
 * tunings, which need `projectService` — see the `/typescript` export).
 * @type {Linter.Config[]}
 */
const config = composeConfig([...baseKernel, importConfig]);

export default config;
