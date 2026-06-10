import eslintPluginTurbo from 'eslint-plugin-turbo';

import { definePlugin } from '../lib/define-plugin.js';

// `files: null` — no `files` property; consumers scope this to their project.
export default definePlugin({
  name: 'turbo',
  plugin: eslintPluginTurbo,
  files: null,
  settings: {
    ...eslintPluginTurbo.configs['flat/recommended'].settings,
  },
  rules: {
    'turbo/no-undeclared-env-vars': 'error',
  },
});
