import globals from 'globals';

import compatConfig from './plugins/compat.js';
import { domConfig as testingLibraryConfig } from './plugins/testing-library.js';
import typescriptConfig from './typescript.js';

/** @import { Linter } from 'eslint' */

/**
 * Browser globals that are confusing when used without `window.` prefix.
 * @see {@link https://github.com/facebook/create-react-app/tree/main/packages/confusing-browser-globals}
 */
const confusingGlobals = [
  'addEventListener',
  'blur',
  'close',
  'closed',
  'confirm',
  'defaultStatus',
  'defaultstatus',
  'event',
  'external',
  'find',
  'focus',
  'frameElement',
  'frames',
  'history',
  'innerHeight',
  'innerWidth',
  'length',
  'location',
  'locationbar',
  'menubar',
  'moveBy',
  'moveTo',
  'name',
  'onblur',
  'onerror',
  'onfocus',
  'onload',
  'onresize',
  'onunload',
  'open',
  'opener',
  'opera',
  'outerHeight',
  'outerWidth',
  'pageXOffset',
  'pageYOffset',
  'parent',
  'print',
  'removeEventListener',
  'resizeBy',
  'resizeTo',
  'screen',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scroll',
  'scrollbars',
  'scrollBy',
  'scrollTo',
  'scrollX',
  'scrollY',
  'self',
  'status',
  'statusbar',
  'stop',
  'toolbar',
  'top',
];

/** @type {Linter.Config[]} */
export const baseConfig = [
  compatConfig,
  {
    languageOptions: {
      globals: {
        ...globals.es2026,
        ...globals.browser,
      },
    },
    rules: {
      'no-restricted-globals': ['error', ...confusingGlobals],
    },
  },
];

/**
 * A shared ESLint configuration for libraries that use browser APIs.
 * @type {Linter.Config[]}
 */
const config = [...typescriptConfig, testingLibraryConfig, ...baseConfig];

export default config;
