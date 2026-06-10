import eslintPluginDepend from 'eslint-plugin-depend';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'depend',
  plugin: eslintPluginDepend,
  rules: {
    'depend/ban-dependencies': 'error',
  },
});
