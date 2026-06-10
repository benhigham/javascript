import eslintPluginPromise from 'eslint-plugin-promise';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'promise',
  plugin: eslintPluginPromise,
  rules: {
    ...eslintPluginPromise.configs['flat/recommended'].rules,
    'promise/no-return-wrap': ['error', { allowReject: true }],
    'promise/no-return-in-finally': 'error', // Elevated from recommended 'warn' to 'error'.
    'promise/valid-params': 'error', // Elevated from recommended 'warn' to 'error'.
    'promise/prefer-await-to-then': 'error',
  },
});
