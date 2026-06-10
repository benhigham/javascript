import eslintPluginSonarjs from 'eslint-plugin-sonarjs';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'sonarjs',
  plugin: eslintPluginSonarjs,
  rules: {
    ...eslintPluginSonarjs.configs.recommended.rules,
    // Defer all unused detection to `no-unused-vars`, which honors the
    // `_`-prefix convention and `ignoreRestSiblings`; sonarjs's overlapping
    // rules ignore both (e.g. they flag the destructure-to-omit `{ a: _a,
    // ...rest }`). `no-unused-function-argument` is already off in recommended.
    'sonarjs/unused-import': 'off',
    'sonarjs/no-unused-vars': 'off',
  },
});
