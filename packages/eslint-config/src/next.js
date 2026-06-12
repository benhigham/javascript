import base from './base.js';
import { browserEnvLayers } from './browser.js';
import { composeConfig } from './lib/compose.js';
import nextConfig from './plugins/next.js';
import { reactLayers } from './react.js';
import { typescriptLayers } from './typescript.js';

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration for libraries that use Next.js: the full React
 * stack plus the Next plugin and its build-output ignores.
 * @type {Linter.Config[]}
 */
const config = composeConfig([
  { name: '@benhigham/eslint-config/next/ignores', ignores: ['.next', '.vercel'] },
  ...base,
  ...typescriptLayers,
  ...browserEnvLayers,
  ...reactLayers,
  nextConfig,
]);

export default config;
