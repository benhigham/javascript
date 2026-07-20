import eslintPluginUnicorn from 'eslint-plugin-unicorn';

import { definePlugin } from '../lib/define-plugin.js';

export default definePlugin({
  name: 'unicorn',
  plugin: eslintPluginUnicorn,
  rules: {
    ...eslintPluginUnicorn.configs.recommended.rules,
    'unicorn/no-null': 'off', // null is required by DOM APIs, JSON, and many libraries.
    'unicorn/name-replacements': 'off', // Overly aggressive; common abbreviations (e.g. props, params) are clear.
    // Recommended `error` since v72, with `checkGetHTML` defaulting to on. The
    // read side is a destructive autofix that matches the property name alone —
    // no type information — so any non-DOM object carrying an `innerHTML` key is
    // rewritten to `.getHTML()` and throws at runtime. `Element#getHTML()` is
    // also Chrome 125 / Firefox 128 / Safari 18, so the fix can land below a
    // consumer's browser floor, and this plugin is registered for every file
    // (including Node-only source, which has no DOM at all).
    'unicorn/prefer-dom-node-html-methods': 'off',
  },
});
