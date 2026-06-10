import eslintPluginNoSecrets from 'eslint-plugin-no-secrets';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'no-secrets',
  plugin: eslintPluginNoSecrets,
  rules: {
    'no-secrets/no-secrets': 'error',
  },
});
