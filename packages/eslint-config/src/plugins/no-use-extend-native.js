import eslintPluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'no-use-extend-native',
  plugin: eslintPluginNoUseExtendNative,
  rules: {
    'no-use-extend-native/no-use-extend-native': 'error',
  },
});
