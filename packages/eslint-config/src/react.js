import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

import baseKernel from './base.js';
import { browserEnv } from './browser.js';
import { composeConfig } from './lib/compose.js';
import { tsTypeAwareRules } from './lib/tunings.js';
import jsxA11yConfig from './plugins/jsx-a11y.js';
import { reactConfig as testingLibraryConfig } from './plugins/testing-library.js';
import { typescriptLayers } from './typescript.js';

/** @import { Linter } from 'eslint' */

/** @type {Linter.Config} */
const reactConfig = {
  files: ['**/*.{jsx,tsx}'],
  ...eslintReact.configs['recommended-type-checked'],
  settings: {
    ...eslintReact.configs['recommended-type-checked'].settings,
    'react-x': {
      version: 'detect',
    },
  },
};

/** @type {Linter.Config} */
const serviceworkerConfig = {
  languageOptions: {
    globals: {
      ...globals.serviceworker,
    },
  },
};

/**
 * The layers the React export composes, reused by `./next`. Builds on the
 * TypeScript layers and the browser environment, then adds jsx-a11y, the React
 * testing-library variant, `@eslint-react`, and service worker globals.
 * @type {Linter.Config[]}
 */
export const reactLayers = [
  ...baseKernel,
  ...typescriptLayers,
  ...browserEnv,
  jsxA11yConfig,
  testingLibraryConfig,
  reactConfig,
  serviceworkerConfig,
];

/**
 * A shared ESLint configuration for libraries that use React.
 * @type {Linter.Config[]}
 */
const config = composeConfig(reactLayers, { tsRules: tsTypeAwareRules });

export default config;
