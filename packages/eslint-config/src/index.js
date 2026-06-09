import base from './base.js';
import { composeConfig } from './lib/compose.js';
import { jsConfig as importConfig } from './plugins/import.js';

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration: the base kernel plus the import layer. Carries
 * no type-aware tunings — those ride in `./typescript`'s layers, which need
 * `projectService`.
 * @type {Linter.Config[]}
 */
const config = composeConfig([...base, importConfig]);

export default config;
