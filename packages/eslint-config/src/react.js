import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

import baseKernel from './base.js';
import { browserEnv } from './browser.js';
import { composeConfig } from './lib/compose.js';
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
 * The React-specific layers, reused by `./next`: jsx-a11y, the React
 * testing-library variant, `@eslint-react`, and service worker globals. An
 * additive delta — like `typescriptLayers` and `browserEnv` it does not include
 * the layers it builds on; callers prepend `baseKernel`, `typescriptLayers`, and
 * `browserEnv` (which supply the type-aware and browser-environment behavior the
 * `@eslint-react` type-checked preset needs).
 * @type {Linter.Config[]}
 */
export const reactLayers = [jsxA11yConfig, testingLibraryConfig, reactConfig, serviceworkerConfig];

/**
 * A shared ESLint configuration for libraries that use React.
 * @type {Linter.Config[]}
 */
const config = composeConfig([...baseKernel, ...typescriptLayers, ...browserEnv, ...reactLayers]);

export default config;
