import { composeConfig } from './lib/compose.js';
import { tsTypeAwareRules } from './lib/tunings.js';
import nextConfig from './plugins/next.js';
import { reactLayers } from './react.js';

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration for libraries that use Next.js.
 * @type {Linter.Config[]}
 */
const config = composeConfig([{ ignores: ['.next', '.vercel'] }, ...reactLayers, nextConfig], {
  tsRules: tsTypeAwareRules,
});

export default config;
