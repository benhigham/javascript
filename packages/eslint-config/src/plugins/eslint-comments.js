import eslintPluginEslintComments from '@eslint-community/eslint-plugin-eslint-comments';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: '@eslint-community/eslint-comments',
  purpose: 'eslint-comments',
  plugin: eslintPluginEslintComments,
  rules: {
    ...eslintPluginEslintComments.configs.recommended.rules,
    '@eslint-community/eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    '@eslint-community/eslint-comments/no-unlimited-disable': 'off', // We use `unicorn/no-abusive-eslint-disable` instead.
    '@eslint-community/eslint-comments/no-unused-disable': 'error', // Not in recommended — catches stale disable directives.
  },
});
